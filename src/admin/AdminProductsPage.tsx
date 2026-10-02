import React, { useEffect, useState } from 'react';
import { 
  Check, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  X
} from 'lucide-react';

import { productService } from '../services/productService';
import type { Product } from '../types';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product, features: [...product.features] });
    setNewFeatureText('');
    setSaveMessage(null);
  };

  const handleAddNewProduct = () => {
    setEditingProduct({
      id: '',
      slug: '',
      name: '',
      description: '',
      price: 0,
      duration: '1 Year',
      features: [],
      active: true,
      created_at: '',
      updated_at: ''
    });
    setNewFeatureText('');
    setSaveMessage(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaveLoading(true);
    try {
      if (editingProduct.id === '') {
        const { id, created_at, updated_at, ...newProductData } = editingProduct;
        const res = await productService.createProduct(newProductData);
        if (res.success && res.data) {
          setProducts(prev => [...prev, res.data!]);
          setSaveMessage('Product created successfully!');
          setTimeout(() => {
            setEditingProduct(null);
            setSaveMessage(null);
          }, 1200);
        }
      } else {
        const res = await productService.updateProduct(editingProduct);
        if (res.success) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
          setSaveMessage('Product updated successfully!');
          setTimeout(() => {
            setEditingProduct(null);
            setSaveMessage(null);
          }, 1200);
        }
      }
    } catch (e) {
      console.error('Error saving product', e);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim() || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      features: [...editingProduct.features, newFeatureText.trim()]
    });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      features: editingProduct.features.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products & Pricing</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Configure subscription plans, prices, durations, and feature list highlights.
          </p>
        </div>
        <button
          onClick={handleAddNewProduct}
          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-3" />
          <p className="text-zinc-400 text-xs">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-orange-400 px-2.5 py-1 rounded-lg bg-orange-400/10 border border-orange-400/20">
                    {product.duration}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      product.active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {product.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">{product.name}</h2>
                <div className="text-2xl font-extrabold text-white my-2">
                  ₹{product.price.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-zinc-400">/ {product.duration}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-6">{product.description}</p>

                <div className="space-y-2 mb-6">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-300 block">
                    Features ({product.features.length})
                  </span>
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleEditClick(product)}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Plan Details</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <h2 className="font-bold text-white text-base">
                {editingProduct.id === '' ? 'Add New Product' : `Edit ${editingProduct.name}`}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveMessage && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Duration Label</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.duration}
                    onChange={(e) => setEditingProduct({ ...editingProduct, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Catalog Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="activeCheck"
                      checked={editingProduct.active}
                      onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                      className="rounded accent-orange-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="activeCheck" className="text-zinc-300 cursor-pointer">
                      Active (visible on website)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Features List editor */}
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Features Included</label>
                <div className="space-y-1.5 max-h-44 overflow-y-auto mb-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  {editingProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-zinc-900 text-zinc-200">
                      <span className="truncate">{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Add a new feature..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
