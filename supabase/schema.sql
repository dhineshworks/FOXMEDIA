-- ============================================================
-- FOXMEDIA / SOFTSYNC SUPABASE SCHEMA & SECURITY CONFIGURATION
-- Production-Ready Serverless Architecture
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. TABLES
-- ============================================================

-- 2.1 PROFILES (Role-based access control linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    duration TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 REDEMPTION LINKS
CREATE TABLE IF NOT EXISTS public.redemption_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    custom_name TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    target_url TEXT NULL,
    usage_type TEXT NOT NULL DEFAULT 'SINGLE' CHECK (usage_type IN ('SINGLE', 'MULTIPLE')),
    max_uses INTEGER NOT NULL DEFAULT 1 CHECK (max_uses >= 1),
    current_uses INTEGER NOT NULL DEFAULT 0 CHECK (current_uses >= 0),
    expires_at TIMESTAMPTZ NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED', 'DISABLED', 'LIMIT_REACHED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    used_at TIMESTAMPTZ NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2.4 REDEMPTIONS (Audit log of every redemption event)
CREATE TABLE IF NOT EXISTS public.redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    redemption_link_id UUID NOT NULL REFERENCES public.redemption_links(id) ON DELETE CASCADE,
    redemption_number INTEGER NOT NULL DEFAULT 1,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ip_hash TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.5 SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'general',
    business_name TEXT NOT NULL DEFAULT 'FOXMEDIA',
    whatsapp_number TEXT NOT NULL DEFAULT '9865488886',
    support_hours TEXT NOT NULL DEFAULT '10:30 AM – 8:30 PM',
    website_url TEXT NOT NULL DEFAULT 'https://foxmedia.in',
    adobe_target_url TEXT NOT NULL DEFAULT 'https://dhineshworks.github.io/softsync-shop/l/?id=Foxmedia',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);


-- ============================================================
-- 3. INDEXES FOR HIGH PERFORMANCE & FAST LOOKUPS
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_redemption_links_token ON public.redemption_links(token);
CREATE INDEX IF NOT EXISTS idx_redemption_links_status ON public.redemption_links(status);
CREATE INDEX IF NOT EXISTS idx_redemption_links_product ON public.redemption_links(product_id);
CREATE INDEX IF NOT EXISTS idx_redemption_links_expires_at ON public.redemption_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_redemptions_link_id ON public.redemptions(redemption_link_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemption_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.2 PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 4.3 REDEMPTION LINKS POLICIES
-- Strict Security: Anonymous users CANNOT read redemption_links table directly!
-- Public redemption is ONLY through validate_redemption_token() and redeem_redemption_token() RPCs.
DROP POLICY IF EXISTS "Admins full access to redemption links" ON public.redemption_links;
CREATE POLICY "Admins full access to redemption links"
    ON public.redemption_links FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.4 REDEMPTIONS POLICIES
DROP POLICY IF EXISTS "Admins can view redemptions" ON public.redemptions;
CREATE POLICY "Admins can view redemptions"
    ON public.redemptions FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- 4.5 SETTINGS POLICIES
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings"
    ON public.settings FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can update settings" ON public.settings;
CREATE POLICY "Admins can update settings"
    ON public.settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());


-- ============================================================
-- 5. SECURE DATABASE FUNCTIONS / RPC
-- ============================================================

-- 5.1 VALIDATE REDEMPTION TOKEN (Safe public RPC)
CREATE OR REPLACE FUNCTION public.validate_redemption_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_link RECORD;
    v_product RECORD;
    v_status TEXT;
BEGIN
    -- Input sanitization
    IF p_token IS NULL OR trim(p_token) = '' THEN
        RETURN jsonb_build_object(
            'valid', false,
            'status', 'INVALID',
            'error', 'Invalid Redemption Link'
        );
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
        RETURN jsonb_build_object(
            'valid', false,
            'status', 'INVALID',
            'error', 'Invalid Redemption Link'
        );
    END IF;

    -- Check if disabled
    IF v_link.status = 'DISABLED' THEN
        RETURN jsonb_build_object(
            'valid', false,
            'status', 'DISABLED',
            'error', 'This redemption link has been disabled.',
            'product_name', v_link.product_name,
            'product_duration', v_link.product_duration
        );
    END IF;

    -- Check expiration
    IF v_link.expires_at IS NOT NULL AND v_link.expires_at < timezone('utc'::text, now()) THEN
        -- Dynamically update expired status
        UPDATE public.redemption_links
        SET status = 'EXPIRED'
        WHERE id = v_link.id AND status = 'ACTIVE';

        RETURN jsonb_build_object(
            'valid', false,
            'status', 'EXPIRED',
            'error', 'This redemption link has expired.',
            'product_name', v_link.product_name,
            'product_duration', v_link.product_duration,
            'expires_at', v_link.expires_at
        );
    END IF;

    -- Check single use already used
    IF v_link.usage_type = 'SINGLE' AND (v_link.status = 'USED' OR v_link.current_uses >= 1) THEN
        RETURN jsonb_build_object(
            'valid', false,
            'status', 'USED',
            'error', 'This redemption link has already been used.',
            'product_name', v_link.product_name,
            'product_duration', v_link.product_duration,
            'used_at', v_link.used_at
        );
    END IF;

    -- Check multi-use limit reached
    IF v_link.usage_type = 'MULTIPLE' AND (v_link.status = 'LIMIT_REACHED' OR v_link.current_uses >= v_link.max_uses) THEN
        RETURN jsonb_build_object(
            'valid', false,
            'status', 'LIMIT_REACHED',
            'error', 'This link has reached its maximum usage limit.',
            'product_name', v_link.product_name,
            'product_duration', v_link.product_duration
        );
    END IF;

    -- Link is active and valid! (Notice: target_url is strictly kept secret until redemption!)
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

