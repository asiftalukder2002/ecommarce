import React from 'react';
import { Category, Product } from '../types';

interface CategoriesScreenProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (categorySlug: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  categories,
  products,
  onSelectCategory,
  onSelectProduct,
}) => {
  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-2xl mx-auto px-4 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">
          Categories
        </h1>
        <p className="text-sm text-[#3c4a3d] mt-1">
          Explore our curated minimalist collections
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {categories
          .filter((c) => c.slug !== 'all')
          .map((cat) => {
            const count = products.filter(
              (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="bg-white p-5 rounded-2xl border border-[#bbcbb9]/30 shadow-sm hover:shadow-md hover:border-[#006d2f]/40 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#e1e8fd] group-hover:bg-[#006d2f]/10 text-[#0051d5] group-hover:text-[#006d2f] flex items-center justify-center transition-colors">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {cat.icon || 'category'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#141b2b] group-hover:text-[#006d2f] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-[#3c4a3d]/70 font-medium">
                    {count} products
                  </span>
                </div>
              </button>
            );
          })}
      </div>

      {/* Featured Collection Highlight */}
      <div className="pt-2">
        <h2 className="text-lg font-bold text-[#141b2b] mb-3">Popular in Store</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="bg-white p-3 rounded-2xl border border-[#bbcbb9]/20 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-all group"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#006d2f] uppercase">
                  {p.category}
                </span>
                <h4 className="text-xs font-bold text-[#141b2b] truncate group-hover:text-[#006d2f] transition-colors">
                  {p.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-bold text-[#141b2b]">
                    {p.currency} {p.price.toLocaleString()}
                  </p>
                  {p.inStock && (p.stockCount ?? 1) > 0 ? (
                    <span className="text-[10px] font-bold text-[#006d2f] bg-[#e9f7ef] px-1.5 py-0.2 rounded-full">
                      {p.stockCount ?? 1} in stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.2 rounded-full">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>
              <span className="material-symbols-outlined text-[#3c4a3d]/40 group-hover:text-[#006d2f] text-[20px] shrink-0">
                chevron_right
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
