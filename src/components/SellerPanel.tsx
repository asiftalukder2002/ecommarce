import React, { useState } from 'react';
import { Product, Category, Seller } from '../types';

interface SellerPanelProps {
  sellers: Seller[];
  currentSeller: Seller | null;
  products: Product[];
  categories: Category[];
  onRegisterSeller: (sellerData: Omit<Seller, 'id' | 'joinedDate' | 'verified'>) => void;
  onLoginSeller: (sellerId: string) => void;
  onLogoutSeller: () => void;
  onUpdateSellerProfile: (updatedSeller: Seller) => void;
  onAddProduct: (productData: Partial<Product>) => void;
  onEditProduct: (productData: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onSelectProduct: (product: Product) => void;
  onGoToStore: () => void;
}

export const SellerPanel: React.FC<SellerPanelProps> = ({
  sellers,
  currentSeller,
  products,
  categories,
  onRegisterSeller,
  onLoginSeller,
  onLogoutSeller,
  onUpdateSellerProfile,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateStock,
  onSelectProduct,
  onGoToStore,
}) => {
  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [regShopName, setRegShopName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsApp, setRegWhatsApp] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regDescription, setRegDescription] = useState('');

  // Dashboard state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Form state for Add/Edit product
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOrigPrice, setFormOrigPrice] = useState('');
  const [formCategory, setFormCategory] = useState('electronics');
  const [formStock, setFormStock] = useState(10);
  const [formImage, setFormImage] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBadge, setFormBadge] = useState<string>('');

  // Profile edit state
  const [editShopName, setEditShopName] = useState('');
  const [editOwnerName, setEditOwnerName] = useState('');
  const [editWhatsApp, setEditWhatsApp] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Open modal helper
  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormTagline('');
    setFormPrice('');
    setFormOrigPrice('');
    setFormCategory('electronics');
    setFormStock(15);
    setFormImage(
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjLJIV6F4enMjnU71qhUhQOJl0LtlbMdtO2BwBi333smE-iFq_bEGF8qW6Ow8S7sz8DLqn8Tx2gA__HxnSSp2KnIsHB7CkoaMJqS0P8k9mCEnKdXF8F1A70Kb78cMxGcqx9-32bvPCXXvtYc8Qj598HIjUgWTH7uujxC0g2xZlsbWhs4wPOrjNP4KjUODvQjQS9rfGtu_EJjlI_9H_qatVtlkTj695mmcbjKJQltciLopdqLgJNV-iIA'
    );
    setFormDesc('');
    setFormBadge('');
    setShowAddModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormTagline(p.tagline || '');
    setFormPrice(p.price.toString());
    setFormOrigPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setFormCategory(p.category);
    setFormStock(p.stockCount !== undefined ? p.stockCount : p.inStock ? 10 : 0);
    setFormImage(p.image);
    setFormDesc(p.description);
    setFormBadge(p.badge || '');
    setShowAddModal(true);
  };

  const openProfileEdit = () => {
    if (!currentSeller) return;
    setEditShopName(currentSeller.shopName);
    setEditOwnerName(currentSeller.ownerName);
    setEditWhatsApp(currentSeller.whatsappNumber);
    setEditPhone(currentSeller.phone);
    setEditAddress(currentSeller.address || '');
    setEditDescription(currentSeller.description || '');
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeller || !editShopName.trim() || !editWhatsApp.trim()) return;
    onUpdateSellerProfile({
      ...currentSeller,
      shopName: editShopName.trim(),
      ownerName: editOwnerName.trim() || currentSeller.ownerName,
      whatsappNumber: editWhatsApp.trim(),
      phone: editPhone.trim() || editWhatsApp.trim(),
      address: editAddress.trim(),
      description: editDescription.trim(),
    });
    setShowProfileModal(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regShopName.trim() || !regOwnerName.trim() || !regWhatsApp.trim()) {
      alert('Please fill in required fields: Shop Name, Owner Name, and WhatsApp Number.');
      return;
    }

    onRegisterSeller({
      shopName: regShopName.trim(),
      ownerName: regOwnerName.trim(),
      phone: regPhone.trim() || regWhatsApp.trim(),
      whatsappNumber: regWhatsApp.replace(/[^0-9]/g, ''),
      email: regEmail.trim() || `${regShopName.toLowerCase().replace(/\s+/g, '')}@luma.store`,
      address: regAddress.trim() || 'Dhaka, Bangladesh',
      description: regDescription.trim() || 'Verified merchant on Luma Store.',
    });
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const priceNum = parseFloat(formPrice);
    const origPriceNum = formOrigPrice ? parseFloat(formOrigPrice) : undefined;
    const finalStock = Math.max(0, formStock);

    const productPayload: Partial<Product> = {
      name: formName.trim(),
      tagline: formTagline.trim() || undefined,
      price: priceNum,
      originalPrice: origPriceNum,
      category: formCategory,
      stockCount: finalStock,
      inStock: finalStock > 0,
      image: formImage.trim() || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjLJIV6F4enMjnU71qhUhQOJl0LtlbMdtO2BwBi333smE-iFq_bEGF8qW6Ow8S7sz8DLqn8Tx2gA__HxnSSp2KnIsHB7CkoaMJqS0P8k9mCEnKdXF8F1A70Kb78cMxGcqx9-32bvPCXXvtYc8Qj598HIjUgWTH7uujxC0g2xZlsbWhs4wPOrjNP4KjUODvQjQS9rfGtu_EJjlI_9H_qatVtlkTj695mmcbjKJQltciLopdqLgJNV-iIA',
      description: formDesc.trim() || `Authentic ${formName} supplied by ${currentSeller?.shopName || 'Store Vendor'}.`,
      badge: (formBadge as any) || undefined,
      currency: '৳',
      sellerId: currentSeller?.id,
      sellerName: currentSeller?.shopName,
      sellerPhone: currentSeller?.phone,
      sellerWhatsApp: currentSeller?.whatsappNumber,
    };

    if (editingProduct) {
      onEditProduct({
        ...editingProduct,
        ...productPayload,
      });
    } else {
      onAddProduct(productPayload);
    }
    setShowAddModal(false);
  };

  // If not logged in as a seller, show Authentication & Registration Screen
  if (!currentSeller) {
    return (
      <div className="flex flex-col w-full pb-28 pt-2 max-w-2xl mx-auto px-4 space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#006d2f] to-[#004e21] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3">
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Luma Partner & Seller Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Seller Portal (সেলার প্যানেল)
            </h1>
            <p className="text-white/90 text-sm mt-1.5 leading-relaxed max-w-md">
              Create your seller account, list products, track warehouse inventory, and receive customer orders directly on WhatsApp!
            </p>
          </div>
        </div>

        {/* Quick Demo Sellers Login Cards */}
        {sellers.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#bbcbb9]/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#141b2b]">Demo Seller Accounts</h3>
                <p className="text-xs text-[#3c4a3d]">One-click instant login as an active merchant</p>
              </div>
              <span className="text-xs font-bold text-[#006d2f] bg-[#e9f7ef] px-2.5 py-0.5 rounded-full">
                {sellers.length} Shops
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sellers.map((s) => {
                const sellerProductCount = products.filter((p) => p.sellerId === s.id).length;
                return (
                  <button
                    key={s.id}
                    onClick={() => onLoginSeller(s.id)}
                    className="p-3.5 rounded-2xl bg-[#f9f9ff] hover:bg-[#e9edff] border border-[#bbcbb9]/20 flex items-center justify-between gap-3 text-left transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                        {s.avatar ? (
                          <img src={s.avatar} alt={s.shopName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#006d2f] text-white flex items-center justify-center font-bold text-base">
                            {s.shopName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-bold text-[#141b2b] truncate group-hover:text-[#006d2f] transition-colors">
                            {s.shopName}
                          </h4>
                          {s.verified && (
                            <span className="material-symbols-outlined text-[14px] text-[#006d2f]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#3c4a3d]/80 truncate">
                          {s.ownerName} • {sellerProductCount} items
                        </p>
                        <p className="text-[10px] text-[#006d2f] font-semibold flex items-center gap-0.5 mt-0.5">
                          <span className="material-symbols-outlined text-[12px]">chat</span>
                          {s.whatsappNumber}
                        </p>
                      </div>
                    </div>

                    <span className="material-symbols-outlined text-[#006d2f] group-hover:translate-x-0.5 transition-transform text-[20px] shrink-0">
                      login
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Toggle: Register vs Existing Login */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#bbcbb9]/30">
          <div className="flex items-center bg-[#e9edff] p-1 rounded-2xl mb-6">
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-[#006d2f] shadow-sm'
                  : 'text-[#3c4a3d] hover:text-[#141b2b]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Register New Shop</span>
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white text-[#006d2f] shadow-sm'
                  : 'text-[#3c4a3d] hover:text-[#141b2b]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">store</span>
              <span>Select Shop</span>
            </button>
          </div>

          {authMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#141b2b]">Create Your Seller Account</h3>
                <p className="text-xs text-[#3c4a3d] mt-0.5">
                  Register your shop in seconds to manage inventory and receive direct customer WhatsApp orders.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                  Shop / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={regShopName}
                  onChange={(e) => setRegShopName(e.target.value)}
                  placeholder="e.g. Apex Gadgets BD, Dhaka Craft Store"
                  className="w-full h-12 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium border border-transparent focus:border-[#006d2f] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regOwnerName}
                    onChange={(e) => setRegOwnerName(e.target.value)}
                    placeholder="e.g. Md. Asif Hamza"
                    className="w-full h-12 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium border border-transparent focus:border-[#006d2f] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                    WhatsApp Number (for Orders) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 material-symbols-outlined text-[20px] text-[#25d366]">
                      chat
                    </span>
                    <input
                      type="text"
                      required
                      value={regWhatsApp}
                      onChange={(e) => setRegWhatsApp(e.target.value)}
                      placeholder="e.g. 01319967499 or 8801319967499"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium border border-transparent focus:border-[#006d2f] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 01700000000"
                    className="w-full h-12 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium border border-transparent focus:border-[#006d2f] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. seller@store.com"
                    className="w-full h-12 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium border border-transparent focus:border-[#006d2f] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                  Store Address / Location
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="e.g. Gulshan-1, Dhaka or Online Store"
                  className="w-full h-12 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium border border-transparent focus:border-[#006d2f] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                  Store Description
                </label>
                <textarea
                  rows={2}
                  value={regDescription}
                  onChange={(e) => setRegDescription(e.target.value)}
                  placeholder="Briefly describe what your shop sells..."
                  className="w-full p-3.5 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium border border-transparent focus:border-[#006d2f] focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-13 bg-[#006d2f] hover:bg-[#005523] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                <span>Open Seller Account & Enter Dashboard</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#141b2b]">Select Existing Seller Profile</h3>
                <p className="text-xs text-[#3c4a3d] mt-0.5">
                  Click on your store name to access your dashboard.
                </p>
              </div>

              <div className="space-y-2.5">
                {sellers.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onLoginSeller(s.id)}
                    className="p-4 rounded-2xl bg-[#f0f4ff] hover:bg-[#e1e8fd] border border-[#bbcbb9]/30 cursor-pointer flex items-center justify-between gap-3 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#006d2f] text-white font-bold flex items-center justify-center text-sm">
                        {s.shopName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#141b2b]">{s.shopName}</h4>
                        <p className="text-xs text-[#3c4a3d]">Owner: {s.ownerName} • {s.phone}</p>
                      </div>
                    </div>

                    <button className="px-3.5 py-1.5 bg-[#006d2f] text-white rounded-xl text-xs font-bold shadow-sm">
                      Login
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Current seller products & stats
  const sellerProducts = products.filter(
    (p) => p.sellerId === currentSeller.id || (!p.sellerId && currentSeller.id === 'seller-tech-hub')
  );

  const totalSellerUnitsInStock = sellerProducts.reduce(
    (acc, p) => acc + (p.inStock ? p.stockCount ?? 1 : 0),
    0
  );

  const lowStockProductsCount = sellerProducts.filter(
    (p) => !p.inStock || (p.stockCount !== undefined && p.stockCount <= 5)
  ).length;

  const totalInventoryValuation = sellerProducts.reduce((acc, p) => {
    const stock = p.stockCount ?? (p.inStock ? 1 : 0);
    return acc + p.price * stock;
  }, 0);

  // Filter products
  const filteredSellerProducts = sellerProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

    let matchesStock = true;
    const stock = p.stockCount ?? (p.inStock ? 10 : 0);
    if (stockFilter === 'inStock') matchesStock = p.inStock && stock > 5;
    else if (stockFilter === 'lowStock') matchesStock = p.inStock && stock > 0 && stock <= 5;
    else if (stockFilter === 'outOfStock') matchesStock = !p.inStock || stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-2xl mx-auto px-4 space-y-6">
      {/* Seller Store Header Card */}
      <div className="bg-gradient-to-br from-[#141b2b] to-[#252f44] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 shrink-0 flex items-center justify-center">
              {currentSeller.avatar ? (
                <img
                  src={currentSeller.avatar}
                  alt={currentSeller.shopName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[32px] text-[#25d366]">
                  storefront
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {currentSeller.shopName}
                </h1>
                {currentSeller.verified && (
                  <span
                    className="material-symbols-outlined text-[18px] text-[#25d366]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    title="Verified Merchant"
                  >
                    verified
                  </span>
                )}
              </div>
              <p className="text-xs text-white/75 mt-0.5">
                Owner: <span className="font-semibold text-white">{currentSeller.ownerName}</span> • Member since {currentSeller.joinedDate}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <a
                  href={`https://api.whatsapp.com/send?phone=${currentSeller.whatsappNumber}&text=Hello%20${encodeURIComponent(
                    currentSeller.shopName
                  )}!%20Inquiry%20regarding%20inventory.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#25d366]/20 text-[#25d366] hover:bg-[#25d366]/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">chat</span>
                  <span>{currentSeller.whatsappNumber}</span>
                </a>
                {currentSeller.address && (
                  <span className="text-[11px] text-white/60 truncate max-w-[180px]">
                    📍 {currentSeller.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={openProfileEdit}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Shop Settings</span>
            </button>
            <button
              onClick={onLogoutSeller}
              title="Logout / Switch Shop"
              className="p-2 bg-white/10 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Products Count */}
        <div className="bg-[#e1e8fd] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between h-28 border border-[#bbcbb9]/20">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#0051d5] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              inventory_2
            </span>
            <span className="text-[11px] font-bold text-[#3c4a3d] uppercase tracking-wider">
              My Items
            </span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#141b2b] block">
              {sellerProducts.length}
            </span>
            <span className="text-[11px] font-semibold text-[#0051d5]">Listed Products</span>
          </div>
        </div>

        {/* Total Stock Units */}
        <div className="bg-[#e9f7ef] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between h-28 border border-[#006d2f]/20">
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
              {totalSellerUnitsInStock}
            </span>
            <span className="text-[11px] font-semibold text-[#006d2f]/80">Available Units</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[#fff4e5] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between h-28 border border-[#f57c00]/20">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#e65100] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <span className="text-[11px] font-bold text-[#e65100] uppercase tracking-wider">
              Low / Out Stock
            </span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#e65100] block">
              {lowStockProductsCount}
            </span>
            <span className="text-[11px] font-semibold text-[#b26a00]">Items Need Restock</span>
          </div>
        </div>

        {/* Valuation */}
        <div className="bg-[#f0f4ff] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between h-28 border border-[#bbcbb9]/20">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#141b2b] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              payments
            </span>
            <span className="text-[11px] font-bold text-[#3c4a3d] uppercase tracking-wider">
              Stock Value
            </span>
          </div>
          <div>
            <span className="text-lg font-extrabold text-[#141b2b] block truncate">
              ৳ {totalInventoryValuation.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-[#3c4a3d]/80">Total Inventory</span>
          </div>
        </div>
      </div>

      {/* Seller Inventory Management Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-xl font-bold text-[#141b2b]">My Shop Inventory & Stock Control</h2>
            <p className="text-xs text-[#3c4a3d]">
              Adjust unit quantities instantly (+ / -) or add new products under your shop
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToStore}
              className="h-10 px-3.5 bg-[#e9edff] text-[#0051d5] rounded-full font-bold text-xs flex items-center gap-1.5 hover:bg-[#dbe1ff] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>View in Store</span>
            </button>

            <button
              onClick={openAddModal}
              className="h-10 px-4 bg-[#006d2f] text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#005523] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Search & Stock Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 material-symbols-outlined text-[20px] text-[#3c4a3d]/60">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your shop products..."
              className="w-full h-11 pl-11 pr-4 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] focus:outline-none focus:ring-2 focus:ring-[#006d2f] shadow-inner placeholder-[#3c4a3d]/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                stockFilter === 'all'
                  ? 'bg-[#141b2b] text-white'
                  : 'bg-white text-[#3c4a3d] border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All ({sellerProducts.length})
            </button>
            <button
              onClick={() => setStockFilter('inStock')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                stockFilter === 'inStock'
                  ? 'bg-[#006d2f] text-white'
                  : 'bg-white text-[#006d2f] border border-slate-200 hover:bg-emerald-50'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStockFilter('lowStock')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                stockFilter === 'lowStock'
                  ? 'bg-[#e65100] text-white'
                  : 'bg-white text-[#e65100] border border-slate-200 hover:bg-orange-50'
              }`}
            >
              Low Stock (&le;5)
            </button>
            <button
              onClick={() => setStockFilter('outOfStock')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                stockFilter === 'outOfStock'
                  ? 'bg-[#ba1a1a] text-white'
                  : 'bg-white text-[#ba1a1a] border border-slate-200 hover:bg-rose-50'
              }`}
            >
              Out of Stock (0)
            </button>
          </div>
        </div>

        {/* Product Items List */}
        {filteredSellerProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#bbcbb9]/30 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#e9edff] text-[#006d2f] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">inventory</span>
            </div>
            <h3 className="text-base font-bold text-[#141b2b]">No products match your filter</h3>
            <p className="text-xs text-[#3c4a3d] max-w-sm mx-auto">
              You can list a new product in your shop or adjust your search filter above.
            </p>
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-[#006d2f] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#005523] active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSellerProducts.map((product) => {
              const currentStock = product.stockCount ?? (product.inStock ? 10 : 0);
              const isOutOfStock = !product.inStock || currentStock === 0;
              const isLowStock = !isOutOfStock && currentStock <= 5;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#bbcbb9]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:shadow-md"
                >
                  {/* Product Info */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white uppercase bg-rose-600 px-1 py-0.5 rounded">
                            0
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#141b2b] truncate group-hover:text-[#006d2f] transition-colors">
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
                            ? 'Out of Stock (0 units)'
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
                        onClick={() => onUpdateStock(product.id, Math.max(0, currentStock - 1))}
                        disabled={currentStock <= 0}
                        title="Decrease Stock by 1"
                        className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] hover:bg-[#ffdad6] hover:text-[#ba1a1a] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#141b2b] active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>

                      <div className="px-2 min-w-[54px] text-center">
                        <span className="text-xs font-bold text-[#141b2b] block leading-tight">
                          {currentStock}
                        </span>
                        <span className="text-[9px] text-[#3c4a3d]/70 font-medium">units</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onUpdateStock(product.id, currentStock + 1)}
                        title="Increase Stock by 1"
                        className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] hover:bg-[#e9f7ef] hover:text-[#006d2f] active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>

                      {/* Quick +5 button */}
                      <button
                        type="button"
                        onClick={() => onUpdateStock(product.id, currentStock + 5)}
                        title="Add 5 units"
                        className="px-1.5 h-7 rounded-lg bg-[#006d2f]/10 text-[#006d2f] text-[10px] font-bold hover:bg-[#006d2f]/20 active:scale-95 transition-all"
                      >
                        +5
                      </button>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        title="Edit Product Details"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#3c4a3d] hover:bg-[#e9edff] hover:text-[#006d2f] active:scale-95 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove "${product.name}" from your shop?`)) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        title="Delete Product"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#ba1a1a]/80 hover:bg-[#ffdad6] hover:text-[#ba1a1a] active:scale-95 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#141b2b]">
                  {editingProduct ? 'Edit Shop Product' : 'Add New Product to Shop'}
                </h3>
                <p className="text-xs text-[#3c4a3d]">
                  Shop: <span className="font-semibold text-[#006d2f]">{currentSeller.shopName}</span>
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Wireless Smart Earbuds"
                  className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium focus:bg-white focus:ring-2 focus:ring-[#006d2f] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. Active Noise Cancellation & 40h Battery"
                  className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium focus:bg-white focus:ring-2 focus:ring-[#006d2f] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-bold focus:bg-white focus:ring-2 focus:ring-[#006d2f] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrigPrice}
                    onChange={(e) => setFormOrigPrice(e.target.value)}
                    placeholder="e.g. 4200"
                    className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium focus:bg-white focus:ring-2 focus:ring-[#006d2f] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium focus:bg-white focus:ring-2 focus:ring-[#006d2f] outline-none transition-all"
                  >
                    {categories
                      .filter((c) => c.slug !== 'all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                    Badge
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium focus:bg-white focus:ring-2 focus:ring-[#006d2f] outline-none transition-all"
                  >
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                    <option value="HOT">HOT</option>
                    <option value="LIMITED">LIMITED</option>
                  </select>
                </div>
              </div>

              {/* Stock Quantity Stepper */}
              <div className="p-3.5 bg-[#f9f9ff] rounded-2xl border border-[#bbcbb9]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#141b2b]">
                      Available Stock Quantity (Units)
                    </label>
                    <span className="text-[11px] text-[#3c4a3d]">
                      Buyers will see this exact quantity
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      formStock === 0
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : formStock <= 5
                        ? 'bg-[#fff4e5] text-[#e65100]'
                        : 'bg-[#e9f7ef] text-[#006d2f]'
                    }`}
                  >
                    {formStock === 0 ? 'Out of Stock' : `${formStock} units available`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setFormStock(Math.max(0, formStock - 1))}
                      className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[#141b2b] hover:bg-slate-200"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={formStock}
                      onChange={(e) => setFormStock(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 text-center font-bold text-base text-[#141b2b] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setFormStock(formStock + 1)}
                      className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[#141b2b] hover:bg-slate-200"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormStock((prev) => prev + 5)}
                    className="h-11 px-3 bg-white text-[#006d2f] border border-[#006d2f]/30 rounded-xl text-xs font-bold hover:bg-[#e9f7ef]"
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStock((prev) => prev + 10)}
                    className="h-11 px-3 bg-white text-[#006d2f] border border-[#006d2f]/30 rounded-xl text-xs font-bold hover:bg-[#e9f7ef]"
                  >
                    +10
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium focus:bg-white focus:ring-2 focus:ring-[#006d2f] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1.5 uppercase tracking-wider">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe your product features, warranty, and package contents..."
                  className="w-full p-3.5 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium focus:bg-white focus:ring-2 focus:ring-[#006d2f] outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#3c4a3d] hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006d2f] hover:bg-[#005523] text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile & WhatsApp Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#141b2b]">Shop Profile & Settings</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1 uppercase tracking-wider">
                  Shop Name *
                </label>
                <input
                  type="text"
                  required
                  value={editShopName}
                  onChange={(e) => setEditShopName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium outline-none focus:ring-2 focus:ring-[#006d2f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1 uppercase tracking-wider">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  value={editOwnerName}
                  onChange={(e) => setEditOwnerName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium outline-none focus:ring-2 focus:ring-[#006d2f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1 uppercase tracking-wider">
                  WhatsApp Number (Receives Order Inquiries) *
                </label>
                <input
                  type="text"
                  required
                  value={editWhatsApp}
                  onChange={(e) => setEditWhatsApp(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium outline-none focus:ring-2 focus:ring-[#006d2f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1 uppercase tracking-wider">
                  Store Location / Address
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium outline-none focus:ring-2 focus:ring-[#006d2f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4a3d] mb-1 uppercase tracking-wider">
                  Store Description
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#f0f4ff] text-sm text-[#141b2b] font-medium outline-none focus:ring-2 focus:ring-[#006d2f] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#3c4a3d] hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006d2f] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#005523] active:scale-95 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
