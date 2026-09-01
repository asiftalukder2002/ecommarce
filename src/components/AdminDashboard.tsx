import React, { useState } from 'react';
import { Category, Product } from '../types';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCategory: (name: string, icon: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateStock?: (productId: string, newStock: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onUpdateStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('category');
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Filter products by search term
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 5);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), newCatIcon);
    setNewCatName('');
    setShowAddCategoryModal(false);
  };

  const totalProductCount = products.length;
  const activeCategoryCount = categories.length;

  const totalUnitsInStock = products.reduce(
    (acc, p) => acc + (p.inStock ? p.stockCount ?? 1 : 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => !p.inStock || (p.stockCount !== undefined && p.stockCount <= 5)
  ).length;

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 max-w-2xl mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">
            Admin Inventory
          </h1>
          <p className="text-sm text-[#3c4a3d] mt-0.5">Manage products, stock quantity & categories</p>
        </div>
        <button
          onClick={onAddProduct}
          className="h-10 px-4 bg-[#006d2f] text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#005523] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Products Metric Card */}
        <div className="bg-[#e1e8fd] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden border border-[#bbcbb9]/20">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#006d2f] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              inventory_2
            </span>
            <span className="text-[11px] font-bold text-[#3c4a3d] uppercase tracking-wider">
              Products
            </span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#141b2b] block">
              {totalProductCount}
            </span>
            <span className="text-[11px] font-semibold text-[#006d2f] flex items-center">
              Catalog items
            </span>
          </div>
        </div>

        {/* Total Units in Stock */}
        <div className="bg-[#e9f7ef] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden border border-[#006d2f]/20">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#006d2f] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warehouse
            </span>
            <span className="text-[11px] font-bold text-[#3c4a3d] uppercase tracking-wider">
              Total Stock
            </span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#006d2f] block">
              {totalUnitsInStock}
            </span>
            <span className="text-[11px] font-semibold text-[#3c4a3d]/80 flex items-center">
              Total units
            </span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[#fff4e5] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden border border-[#f57c00]/20">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#e65100] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <span className="text-[11px] font-bold text-[#e65100] uppercase tracking-wider">
              Low Stock
            </span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#e65100] block">
              {lowStockCount}
            </span>
            <span className="text-[11px] font-semibold text-[#b26a00] flex items-center">
              Items &le; 5 units
            </span>
          </div>
        </div>

        {/* Categories Metric Card */}
        <div className="bg-[#e1e8fd] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden border border-[#bbcbb9]/20">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#0051d5] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              category
            </span>
            <span className="text-[11px] font-bold text-[#3c4a3d] uppercase tracking-wider">
              Categories
            </span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#141b2b] block">
              {activeCategoryCount}
            </span>
            <span className="text-[11px] font-semibold text-[#0051d5] flex items-center">
              Active groups
            </span>
          </div>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#141b2b]">Products Inventory & Stock Control</h2>
            <p className="text-xs text-[#3c4a3d]">Quickly increase or decrease stock for any product</p>
          </div>
          <button
            onClick={() => setShowAllProducts(!showAllProducts)}
            className="text-xs font-semibold text-[#006d2f] bg-[#006d2f]/10 hover:bg-[#006d2f]/20 px-3 py-1.5 rounded-full transition-colors shrink-0"
          >
            {showAllProducts ? 'Show Less' : `View All (${products.length})`}
          </button>
        </div>

        {/* Search Bar in Dashboard */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c4a3d]/60 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title or category..."
            className="w-full h-11 pl-11 pr-4 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] focus:outline-none focus:ring-2 focus:ring-[#006d2f] shadow-inner placeholder-[#3c4a3d]/50"
          />
        </div>

        {/* Product Items List with Direct Stock Adjuster */}
        <div className="space-y-3">
          {displayProducts.map((product) => {
            const currentStock = product.stockCount ?? (product.inStock ? 10 : 0);
            const isOutOfStock = !product.inStock || currentStock === 0;
            const isLowStock = !isOutOfStock && currentStock <= 5;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#bbcbb9]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:shadow-md"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#141b2b] truncate">
                        {product.name}
                      </h3>
                      {product.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#e9edff] text-[#0051d5]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[#006d2f]">
                        {product.currency} {product.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-[#3c4a3d]/70 capitalize">
                        • {product.category}
                      </span>
                    </div>

                    {/* Stock Status Pill */}
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isOutOfStock
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : isLowStock
                            ? 'bg-[#fff4e5] text-[#e65100]'
                            : 'bg-[#e9f7ef] text-[#006d2f]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOutOfStock
                              ? 'bg-[#ba1a1a]'
                              : isLowStock
                              ? 'bg-[#e65100]'
                              : 'bg-[#006d2f]'
                          }`}
                        />
                        {isOutOfStock
                          ? 'Out of Stock (0)'
                          : isLowStock
                          ? `Low Stock (${currentStock} left)`
                          : `In Stock (${currentStock} units)`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Controls & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quick Stock Adjuster (+ / -) */}
                  <div className="flex items-center gap-1 bg-[#f0f4ff] p-1 rounded-xl border border-[#bbcbb9]/30">
                    <button
                      type="button"
                      onClick={() => onUpdateStock && onUpdateStock(product.id, Math.max(0, currentStock - 1))}
                      disabled={currentStock <= 0}
                      title="Decrease Stock by 1"
                      className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] hover:bg-[#ffdad6] hover:text-[#ba1a1a] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#141b2b] active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>

                    <div className="px-2 min-w-[52px] text-center">
                      <span className="text-xs font-bold text-[#141b2b] block leading-tight">
                        {currentStock}
                      </span>
                      <span className="text-[9px] text-[#3c4a3d]/70 font-medium">units</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpdateStock && onUpdateStock(product.id, currentStock + 1)}
                      title="Increase Stock by 1"
                      className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] hover:bg-[#e9f7ef] hover:text-[#006d2f] active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>

                    {/* Quick +5 button */}
                    <button
                      type="button"
                      onClick={() => onUpdateStock && onUpdateStock(product.id, currentStock + 5)}
                      title="Add 5 units"
                      className="px-1.5 h-7 rounded-lg bg-[#006d2f]/10 text-[#006d2f] text-[10px] font-bold hover:bg-[#006d2f]/20 active:scale-95 transition-all"
                    >
                      +5
                    </button>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProduct(product)}
                      title="Edit Product Details"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#3c4a3d] hover:bg-[#e9edff] hover:text-[#006d2f] active:scale-95 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      title="Delete Product"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6] active:scale-95 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Management Section */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#141b2b]">Categories</h2>
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="w-9 h-9 rounded-full bg-[#0051d5] text-white flex items-center justify-center shadow-md hover:bg-[#003ea8] active:scale-95 transition-all"
            title="Add Category"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>

        <div
          className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {categories
            .filter((c) => c.slug !== 'all')
            .map((cat) => (
              <div
                key={cat.id}
                className="snap-start shrink-0 w-32 bg-[#dce2f7] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm relative group border border-[#bbcbb9]/30"
              >
                <span
                  className="material-symbols-outlined text-[#3c4a3d] text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {cat.icon || 'folder'}
                </span>
                <span className="text-xs font-bold text-[#141b2b] text-center truncate w-full">
                  {cat.name}
                </span>

                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  title="Delete category"
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[#3c4a3d] hover:text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Floating Action Button to Add Product */}
      <button
        onClick={onAddProduct}
        className="fixed bottom-20 right-4 sm:right-8 w-14 h-14 bg-[#006d2f] text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 flex items-center justify-center border-2 border-white"
        aria-label="Add new product"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#141b2b]">Add New Category</h3>
            <form onSubmit={handleCreateCategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] uppercase mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Footwear, Kitchen, Books"
                  className="w-full h-11 px-3 bg-[#e9edff] rounded-xl text-sm text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] uppercase mb-1">
                  Icon
                </label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full h-11 px-3 bg-[#e9edff] rounded-xl text-sm text-[#141b2b] outline-none"
                >
                  <option value="category">Category (Default)</option>
                  <option value="devices">Electronics / Devices</option>
                  <option value="chair">Furniture / Home</option>
                  <option value="checkroom">Fashion / Apparel</option>
                  <option value="watch">Accessories / Watches</option>
                  <option value="self_improvement">Lifestyle / Wellness</option>
                  <option value="local_mall">Shopping / Mall</option>
                  <option value="palette">Art / Design</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="flex-1 py-2.5 bg-[#e9edff] text-[#141b2b] rounded-xl text-xs font-semibold hover:bg-[#dce2f7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006d2f] text-white rounded-xl text-xs font-semibold hover:bg-[#005523]"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
