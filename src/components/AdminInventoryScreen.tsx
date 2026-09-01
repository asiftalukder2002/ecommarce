import React, { useState, useRef } from 'react';
import { Category, Product } from '../types';

interface AdminInventoryScreenProps {
  categories: Category[];
  initialProduct?: Product | null;
  onSave: (productData: Partial<Product>) => void;
  onCancel: () => void;
}

export const AdminInventoryScreen: React.FC<AdminInventoryScreenProps> = ({
  categories,
  initialProduct,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialProduct?.name || '');
  const [price, setPrice] = useState<string>(
    initialProduct?.price ? initialProduct.price.toString() : ''
  );
  const [originalPrice, setOriginalPrice] = useState<string>(
    initialProduct?.originalPrice ? initialProduct.originalPrice.toString() : ''
  );
  const [category, setCategory] = useState(
    initialProduct?.category || (categories[1]?.slug || 'electronics')
  );
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [inStock, setInStock] = useState<boolean>(initialProduct ? initialProduct.inStock : true);
  const [stockCount, setStockCount] = useState<number>(
    initialProduct?.stockCount !== undefined ? initialProduct.stockCount : 10
  );
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.image ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDevfbivsu2K_7FvMNGCYjwXGHKy_hpE2BOjD3K3Z--tADaMwzioKZEasDu_bH0MjfwebUZIR3Y9H_PTpPPp5vUJy90k-FKvLymT7d_FqJLBM7myHYY9pFTBbWqCD9qmrC0gy400QFg2epMTPVH58-bWaVCaBTx3gJFaGLP1cXUVCsQRdLz0x4REKoHcKq1gZumFjSRsqWzIcfeX7Jgw4Jz_WxtJTXTHuwVdeLMYeSiHyuDGa63YFjfTw'
  );
  const [badge, setBadge] = useState<'NEW' | 'SALE' | ''>(initialProduct?.badge || '');
  const [showUrlPrompt, setShowUrlPrompt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    onSave({
      id: initialProduct?.id,
      name: name.trim(),
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      description: description.trim(),
      inStock: inStock && stockCount > 0,
      stockCount: Math.max(0, stockCount),
      image: imageUrl,
      currency: '৳',
      badge: (badge as any) || undefined,
      featured: true,
    });
  };

  const presetImages = [
    {
      label: 'Phone Camera',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjLJIV6F4enMjnU71qhUhQOJl0LtlbMdtO2BwBi333smE-iFq_bEGF8qW6Ow8S7sz8DLqn8Tx2gA__HxnSSp2KnIsHB7CkoaMJqS0P8k9mCEnKdXF8F1A70Kb78cMxGcqx9-32bvPCXXvtYc8Qj598HIjUgWTH7uujxC0g2xZlsbWhs4wPOrjNP4KjUODvQjQS9rfGtu_EJjlI_9H_qatVtlkTj695mmcbjKJQltciLopdqLgJNV-iIA',
    },
    {
      label: 'Wireless Charger',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5Zm-ZrcCisBh5MpDT6DIMlV25nvyCbqUXFoBP8842dMTVy9ue7IuR738aH3vzrTRVef2yudaOGdNBo0sB9qedXiHngtzpICn8oZgC2NtHIA9byw3_a8JUdX7E4EJtZWnx0867O1CHXscu5MxqZW-u9JBgIZBxJJ5mkmoGxqFPm6kpW4ybhBrPvy57h0idXJHmNZS159-T_VsHVxSnu9tGCTR9CGJrz1-QpkR7YHykNloon844NuWKZA',
    },
    {
      label: 'Ceramic Vase',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDevfbivsu2K_7FvMNGCYjwXGHKy_hpE2BOjD3K3Z--tADaMwzioKZEasDu_bH0MjfwebUZIR3Y9H_PTpPPp5vUJy90k-FKvLymT7d_FqJLBM7myHYY9pFTBbWqCD9qmrC0gy400QFg2epMTPVH58-bWaVCaBTx3gJFaGLP1cXUVCsQRdLz0x4REKoHcKq1gZumFjSRsqWzIcfeX7Jgw4Jz_WxtJTXTHuwVdeLMYeSiHyuDGa63YFjfTw',
    },
    {
      label: 'Headphones',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbGJQD220GQ5aoHkh_X1uzcQK3MvdWEENX7jiV9_SS6diT_F0MFbEMkh0_G_ggXcFioyz4iWw3F8ureJe4Nk6nSWResXUFbQGjCQ1lvXX0auKMQidQlAV7wxHi9phEePckCkmouSCa18r0GPAKuxT51pxgc8QkcL5tjDZreumgQnEc4i2mf1IWZiDyu5GFdEBg6lGQlHtM-LFhhc6puTXlIPmI9Yp8ECbjWrOZ-2w5dMrTn6J43_QIDQ',
    },
    {
      label: 'Leather Wallet',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPjy4D8_3yHMgWrylMN6vM71i6l2qsZeWnkcuakJz5zHNoo8N-eDqTdrTZ8UCo9cDko6lvHwMpY_hDJnBjK7DtW3LXNUzGc1fj4mPCAcEb80Pqcyg67MZYhOagM57_55q8KVvA96Vgx877pGRAR6kRteJPLHZuju23rvklFTNgsAdbfjDxy5bLBH0K7seUbMuSDoVKFb_Ianay9GsHC_TIV_kjDovDNSN0GXDATPrRx4hKHBAlu5P_cQ',
    },
    {
      label: 'Coffee Mug',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0uA2v0waekML37hSbZXBo_hYGrRBkRnIhMxgrqo_IEZPCHOoh0HoVuDI5zoosArHRGG6IYM4kMnYgi-Wj052K_iClQCx9cYdD0mLV2HLlAe_qhAW8ex_UUx3eRZzvLIZtLfKytwF5pzpA3f_X4UV4BHYvJlFDft0a1yt5zI3zWdpJ4qa0x6_iuDKAauzkjJmtqN8RHDDQKlSFhODVcy4PHNao7ojkR3cRTxUW9DYhXKL9ayETxvzrfg',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full pb-32 pt-2 max-w-2xl mx-auto px-4 gap-5">
      {/* Image Upload Area matching Image 8.png */}
      <div className="flex flex-col gap-2">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#dce2f7] flex flex-col items-center justify-center cursor-pointer group shadow-sm border-2 border-dashed border-[#bbcbb9]/60 hover:border-[#006d2f] transition-all active:scale-[0.99]"
        >
          {imageUrl ? (
            <div className="w-full h-full relative group">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                <span className="material-symbols-outlined text-4xl mb-1">edit</span>
                <span className="text-xs font-semibold">Click to Change Image</span>
              </div>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined text-4xl text-[#3c4a3d]/70 mb-2 group-hover:text-[#006d2f] transition-colors">
                add_photo_alternate
              </span>
              <span className="text-sm font-semibold text-[#141b2b] group-hover:text-[#006d2f] transition-colors">
                Tap to add main image
              </span>
              <span className="text-xs text-[#3c4a3d]/70 mt-1">1080 × 1080px recommended</span>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Preset quick picks */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] font-bold text-[#3c4a3d] uppercase shrink-0">Presets:</span>
          {presetImages.map((p, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setImageUrl(p.url)}
              className="text-xs bg-white border border-[#bbcbb9]/40 hover:border-[#006d2f] px-2.5 py-1 rounded-lg shrink-0 text-[#141b2b] transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowUrlPrompt(!showUrlPrompt)}
            className="text-xs text-[#0051d5] font-semibold underline shrink-0 ml-1"
          >
            Enter URL
          </button>
        </div>

        {showUrlPrompt && (
          <div className="flex gap-2 animate-in fade-in">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white border border-[#bbcbb9] rounded-xl outline-none"
            />
          </div>
        )}
      </div>

      {/* Details Form Fields */}
      <div className="flex flex-col gap-4">
        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider ml-1">
            Product Name
          </label>
          <div className="bg-white rounded-xl shadow-sm border border-[#bbcbb9]/40 focus-within:border-[#006d2f] focus-within:ring-2 focus-within:ring-[#006d2f]/20 transition-all">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Minimalist Ceramic Vase"
              className="w-full h-12 bg-transparent px-4 text-sm font-medium text-[#141b2b] placeholder-[#3c4a3d]/40 outline-none"
            />
          </div>
        </div>

        {/* Pricing Rows */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider ml-1">
              Price (BDT)
            </label>
            <div className="bg-white rounded-xl shadow-sm border border-[#bbcbb9]/40 focus-within:border-[#006d2f] focus-within:ring-2 focus-within:ring-[#006d2f]/20 transition-all flex items-center">
              <span className="pl-4 text-sm font-bold text-[#006d2f]">৳</span>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 bg-transparent px-2 text-sm font-semibold text-[#141b2b] placeholder-[#3c4a3d]/40 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider ml-1">
              Original Price (Optional)
            </label>
            <div className="bg-white rounded-xl shadow-sm border border-[#bbcbb9]/40 focus-within:border-[#006d2f] focus-within:ring-2 focus-within:ring-[#006d2f]/20 transition-all flex items-center">
              <span className="pl-4 text-sm font-medium text-[#3c4a3d]/60">৳</span>
              <input
                type="number"
                min="0"
                step="any"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 bg-transparent px-2 text-sm font-medium text-[#141b2b] placeholder-[#3c4a3d]/40 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Dropdown & Badge */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider ml-1">
              Category
            </label>
            <div className="relative bg-white rounded-xl shadow-sm border border-[#bbcbb9]/40 focus-within:border-[#006d2f] transition-all">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 bg-transparent px-4 text-sm font-medium text-[#141b2b] outline-none appearance-none cursor-pointer capitalize"
              >
                {categories
                  .filter((c) => c.slug !== 'all')
                  .map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3c4a3d] pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider ml-1">
              Promo Badge
            </label>
            <div className="relative bg-white rounded-xl shadow-sm border border-[#bbcbb9]/40 focus-within:border-[#006d2f] transition-all">
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as any)}
                className="w-full h-12 bg-transparent px-4 text-sm font-medium text-[#141b2b] outline-none appearance-none cursor-pointer"
              >
                <option value="">None</option>
                <option value="NEW">NEW</option>
                <option value="SALE">SALE</option>
                <option value="HOT">HOT</option>
              </select>
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3c4a3d] pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#3c4a3d] uppercase tracking-wider ml-1">
            Description
          </label>
          <div className="bg-white rounded-xl shadow-sm border border-[#bbcbb9]/40 focus-within:border-[#006d2f] focus-within:ring-2 focus-within:ring-[#006d2f]/20 transition-all p-1">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the product, materials, specifications, and aesthetics..."
              className="w-full bg-transparent px-3 py-2 text-sm font-medium text-[#141b2b] placeholder-[#3c4a3d]/40 outline-none resize-none"
            />
          </div>
        </div>

        <hr className="border-t border-[#bbcbb9]/30 my-1" />

        {/* Stock Quantity & Status Management */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#bbcbb9]/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-[#141b2b]">Stock Quantity (Units)</span>
              <p className="text-xs text-[#3c4a3d]">Set available units in inventory</p>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                !inStock || stockCount === 0
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : stockCount <= 5
                  ? 'bg-[#fff4e5] text-[#e65100]'
                  : 'bg-[#e9f7ef] text-[#006d2f]'
              }`}
            >
              {!inStock || stockCount === 0
                ? 'Out of Stock'
                : stockCount <= 5
                ? `Low Stock (${stockCount})`
                : `In Stock (${stockCount})`}
            </span>
          </div>

          {/* Stepper + Direct Input */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#e9edff] rounded-xl p-1 border border-[#bbcbb9]/40">
              <button
                type="button"
                onClick={() => {
                  const next = Math.max(0, stockCount - 1);
                  setStockCount(next);
                  if (next === 0) setInStock(false);
                }}
                disabled={stockCount <= 0}
                className="w-10 h-10 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] hover:bg-[#ffdad6] hover:text-[#ba1a1a] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#141b2b] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>

              <input
                type="number"
                min="0"
                value={stockCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setStockCount(Math.max(0, val));
                  if (val > 0) setInStock(true);
                  else setInStock(false);
                }}
                className="w-16 h-10 bg-transparent text-center font-bold text-base text-[#141b2b] outline-none"
              />

              <button
                type="button"
                onClick={() => {
                  const next = stockCount + 1;
                  setStockCount(next);
                  setInStock(true);
                }}
                className="w-10 h-10 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] hover:bg-[#e9f7ef] hover:text-[#006d2f] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>

            {/* Quick Increment Shortcuts */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setStockCount((prev) => prev + 5);
                  setInStock(true);
                }}
                className="h-10 px-3 bg-[#e9edff] hover:bg-[#006d2f]/15 hover:text-[#006d2f] text-[#141b2b] rounded-xl text-xs font-bold transition-colors active:scale-95"
              >
                +5 units
              </button>
              <button
                type="button"
                onClick={() => {
                  setStockCount((prev) => prev + 10);
                  setInStock(true);
                }}
                className="h-10 px-3 bg-[#e9edff] hover:bg-[#006d2f]/15 hover:text-[#006d2f] text-[#141b2b] rounded-xl text-xs font-bold transition-colors active:scale-95"
              >
                +10 units
              </button>
              <button
                type="button"
                onClick={() => {
                  setStockCount(0);
                  setInStock(false);
                }}
                className="h-10 px-3 bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-bold transition-colors active:scale-95"
              >
                Set 0 (Out)
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3c4a3d]">
              Force Stock Status Override
            </span>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setInStock(checked);
                  if (checked && stockCount === 0) {
                    setStockCount(10);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-[#dce2f7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006d2f]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#f9f9ff]/95 backdrop-blur-xl border-t border-[#bbcbb9]/25 z-40">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-24 h-14 bg-white border border-[#bbcbb9]/40 text-[#141b2b] rounded-2xl text-sm font-semibold hover:bg-[#e9edff] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-14 bg-[#006d2f] text-white rounded-2xl text-base font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-[#005523] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Save Product</span>
          </button>
        </div>
      </div>
    </form>
  );
};
