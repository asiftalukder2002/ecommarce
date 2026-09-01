import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailsScreenProps {
  product: Product;
  onBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOrderWhatsApp: (orderData: {
    product: Product;
    quantity: number;
    color: string;
    storage: string;
    totalPrice: number;
  }) => void;
  onOpenChat?: (product: Product) => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onOrderWhatsApp,
  onOpenChat,
}) => {
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selected options
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default'
  );

  const [selectedStorageIndex, setSelectedStorageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  // Calculate current unit price based on storage option
  const storageDelta =
    product.storageOptions && product.storageOptions[selectedStorageIndex]
      ? product.storageOptions[selectedStorageIndex].priceDelta
      : 0;

  const currentUnitPrice = product.price + storageDelta;
  const currentTotal = currentUnitPrice * quantity;

  const selectedStorageLabel =
    product.storageOptions && product.storageOptions[selectedStorageIndex]
      ? product.storageOptions[selectedStorageIndex].label
      : 'Standard';

  const handleOrder = () => {
    onOrderWhatsApp({
      product,
      quantity,
      color: selectedColor,
      storage: selectedStorageLabel,
      totalPrice: currentTotal,
    });
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* Product Hero Gallery */}
      <section className="relative w-full h-[360px] sm:h-[440px] bg-white overflow-hidden">
        <div className="w-full h-full relative group">
          <img
            src={images[activeImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Optional multi-image indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    activeImageIndex === idx
                      ? 'w-6 bg-[#006d2f]'
                      : 'w-2 bg-slate-300/80 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Product Details Sheet */}
      <div className="px-4 pt-6 pb-8 bg-[#f9f9ff] flex flex-col gap-6 rounded-t-3xl -mt-6 relative z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] max-w-2xl mx-auto w-full">
        {/* Stock status & Wishlist */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold gap-1.5 ${
                product.inStock
                  ? 'bg-[#25d366]/15 text-[#005523]'
                  : 'bg-[#ba1a1a]/15 text-[#ba1a1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {product.inStock ? 'check_circle' : 'cancel'}
              </span>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>

            <button
              onClick={() => onToggleWishlist(product.id)}
              aria-label="Toggle Wishlist"
              className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#bbcbb9]/20 flex items-center justify-center text-[#141b2b] hover:bg-[#ffdad6]/40 transition-colors"
            >
              <span
                className={`material-symbols-outlined text-[20px] transition-colors ${
                  isWishlisted ? 'text-[#ba1a1a]' : 'text-[#3c4a3d]'
                }`}
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#141b2b] tracking-tight">
            {product.name}
          </h1>

          {product.tagline && (
            <p className="text-xs sm:text-sm text-[#3c4a3d] font-medium -mt-1">
              {product.tagline}
            </p>
          )}

          {/* Pricing & Stock Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#006d2f]">
                {product.currency} {currentUnitPrice.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm sm:text-base text-[#3c4a3d]/60 line-through">
                  {product.currency} {(product.originalPrice + storageDelta).toLocaleString()}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                  Save{' '}
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}
                  %
                </span>
              )}
            </div>

            {/* Stock Status Badge */}
            <div>
              {!product.inStock || (product.stockCount !== undefined && product.stockCount === 0) ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ffdad6] text-[#ba1a1a]">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  Out of Stock (0 units)
                </span>
              ) : product.stockCount !== undefined && product.stockCount <= 5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fff4e5] text-[#e65100] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#e65100]" />
                  Only {product.stockCount} left in stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e9f7ef] text-[#006d2f]">
                  <span className="w-2 h-2 rounded-full bg-[#006d2f]" />
                  In Stock ({product.stockCount !== undefined ? `${product.stockCount} units available` : 'Available'})
                </span>
              )}
            </div>
          </div>

          {/* Exact Stock Counter & Availability Box */}
          <div className="mt-2 bg-[#f0f4ff] rounded-2xl p-3.5 border border-[#bbcbb9]/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006d2f] text-[20px]">
                  inventory
                </span>
                <span className="text-xs font-bold text-[#141b2b]">
                  Available Warehouse Stock (মজুদ স্টক)
                </span>
              </div>
              <span className="text-xs font-black text-[#006d2f]">
                {product.inStock && (product.stockCount ?? 1) > 0
                  ? `${product.stockCount ?? 1} Units Available`
                  : '0 Units (Sold Out)'}
              </span>
            </div>

            {/* Visual Stock Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  !product.inStock || (product.stockCount ?? 0) === 0
                    ? 'w-0 bg-rose-500'
                    : (product.stockCount ?? 10) <= 5
                    ? 'w-1/4 bg-amber-500'
                    : (product.stockCount ?? 10) <= 15
                    ? 'w-3/5 bg-emerald-500'
                    : 'w-full bg-[#006d2f]'
                }`}
              />
            </div>
            <p className="text-[11px] text-[#3c4a3d]/80">
              {!product.inStock || (product.stockCount ?? 0) === 0
                ? '⚠️ This product is out of stock. Contact seller on WhatsApp for restocking time.'
                : (product.stockCount ?? 10) <= 5
                ? '⚡ Fast selling item! Only few units left in warehouse for instant dispatch.'
                : '✅ Ready for express dispatch with official warranty and direct WhatsApp support.'}
            </p>
          </div>

          {/* Seller / Store Information Card */}
          {product.sellerName && (
            <div className="mt-1 bg-white rounded-2xl p-3.5 border border-[#bbcbb9]/30 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#006d2f]/10 text-[#006d2f] flex items-center justify-center font-bold text-sm shrink-0">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#141b2b] truncate">
                      {product.sellerName}
                    </span>
                    <span
                      className="material-symbols-outlined text-[15px] text-[#006d2f]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3c4a3d]/80">
                    Verified Seller • {product.rating || '4.9'} ★ Rating
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {onOpenChat && (
                  <button
                    onClick={() => onOpenChat(product)}
                    className="px-2.5 py-1.5 bg-[#f0f4ff] hover:bg-[#e1eaff] text-[#316bf3] rounded-xl text-xs font-bold flex items-center gap-1 transition-colors border border-[#316bf3]/20"
                    title="Live Chat with Seller in Real-Time"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Live Chat</span>
                  </button>
                )}

                {product.sellerWhatsApp && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=${product.sellerWhatsApp}&text=Hello%20${encodeURIComponent(
                      product.sellerName
                    )}!%20I%20have%20an%20inquiry%20about%20${encodeURIComponent(product.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#006d2f] rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#25D366]">call</span>
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-[1px] bg-[#bbcbb9]/30"></div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider">
                Select Color
              </h3>
              <span className="text-xs font-semibold text-[#141b2b]">{selectedColor}</span>
            </div>

            <div className="flex items-center gap-3.5">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color.name;
                const isLight =
                  color.hex.toLowerCase() === '#ffffff' ||
                  color.hex.toLowerCase() === '#e5e7eb' ||
                  color.hex.toLowerCase() === '#f3f4f6' ||
                  color.hex.toLowerCase() === '#f0ece1';

                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={color.name}
                    style={{ backgroundColor: color.hex }}
                    className={`w-11 h-11 rounded-full relative shadow-sm border border-slate-300 transition-all duration-200 ${
                      isSelected
                        ? 'ring-3 ring-offset-2 ring-[#006d2f] scale-105'
                        : 'hover:scale-105 opacity-90'
                    }`}
                  >
                    {isSelected && (
                      <span
                        className={`absolute inset-0 flex items-center justify-center ${
                          isLight ? 'text-black' : 'text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px] font-bold">
                          check
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Storage / Variant Selection */}
        {product.storageOptions && product.storageOptions.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider">
              Option / Capacity
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {product.storageOptions.map((opt, idx) => {
                const isSelected = selectedStorageIndex === idx;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedStorageIndex(idx)}
                    className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'bg-[#006d2f]/10 border-[#006d2f] text-[#006d2f] shadow-sm'
                        : 'bg-white border-slate-200 text-[#3c4a3d] hover:bg-[#e9edff]'
                    }`}
                  >
                    <span className="text-base font-bold text-[#141b2b]">{opt.label}</span>
                    <span
                      className={`text-xs mt-0.5 ${
                        isSelected ? 'text-[#006d2f] font-semibold' : 'text-[#3c4a3d]/70'
                      }`}
                    >
                      {opt.subtext || `+ ${product.currency} ${opt.priceDelta}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <div className="w-full h-[1px] bg-[#bbcbb9]/30"></div>

        {/* Product Details & Specs */}
        <section className="flex flex-col gap-3.5">
          <h2 className="text-lg font-bold text-[#141b2b]">Product Details</h2>
          <p className="text-sm leading-relaxed text-[#3c4a3d]">{product.description}</p>

          {product.features && product.features.length > 0 && (
            <ul className="space-y-2.5 pt-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#141b2b]">
                  <span className="material-symbols-outlined text-[#006d2f] text-[20px] shrink-0 mt-0.5 font-bold">
                    done
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Fixed Bottom Action Bar for Quantity & WhatsApp Order */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#f9f9ff]/95 backdrop-blur-xl border-t border-[#bbcbb9]/25 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* Quantity Controls */}
          {product.inStock && (product.stockCount === undefined || product.stockCount > 0) ? (
            <>
              <div className="flex items-center bg-[#e9edff] rounded-2xl h-14 px-2 shadow-inner">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center text-[#141b2b] hover:text-[#006d2f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>

                <span className="font-bold text-base text-[#141b2b] w-8 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => {
                    const maxStock = product.stockCount !== undefined ? product.stockCount : 999;
                    if (quantity < maxStock) {
                      setQuantity(quantity + 1);
                    }
                  }}
                  disabled={product.stockCount !== undefined && quantity >= product.stockCount}
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-[#141b2b] hover:text-[#006d2f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleOrder}
                className="flex-1 h-14 bg-[#25D366] text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#20ba59] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 font-semibold text-base"
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  chat
                </span>
                <span>Order via WhatsApp</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">
                  {product.currency} {currentTotal.toLocaleString()}
                </span>
              </button>
            </>
          ) : (
            <div className="w-full h-14 bg-slate-200 text-slate-500 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm select-none">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span>This product is currently Out of Stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
