-- ============================================================
-- FOXMEDIA / SOFTSYNC INITIAL SEED DATA
-- Default Products & Settings
-- ============================================================

-- 1. Insert Default Settings
INSERT INTO public.settings (id, business_name, whatsapp_number, support_hours, website_url, adobe_target_url)
VALUES (
    'general',
    'FOXMEDIA',
    '9865488886',
    '10:30 AM – 8:30 PM',
    'https://foxmedia.in',
    'https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bid%5D=660F1BCF287345C0D465E4FF9D4A2AF6&cli=ace&co=IN&ref-order-id=D646F17C1FD5517747959836178529&utm_medium=Email&utm_campaign=GMI%20%3A%20CLCM%20Abandon_Cart_Reminder_WWEN&correlationId=f54aa9ff-26f3-4464-8c2b-559fb9568d94-0&utm_source=chatgpt.com&fbclid=PAT01DUAR_QldleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafvyE2y81w17BrCeJDgtzbfqzIhhxcpXQ9CqDbHe4mmKzrRqiPDPsv67OsfLw_aem_CyIp_6AI-ZvhgP8Ek2o2hQ&ss=checkout'
)
ON CONFLICT (id) DO UPDATE
SET business_name = EXCLUDED.business_name,
    whatsapp_number = EXCLUDED.whatsapp_number,
    support_hours = EXCLUDED.support_hours,
    website_url = EXCLUDED.website_url,
    adobe_target_url = EXCLUDED.adobe_target_url;


-- 2. Insert Default Products
INSERT INTO public.products (id, name, slug, description, price, duration, features, active)
VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'Adobe Pro Plus',
    'adobe-pro-plus-4m',
    'Perfect for short-term projects with full Adobe Creative Cloud suite capabilities and cloud power.',
    1199,
    '4 Month',
    '[
        "4 Months Full Access",
        "No profiles switching problem",
        "All Standard Features",
        "FireFly Video Generations",
        "4000 AI Credits Per Month",
        "1TB Cloud Storage",
        "Advanced AI Features (Nano Banana)",
        "Priority Support 24/7"
    ]'::jsonb,
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    'Canva Pro',
    'canva-pro-1y',
    'Design like a pro with full 100M+ premium asset library and AI-powered design tools.',
    199,
    '1 Year',
    '[
        "1 Year Full Access",
        "100+ Million Premium Assets",
        "Remove Backgrounds Instantly",
        "Magic Resize & Animation",
        "All Fonts",
        "Premium Templates",
        "Official License"
    ]'::jsonb,
    true
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    duration = EXCLUDED.duration,
    features = EXCLUDED.features,
    active = EXCLUDED.active;