-- Grant execute on validate_redemption_token to public
GRANT EXECUTE ON FUNCTION public.validate_redemption_token(TEXT) TO anon, authenticated;


-- 5.2 REDEEM REDEMPTION TOKEN (Atomic, race-condition protected, returns cloaked destination URL)
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
        RETURN jsonb_build_object(
            'success', false,
            'status', 'INVALID',
            'error', 'Invalid Redemption Link'
        );
    END IF;

    -- CRITICAL: Lock row FOR UPDATE to prevent race conditions during concurrent calls
    SELECT l.*, p.name AS product_name, p.duration AS product_duration
    INTO v_link
    FROM public.redemption_links l
    JOIN public.products p ON l.product_id = p.id
    WHERE l.token = trim(p_token) OR lower(l.custom_name) = lower(trim(p_token))
    FOR UPDATE OF l;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'INVALID',
            'error', 'Invalid Redemption Link'
        );
    END IF;

    -- 1. Check Disabled
    IF v_link.status = 'DISABLED' THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'DISABLED',
            'error', 'This redemption link has been disabled.'
        );
    END IF;

    -- 2. Check Expiration
    IF v_link.expires_at IS NOT NULL AND v_link.expires_at < v_now THEN
        UPDATE public.redemption_links
        SET status = 'EXPIRED'
        WHERE id = v_link.id;

        RETURN jsonb_build_object(
            'success', false,
            'status', 'EXPIRED',
            'error', 'This redemption link has expired.'
        );
    END IF;

    -- 3. Check Single Use
    IF v_link.usage_type = 'SINGLE' AND (v_link.status = 'USED' OR v_link.current_uses >= 1) THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'USED',
            'error', 'This redemption link has already been used.',
            'used_at', v_link.used_at
        );
    END IF;

    -- 4. Check Multiple Use
    IF v_link.usage_type = 'MULTIPLE' AND (v_link.status = 'LIMIT_REACHED' OR v_link.current_uses >= v_link.max_uses) THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'LIMIT_REACHED',
            'error', 'This link has reached its maximum usage limit.'
        );
    END IF;

    -- 5. Calculate new state atomically
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

    -- 6. Update link atomically
    UPDATE public.redemption_links
    SET current_uses = v_new_uses,
        status = v_new_status,
        used_at = v_now
    WHERE id = v_link.id;

    -- 7. Insert redemption audit log
    INSERT INTO public.redemptions (
        redemption_link_id,
        redemption_number,
        redeemed_at
    ) VALUES (
        v_link.id,
        v_new_uses,
        v_now
    );

    -- 8. Resolve secret cloaked target URL
    SELECT COALESCE(v_link.target_url, s.adobe_target_url, 'https://dhineshworks.github.io/softsync-shop/l/?id=Foxmedia')
    INTO v_target_url
    FROM public.settings s
    WHERE s.id = 'general'
    LIMIT 1;

    IF v_target_url IS NULL OR trim(v_target_url) = '' THEN
        v_target_url := 'https://dhineshworks.github.io/softsync-shop/l/?id=Foxmedia';
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

-- Grant execute on redeem_redemption_token to public
GRANT EXECUTE ON FUNCTION public.redeem_redemption_token(TEXT) TO anon, authenticated;



-- ============================================================
-- 6. AUTH TRIGGER: Auto-create profile on Supabase Auth SignUp
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        new.id,
        new.email,
        -- Default first user or admin email to admin if desired, otherwise customer
        CASE 
            WHEN new.email = 'admin@foxmedia.com' THEN 'admin'
            ELSE 'customer'
        END
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
