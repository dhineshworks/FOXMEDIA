import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { Products } from '../components/Products';
import { Features } from '../components/Features';
import { FAQ } from '../components/FAQ';
import { productService } from '../services/productService';
import type { Product, Settings } from '../types';

interface HomePageProps {
  settings: Settings;
}

export const HomePage: React.FC<HomePageProps> = ({ settings }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prodData = await productService.getActiveProducts();
        setProducts(prodData);
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero settings={settings} />
      {loading ? (
        <div className="py-20 text-center text-zinc-500 text-sm">
          Loading subscription options...
        </div>
      ) : (
        <Products products={products} settings={settings} />
      )}
      <Features />
      <FAQ />
    </div>
  );
};
