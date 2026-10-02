import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import type { Product } from '../types';

export const productService = {
  async getActiveProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return mockStore.getProducts().filter(p => p.active);
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, fallback to local cache:', error.message);
        return mockStore.getProducts().filter(p => p.active);
      }

      return (data as Product[]) || [];
    } catch (e) {
      console.error('Error fetching products:', e);
      return mockStore.getProducts().filter(p => p.active);
    }
  },

  async getAllProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return mockStore.getProducts();
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase products error, fallback:', error.message);
        return mockStore.getProducts();
      }

      return (data as Product[]) || [];
    } catch (e) {
      console.error('Error fetching all products:', e);
      return mockStore.getProducts();
    }
  },

  async updateProduct(product: Product): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      mockStore.saveProduct(product);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          duration: product.duration,
          features: product.features,
          active: product.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      return { success: false, error: message };
    }
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Product; error?: string }> {
    if (!isSupabaseConfigured()) {
      const newProduct: Product = {
        ...product,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockStore.saveProduct(newProduct);
      return { success: true, data: newProduct };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as Product };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      return { success: false, error: message };
    }
  }
};
