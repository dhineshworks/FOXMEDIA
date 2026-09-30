import type { Product, RedemptionLink, RedemptionRecord, Settings, ValidationResponse, RedeemResponse } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'foxmedia_demo_products',
  LINKS: 'foxmedia_demo_links',
  REDEMPTIONS: 'foxmedia_demo_redemptions',
  SETTINGS: 'foxmedia_demo_settings',
  AUTH: 'foxmedia_demo_auth',
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Adobe Pro Plus',
    slug: 'adobe-pro-plus-4m',
    description: 'Perfect for short-term projects with full Adobe Creative Cloud suite capabilities and cloud power.',
    price: 1199,
    duration: '4 Month',
    features: [
      '4 Months Full Access',
      'No profiles switching problem',
      'All Standard Features',
      'FireFly Video Generations',
      '4000 AI Credits Per Month',
      '1TB Cloud Storage',
      'Advanced AI Features (Nano Banana)',
      'Priority Support 24/7'
    ],
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Canva Pro',
    slug: 'canva-pro-1y',
    description: 'Design like a pro with full 100M+ premium asset library and AI-powered design tools.',
    price: 199,
    duration: '1 Year',
    features: [
      '1 Year Full Access',
      '100+ Million Premium Assets',
      'Remove Backgrounds Instantly',
      'Magic Resize & Animation',
      'All Fonts',
      'Premium Templates',
      'Official License'
    ],
    active: true,
    created_at: new Date().toISOString()
  }
];

const DEFAULT_SETTINGS: Settings = {
  id: 'general',
  business_name: 'FOXMEDIA',
  whatsapp_number: '9865488886',
  support_hours: '10:30 AM – 8:30 PM',
  website_url: window.location.origin,
  adobe_target_url: 'https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bid%5D=660F1BCF287345C0D465E4FF9D4A2AF6&cli=ace&co=IN&ref-order-id=D646F17C1FD5517747959836178529&utm_medium=Email&utm_campaign=GMI%20%3A%20CLCM%20Abandon_Cart_Reminder_WWEN&correlationId=f54aa9ff-26f3-4464-8c2b-559fb9568d94-0&utm_source=chatgpt.com&fbclid=PAT01DUAR_QldleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafvyE2y81w17BrCeJDgtzbfqzIhhxcpXQ9CqDbHe4mmKzrRqiPDPsv67OsfLw_aem_CyIp_6AI-ZvhgP8Ek2o2hQ&ss=checkout'
};



const INITIAL_DEMO_LINKS: RedemptionLink[] = [
  {
    id: 'link-demo-1',
    product_id: '00000000-0000-0000-0000-000000000001',
    custom_name: 'demo-customer-01',
    token: 'r_demoReadyAdobe',
    usage_type: 'SINGLE',
    max_uses: 1,
    current_uses: 0,
    expires_at: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    used_at: null,
  },
  {
    id: 'link-demo-2',
    product_id: '00000000-0000-0000-0000-000000000001',
    custom_name: 'demo-used-link',
    token: 'r_demoUsedAdobe',
    usage_type: 'SINGLE',
    max_uses: 1,
    current_uses: 1,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    status: 'USED',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    used_at: new Date().toISOString(),
  },
  {
    id: 'link-demo-3',
    product_id: '00000000-0000-0000-0000-000000000001',
    custom_name: 'demo-expired-link',
    token: 'r_demoExpiredAdobe',
    usage_type: 'SINGLE',
    max_uses: 1,
    current_uses: 0,
    expires_at: new Date(Date.now() - 3600000).toISOString(),
    status: 'EXPIRED',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    used_at: null,
  }
];

