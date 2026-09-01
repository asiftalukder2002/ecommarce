import React, { useState } from 'react';
import { Category, Product, UserProfile } from '../types';

interface HomeScreenProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  currentUser?: UserProfile | null;
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigateToSearch: (initialQuery?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  categories,
  selectedCategory,
  currentUser,
  onSelectCategory,
  onSelectProduct,
  wishlist,
  onToggleWishlist,
  onNavigateToSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Category match
    const categoryMatch =
      selectedCategory === 'all' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    // Search query match
    const searchMatch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    // In stock filter
    const stockMatch = !onlyInStock || p.inStock;

    return categoryMatch && searchMatch && stockMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* Sticky Greeting & Search */}
      <div className="sticky top-16 z-30 bg-[#f9f9ff]/90 backdrop-blur-xl px-4 py-3 border-b border-transparent transition-all">
        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">
            {getGreeting()},{' '}
            <span className="text-[#006d2f] font-extrabold">
              {currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Shopper'}
            </span>
          </h1>

          <div className="flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#bbcbb9]/20 transition-all focus-within:shadow-[0_4px_20px_rgba(0,109,47,0.1)] focus-within:border-[#006d2f]/40">
            <span className="material-symbols-outlined text-[#3c4a3d]/70 text-[22px]">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for minimalist essentials..."
              className="bg-transparent outline-none text-[15px] text-[#141b2b] w-full placeholder:text-[#3c4a3d]/50 min-w-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm) {
                  onNavigateToSearch(searchTerm);
                }
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <button
              onClick={() => setShowFilterSheet(!showFilterSheet)}
              aria-label="Filter Options"
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
                onlyInStock || sortBy !== 'featured'
                  ? 'bg-[#006d2f] text-white ring-2 ring-[#006d2f]/30'
                  : 'bg-[#316bf3] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Quick Sheet */}
      {showFilterSheet && (
        <div className="px-4 py-3 bg-[#e9edff] border-y border-[#bbcbb9]/30 mb-2 animate-in fade-in duration-200">
          <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-[#141b2b] uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#bbcbb9]/40 rounded-lg px-2.5 py-1 text-xs font-medium text-[#141b2b] outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-[#141b2b]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-[#006d2f] focus:ring-[#006d2f]"
              />
              <span>In Stock Only</span>
            </label>

            {(onlyInStock || sortBy !== 'featured') && (
              <button
                onClick={() => {
                  setOnlyInStock(false);
                  setSortBy('featured');
                }}
                className="text-xs text-[#006d2f] font-semibold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category Carousel */}
      <div className="mt-3 mb-6 max-w-2xl mx-auto w-full">
        <div
          className="flex overflow-x-auto gap-2.5 px-4 pb-2 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#006d2f] text-white shadow-md shadow-[#006d2f]/25 font-semibold'
                    : 'bg-[#e9edff] text-[#141b2b] hover:bg-[#dce2f7]'
                }`}
              >
                <span>{cat.name}</span>
                {cat.count !== undefined && cat.slug !== 'all' && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#141b2b]/10 text-[#3c4a3d]'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="flex flex-col gap-4 px-4 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-baseline">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#141b2b] tracking-tight">
              {selectedCategory === 'all'
                ? 'Featured'
                : categories.find((c) => c.slug === selectedCategory)?.name || 'Products'}
            </h2>
            <span className="text-xs text-[#3c4a3d] font-medium bg-[#e9edff] px-2 py-0.5 rounded-full">
              {sortedProducts.length} items
            </span>
          </div>

          <button
            onClick={() => onNavigateToSearch()}
            className="text-xs font-bold text-[#006d2f] uppercase tracking-wider hover:underline flex items-center gap-0.5"
          >
            <span>See all</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#bbcbb9]/60 my-6">
            <span className="material-symbols-outlined text-4xl text-[#3c4a3d]/40 mb-2">
              inventory_2
            </span>
            <p className="text-[#141b2b] font-semibold">No products found</p>
            <p className="text-xs text-[#3c4a3d] mt-1">
              Try adjusting your search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                onSelectCategory('all');
                setOnlyInStock(false);
              }}
              className="mt-4 px-4 py-2 bg-[#006d2f] text-white text-xs font-semibold rounded-full"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl flex flex-col overflow-hidden transform transition-all duration-200 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 group border border-[#bbcbb9]/15"
                >
                  {/* Product Image Area */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="aspect-[4/5] bg-[#dce2f7]/50 relative overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      aria-label="Toggle favorite"
                      className="absolute top-2.5 right-2.5 bg-white/85 backdrop-blur-md text-[#141b2b] w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] transition-colors ${
                          isWishlisted ? 'text-[#ba1a1a]' : 'text-[#141b2b]'
                        }`}
                        style={{
                          fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Badge (NEW / SALE) */}
                    {product.badge && (
                      <div
                        className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-xs ${
                          product.badge === 'NEW'
                            ? 'bg-[#25d366] text-[#005523]'
                            : 'bg-[#316bf3] text-white'
                        }`}
                      >
                        {product.badge}
                      </div>
                    )}

                    {/* Stock Counter Badge */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      {product.inStock && product.stockCount !== undefined && product.stockCount > 5 ? (
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-white/95 text-[#006d2f] border border-[#006d2f]/30 shadow-xs backdrop-blur-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006d2f]" />
                          <span>Stock: {product.stockCount}</span>
                        </div>
                      ) : product.inStock && product.stockCount !== undefined && product.stockCount > 0 ? (
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#fff4e5]/95 text-[#e65100] border border-[#f57c00]/40 shadow-xs backdrop-blur-md flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e65100]" />
                          <span>Only {product.stockCount} left!</span>
                        </div>
                      ) : product.inStock ? (
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-white/95 text-[#006d2f] border border-[#006d2f]/30 shadow-xs backdrop-blur-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006d2f]" />
                          <span>In Stock</span>
                        </div>
                      ) : null}
                    </div>

                    {(!product.inStock || (product.stockCount !== undefined && product.stockCount === 0)) && (
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-[#ba1a1a] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                          Out of Stock (0)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Metadata */}
                  <div className="p-3.5 flex flex-col gap-1 flex-1">
                    <div className="flex items-center justify-between text-[10.5px] text-[#3c4a3d]/80">
                      <span className="font-semibold tracking-wider uppercase truncate">
                        {product.category}
                      </span>
                      {product.sellerName && (
                        <span className="font-medium text-[#006d2f] truncate max-w-[100px] flex items-center gap-0.5" title={`Sold by ${product.sellerName}`}>
                          <span className="material-symbols-outlined text-[11px]">storefront</span>
                          {product.sellerName}
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-semibold text-[#141b2b] line-clamp-2 leading-snug cursor-pointer group-hover:text-[#006d2f] transition-colors"
                    >
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-2 flex flex-col gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg text-[#006d2f] font-bold">
                          {product.currency} {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-[#3c4a3d]/60 line-through">
                            {product.currency} {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-full bg-[#e9edff] text-[#141b2b] py-2 rounded-xl text-xs font-semibold active:bg-[#dce2f7] hover:bg-[#006d2f] hover:text-white transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span>View Details</span>
                        {product.stockCount !== undefined && product.stockCount > 0 && (
                          <span className="text-[10px] opacity-80">({product.stockCount} left)</span>
                        )}
                      </button>
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
