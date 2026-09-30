-- ============================================================
-- FIX: PERMISSIONS, SINGLE-USE LINKS & ADOBE CLOAKED REDIRECT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zvckwgfqmmlistpigxra/sql
-- ============================================================

-- 1. ADD target_url COLUMN TO redemption_links
ALTER TABLE public.redemption_links
ADD COLUMN IF NOT EXISTS target_url TEXT NULL;

-- 2. ADD adobe_target_url TO settings
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS adobe_target_url TEXT NOT NULL DEFAULT 'https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bid%5D=660F1BCF287345C0D465E4FF9D4A2AF6&cli=ace&co=IN&ref-order-id=D646F17C1FD5517747959836178529&utm_medium=Email&utm_campaign=GMI%20%3A%20CLCM%20Abandon_Cart_Reminder_WWEN&correlationId=f54aa9ff-26f3-4464-8c2b-559fb9568d94-0&utm_source=chatgpt.com&fbclid=PAT01DUAR_QldleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafvyE2y81w17BrCeJDgtzbfqzIhhxcpXQ9CqDbHe4mmKzrRqiPDPsv67OsfLw_aem_CyIp_6AI-ZvhgP8Ek2o2hQ&ss=checkout';

UPDATE public.settings
SET adobe_target_url = 'https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bid%5D=660F1BCF287345C0D465E4FF9D4A2AF6&cli=ace&co=IN&ref-order-id=D646F17C1FD5517747959836178529&utm_medium=Email&utm_campaign=GMI%20%3A%20CLCM%20Abandon_Cart_Reminder_WWEN&correlationId=f54aa9ff-26f3-4464-8c2b-559fb9568d94-0&utm_source=chatgpt.com&fbclid=PAT01DUAR_QldleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafvyE2y81w17BrCeJDgtzbfqzIhhxcpXQ9CqDbHe4mmKzrRqiPDPsv67OsfLw_aem_CyIp_6AI-ZvhgP8Ek2o2hQ&ss=checkout'
WHERE id = 'general';

-- 3. CONFIRM ADMIN USER (rameshtn007@gmail.com)
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'rameshtn007@gmail.com';

-- 4. INSERT/UPDATE ADMIN PROFILE
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'rameshtn007@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', email = 'rameshtn007@gmail.com';

-- 5. FIX RLS POLICIES FOR REDEMPTION LINKS
DROP POLICY IF EXISTS "Admins full access to redemption links" ON public.redemption_links;
CREATE POLICY "Admins full access to redemption links"
    ON public.redemption_links FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'email' = 'rameshtn007@gmail.com' 
        OR public.is_admin()
    )
    WITH CHECK (
        auth.jwt() ->> 'email' = 'rameshtn007@gmail.com' 
        OR public.is_admin()
    );