class MockStore {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  getProducts(): Product[] {
    return this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  }

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...product, updated_at: new Date().toISOString() };
    } else {
      products.push(product);
    }
    this.setStorage(STORAGE_KEYS.PRODUCTS, products);
    return product;
  }

  getSettings(): Settings {
    return this.getStorage<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  saveSettings(settings: Settings): Settings {
    const updated = { ...settings, updated_at: new Date().toISOString() };
    this.setStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  getLinks(): RedemptionLink[] {
    const links = this.getStorage<RedemptionLink[]>(STORAGE_KEYS.LINKS, INITIAL_DEMO_LINKS);
    const products = this.getProducts();
    
    // Check and update expired status dynamically
    const now = Date.now();
    let updated = false;
    const synced = links.map(link => {
      const product = products.find(p => p.id === link.product_id);
      if (link.expires_at && new Date(link.expires_at).getTime() < now && link.status === 'ACTIVE') {
        updated = true;
        return { ...link, status: 'EXPIRED' as const, product };
      }
      return { ...link, product };
    });

    if (updated) {
      this.setStorage(STORAGE_KEYS.LINKS, synced.map(({ product, ...rest }) => rest));
    }
    return synced;
  }

  saveLinks(newLinks: RedemptionLink[]): void {
    const existing = this.getLinks().map(({ product, ...rest }) => rest);
    const combined = [...newLinks, ...existing];
    this.setStorage(STORAGE_KEYS.LINKS, combined);
  }

  updateLinkStatus(linkId: string, status: RedemptionLink['status']): boolean {
    const links = this.getLinks();
    const link = links.find(l => l.id === linkId);
    if (link) {
      link.status = status;
      this.setStorage(STORAGE_KEYS.LINKS, links.map(({ product, ...rest }) => rest));
      return true;
    }
    return false;
  }

  deleteLink(linkId: string): boolean {
    const links = this.getLinks();
    const filtered = links.filter(l => l.id !== linkId);
    this.setStorage(STORAGE_KEYS.LINKS, filtered.map(({ product, ...rest }) => rest));
    return true;
  }

  validateToken(token: string): ValidationResponse {
    if (!token || !token.trim()) {
      return { valid: false, status: 'INVALID', error: 'Invalid Redemption Link' };
    }
    
    const links = this.getLinks();
    const clean = token.trim();
    const link = links.find(l => l.token === clean || l.custom_name.toLowerCase() === clean.toLowerCase());
    if (!link) {
      return { valid: false, status: 'INVALID', error: 'Invalid Redemption Link' };
    }

    const product = this.getProducts().find(p => p.id === link.product_id);

    if (link.status === 'DISABLED') {
      return {
        valid: false,
        status: 'DISABLED',
        error: 'This redemption link has been disabled.',
        product_name: product?.name,
        product_duration: product?.duration,
      };
    }

    if (link.expires_at && new Date(link.expires_at).getTime() < Date.now()) {
      this.updateLinkStatus(link.id, 'EXPIRED');
      return {
        valid: false,
        status: 'EXPIRED',
        error: 'This redemption link has expired.',
        product_name: product?.name,
        product_duration: product?.duration,
        expires_at: link.expires_at,
      };
    }

    if (link.usage_type === 'SINGLE' && (link.status === 'USED' || link.current_uses >= 1)) {
      return {
        valid: false,
        status: 'USED',
        error: 'This redemption link has already been used.',
        product_name: product?.name,
        product_duration: product?.duration,
        used_at: link.used_at,
      };
    }

    if (link.usage_type === 'MULTIPLE' && (link.status === 'LIMIT_REACHED' || link.current_uses >= link.max_uses)) {
      return {
        valid: false,
        status: 'LIMIT_REACHED',
        error: 'This link has reached its maximum usage limit.',
        product_name: product?.name,
        product_duration: product?.duration,
      };
    }

    return {
      valid: true,
      status: 'ACTIVE',
      product_name: product?.name || 'Adobe Pro Plus',
      product_slug: product?.slug || 'adobe-pro-plus-4m',
      product_duration: product?.duration || '4 Month',
      product_description: product?.description || '',
      product_features: product?.features || [],
      usage_type: link.usage_type,
      expires_at: link.expires_at,
      custom_name: link.custom_name,
    };
  }

  redeemToken(token: string): RedeemResponse {
    const validation = this.validateToken(token);
    if (!validation.valid) {
      return {
        success: false,
        status: validation.status,
        error: validation.error || 'Unable to redeem link.',
      };
    }

    const links = this.getLinks();
    const clean = token.trim();
    const link = links.find(l => l.token === clean || l.custom_name.toLowerCase() === clean.toLowerCase());
    if (!link) {
      return { success: false, status: 'INVALID', error: 'Invalid Redemption Link' };
    }

    const product = this.getProducts().find(p => p.id === link.product_id);
    const settings = this.getSettings();
    const nowIso = new Date().toISOString();
    const newUses = link.current_uses + 1;
    let newStatus: RedemptionLink['status'] = 'ACTIVE';

    if (link.usage_type === 'SINGLE') {
      newStatus = 'USED';
    } else if (newUses >= link.max_uses) {
      newStatus = 'LIMIT_REACHED';
    }

    link.current_uses = newUses;
    link.status = newStatus;
    link.used_at = nowIso;

    this.setStorage(STORAGE_KEYS.LINKS, links.map(({ product, ...rest }) => rest));

    // Record audit
    const redemptions = this.getStorage<RedemptionRecord[]>(STORAGE_KEYS.REDEMPTIONS, []);
    redemptions.unshift({
      id: `redemption-${Date.now()}`,
      redemption_link_id: link.id,
      redemption_number: newUses,
      redeemed_at: nowIso,
      custom_name: link.custom_name,
      product_name: product?.name || 'Adobe Pro Plus',
    });
    this.setStorage(STORAGE_KEYS.REDEMPTIONS, redemptions);

    const targetUrl = link.target_url || settings.adobe_target_url || 'https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bid%5D=660F1BCF287345C0D465E4FF9D4A2AF6&cli=ace&co=IN&ref-order-id=D646F17C1FD5517747959836178529&utm_medium=Email&utm_campaign=GMI%20%3A%20CLCM%20Abandon_Cart_Reminder_WWEN&correlationId=f54aa9ff-26f3-4464-8c2b-559fb9568d94-0&utm_source=chatgpt.com&fbclid=PAT01DUAR_QldleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafvyE2y81w17BrCeJDgtzbfqzIhhxcpXQ9CqDbHe4mmKzrRqiPDPsv67OsfLw_aem_CyIp_6AI-ZvhgP8Ek2o2hQ&ss=checkout';

    return {
      success: true,
      status: 'SUCCESS',
      message: 'Redemption Successful',
      target_url: targetUrl,
      product_name: product?.name || 'Adobe Pro Plus',
      duration: product?.duration || '4 Month',
      redeemed_at: nowIso,
      redemption_number: newUses,
    };
  }


  getRedemptions(): RedemptionRecord[] {
    return this.getStorage<RedemptionRecord[]>(STORAGE_KEYS.REDEMPTIONS, []);
  }

  // Demo auth simulation for preview
  getDemoAuthUser(): { email: string; role: string } | null {
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
    return authData ? JSON.parse(authData) : null;
  }

  setDemoAuthUser(user: { email: string; role: string } | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }
}

export const mockStore = new MockStore();
