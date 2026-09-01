import React, { useState, useMemo } from 'react';
import { Category, Product } from '../types';

interface SearchScreenProps {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
  onSelectProduct: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  products,
  categories,
  initialQuery = '',
  onSelectProduct,
  wishlist,
  onToggleWishlist,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchQuery =
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());

      const matchCat =
        selectedCategory === 'all' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchStock = !inStockOnly || p.inStock;

      return matchQuery && matchCat && matchStock;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return result;
  }, [products, query, selectedCategory, inStockOnly, sortBy]);

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-2xl mx-auto px-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c4a3d]/70 text-[22px]">
          search
        </span>
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands, or styles..."
          className="w-full h-13 pl-11 pr-10 bg-white rounded-2xl text-sm font-medium text-[#141b2b] placeholder-[#3c4a3d]/50 shadow-sm border border-[#bbcbb9]/30 focus:outline-none focus:ring-2 focus:ring-[#006d2f]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div
        className="flex overflow-x-auto gap-2 pb-1 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#006d2f] text-white shadow-sm'
                  : 'bg-[#e9edff] text-[#141b2b] hover:bg-[#dce2f7]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Controls: Stock toggle and Sort dropdown */}
      <div className="flex items-center justify-between gap-3 text-xs bg-white p-3 rounded-xl border border-[#bbcbb9]/20 shadow-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-[#141b2b]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-[#006d2f] focus:ring-[#006d2f]"
          />
          <span>In Stock Only</span>
        </label>

        <div className="flex items-center gap-1.5">
          <span className="text-[#3c4a3d] font-semibold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#e9edff] border-none rounded-lg px-2.5 py-1 text-xs font-semibold text-[#141b2b] outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider">
            Results ({filtered.length})
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#bbcbb9]/50">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              search_off
            </span>
            <p className="text-[#141b2b] font-semibold text-sm">No matching items</p>
            <p className="text-xs text-[#3c4a3d] mt-1">Try another search keyword or clear filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((p) => {
              const isWishlisted = wishlist.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-[#bbcbb9]/20 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xs"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isWishlisted ? 'text-[#ba1a1a]' : 'text-[#3c4a3d]'
                        }`}
                        style={{
                          fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>

                    {p.badge && (
                      <span
                        className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.badge === 'NEW'
                            ? 'bg-[#25d366] text-white'
                            : 'bg-[#316bf3] text-white'
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}

                    {/* Stock status indicator */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      {p.inStock && p.stockCount !== undefined && p.stockCount > 5 ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-[#006d2f] border border-[#006d2f]/30 shadow-xs backdrop-blur-md">
                          Stock: {p.stockCount}
                        </span>
                      ) : p.inStock && p.stockCount !== undefined && p.stockCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#fff4e5]/90 text-[#e65100] border border-[#f57c00]/40 shadow-xs backdrop-blur-md animate-pulse">
                          {p.stockCount} left
                        </span>
                      ) : null}
                    </div>

                    {(!p.inStock || (p.stockCount !== undefined && p.stockCount === 0)) && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="uppercase font-bold text-[#3c4a3d]/70">
                        {p.category}
                      </span>
                      {p.sellerName && (
                        <span className="text-[#006d2f] font-semibold truncate max-w-[80px]">
                          {p.sellerName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-[#141b2b] line-clamp-2 mt-0.5 group-hover:text-[#006d2f]">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-sm font-bold text-[#006d2f]">
                        {p.currency} {p.price.toLocaleString()}
                      </span>
                      {p.stockCount !== undefined && p.stockCount > 0 && (
                        <span className="text-[10px] font-medium text-[#3c4a3d]/70">
                          {p.stockCount} in stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