-- 6. UPDATE ATOMIC REDEMPTION FUNCTIONS FOR CLOAKED REDIRECTION
CREATE OR REPLACE FUNCTION public.validate_redemption_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_link RECORD;
BEGIN
    IF p_token IS NULL OR trim(p_token) = '' THEN
        RETURN jsonb_build_object('valid', false, 'status', 'INVALID', 'error', 'Invalid Redemption Link');
    END IF;

    -- Lookup link by token OR custom customer name (case-insensitive)
    SELECT l.*, p.name AS product_name, p.slug AS product_slug, 
           p.duration AS product_duration, p.description AS product_description,
           p.features AS product_features
    INTO v_link
    FROM public.redemption_links l
    JOIN public.products p ON l.product_id = p.id
    WHERE l.token = trim(p_token) OR lower(l.custom_name) = lower(trim(p_token))
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'status', 'INVALID', 'error', 'Invalid Redemption Link');
    END IF;

    IF v_link.status = 'DISABLED' THEN
        RETURN jsonb_build_object('valid', false, 'status', 'DISABLED', 'error', 'This redemption link has been disabled.');
    END IF;

    IF v_link.expires_at IS NOT NULL AND v_link.expires_at < timezone('utc'::text, now()) THEN
        UPDATE public.redemption_links SET status = 'EXPIRED' WHERE id = v_link.id AND status = 'ACTIVE';
        RETURN jsonb_build_object('valid', false, 'status', 'EXPIRED', 'error', 'This redemption link has expired.');
    END IF;

    IF v_link.usage_type = 'SINGLE' AND (v_link.status = 'USED' OR v_link.current_uses >= 1) THEN
        RETURN jsonb_build_object('valid', false, 'status', 'USED', 'error', 'This redemption link has already been used.', 'used_at', v_link.used_at);
    END IF;

    IF v_link.usage_type = 'MULTIPLE' AND (v_link.status = 'LIMIT_REACHED' OR v_link.current_uses >= v_link.max_uses) THEN
        RETURN jsonb_build_object('valid', false, 'status', 'LIMIT_REACHED', 'error', 'This link has reached its maximum usage limit.');
    END IF;

    RETURN jsonb_build_object(
        'valid', true,
        'status', 'ACTIVE',
        'product_name', v_link.product_name,
        'product_slug', v_link.product_slug,
        'product_duration', v_link.product_duration,
        'product_description', v_link.product_description,
        'product_features', v_link.product_features,
        'usage_type', v_link.usage_type,
        'expires_at', v_link.expires_at,
        'custom_name', v_link.custom_name
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.redeem_redemption_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_link RECORD;
    v_new_uses INTEGER;
    v_new_status TEXT;
    v_target_url TEXT;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
    IF p_token IS NULL OR trim(p_token) = '' THEN
        RETURN jsonb_build_object('success', false, 'status', 'INVALID', 'error', 'Invalid Redemption Link');
    END IF;

    SELECT l.*, p.name AS product_name, p.duration AS product_duration
    INTO v_link
    FROM public.redemption_links l
    JOIN public.products p ON l.product_id = p.id
    WHERE l.token = trim(p_token) OR lower(l.custom_name) = lower(trim(p_token))
    FOR UPDATE OF l;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'status', 'INVALID', 'error', 'Invalid Redemption Link');
    END IF;

    IF v_link.status = 'DISABLED' THEN
        RETURN jsonb_build_object('success', false, 'status', 'DISABLED', 'error', 'This redemption link has been disabled.');
    END IF;

    IF v_link.expires_at IS NOT NULL AND v_link.expires_at < v_now THEN
        UPDATE public.redemption_links SET status = 'EXPIRED' WHERE id = v_link.id;
        RETURN jsonb_build_object('success', false, 'status', 'EXPIRED', 'error', 'This redemption link has expired.');
    END IF;

    IF v_link.usage_type = 'SINGLE' AND (v_link.status = 'USED' OR v_link.current_uses >= 1) THEN
        RETURN jsonb_build_object('success', false, 'status', 'USED', 'error', 'This redemption link has already been used.', 'used_at', v_link.used_at);
    END IF;

    IF v_link.usage_type = 'MULTIPLE' AND (v_link.status = 'LIMIT_REACHED' OR v_link.current_uses >= v_link.max_uses) THEN
        RETURN jsonb_build_object('success', false, 'status', 'LIMIT_REACHED', 'error', 'This link has reached its maximum usage limit.');
    END IF;

    v_new_uses := v_link.current_uses + 1;
    IF v_link.usage_type = 'SINGLE' THEN
        v_new_status := 'USED';
    ELSE
        IF v_new_uses >= v_link.max_uses THEN
            v_new_status := 'LIMIT_REACHED';
        ELSE
            v_new_status := 'ACTIVE';
        END IF;
    END IF;

    UPDATE public.redemption_links
    SET current_uses = v_new_uses,
        status = v_new_status,
        used_at = v_now
    WHERE id = v_link.id;

    INSERT INTO public.redemptions (redemption_link_id, redemption_number, redeemed_at)
    VALUES (v_link.id, v_new_uses, v_now);

    SELECT COALESCE(v_link.target_url, s.adobe_target_url, 'https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bid%5D=660F1BCF287345C0D465E4FF9D4A2AF6&cli=ace&co=IN&ref-order-id=D646F17C1FD5517747959836178529&utm_medium=Email&utm_campaign=GMI%20%3A%20CLCM%20Abandon_Cart_Reminder_WWEN&correlationId=f54aa9ff-26f3-4464-8c2b-559fb9568d94-0&utm_source=chatgpt.com&fbclid=PAT01DUAR_QldleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafvyE2y81w17BrCeJDgtzbfqzIhhxcpXQ9CqDbHe4mmKzrRqiPDPsv67OsfLw_aem_CyIp_6AI-ZvhgP8Ek2o2hQ&ss=checkout')
    INTO v_target_url
    FROM public.settings s
    WHERE s.id = 'general'
    LIMIT 1;

    IF v_target_url IS NULL OR trim(v_target_url) = '' THEN
        v_target_url := 'https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bid%5D=660F1BCF287345C0D465E4FF9D4A2AF6&cli=ace&co=IN&ref-order-id=D646F17C1FD5517747959836178529&utm_medium=Email&utm_campaign=GMI%20%3A%20CLCM%20Abandon_Cart_Reminder_WWEN&correlationId=f54aa9ff-26f3-4464-8c2b-559fb9568d94-0&utm_source=chatgpt.com&fbclid=PAT01DUAR_QldleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafvyE2y81w17BrCeJDgtzbfqzIhhxcpXQ9CqDbHe4mmKzrRqiPDPsv67OsfLw_aem_CyIp_6AI-ZvhgP8Ek2o2hQ&ss=checkout';
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'status', 'SUCCESS',
        'message', 'Redemption Successful',
        'target_url', v_target_url,
        'product_name', v_link.product_name,
        'duration', v_link.product_duration,
        'redeemed_at', v_now,
        'redemption_number', v_new_uses
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_redemption_token(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_redemption_token(TEXT) TO anon, authenticated;
