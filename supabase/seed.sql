-- ============================================================
-- FOXMEDIA / SOFTSYNC INITIAL SEED DATA
-- Default Products & Settings
-- ============================================================

-- 1. Insert Default Settings
INSERT INTO public.settings (id, business_name, whatsapp_number, support_hours, website_url)
VALUES (
    'general',
    'FOXMEDIA',
    '9865488886',
    '10:30 AM – 8:30 PM',
    'https://foxmedia.in'
)
ON CONFLICT (id) DO UPDATE
SET business_name = EXCLUDED.business_name,
    whatsapp_number = EXCLUDED.whatsapp_number,
    support_hours = EXCLUDED.support_hours,
    website_url = EXCLUDED.website_url;

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
