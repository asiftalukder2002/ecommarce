/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Category, ActiveTab, AdminSubView, Seller, UserProfile } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SELLERS } from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ProductDetailsScreen } from './components/ProductDetailsScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminInventoryScreen } from './components/AdminInventoryScreen';
import { SellerPanel } from './components/SellerPanel';
import { CategoriesScreen } from './components/CategoriesScreen';
import { SearchScreen } from './components/SearchScreen';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { LiveChatModal } from './components/LiveChatModal';

import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  subscribeToProducts,
  subscribeToCategories,
  subscribeToSellers,
  saveProductToFirestore,
  updateProductStockInFirestore,
  deleteProductFromFirestore,
  saveCategoryToFirestore,
  saveSellerToFirestore,
  getUserProfileFromFirestore,
  saveUserProfileToFirestore,
} from './services/firebaseService';

export default function App() {
  // State for products, categories, sellers
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(() => {
    const saved = localStorage.getItem('luma_current_seller');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing current seller', e);
      }
    }
    return INITIAL_SELLERS[0] || null;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('luma_wishlist');
    return saved ? JSON.parse(saved) : ['aura-wireless-charger'];
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation & View states
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [adminSubView, setAdminSubView] = useState<AdminSubView>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [whatsAppOrderData, setWhatsAppOrderData] = useState<{
    product: Product;
    quantity: number;
    color: string;
    storage: string;
    totalPrice: number;
  } | null>(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatProductContext, setChatProductContext] = useState<Product | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // ==================== FIREBASE REAL-TIME SUBSCRIPTIONS ====================

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // Fetch or create user profile in Firestore
        const existingProfile = await getUserProfileFromFirestore(user.uid);
        const profile: UserProfile = existingProfile || {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Luma Member',
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          role: 'customer',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Products Real-Time Sync with Firestore
  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (liveProducts) => {
        if (liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      },
      (err) => {
        console.warn('Using local fallback products due to notice:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Categories Real-Time Sync with Firestore
  useEffect(() => {
    const unsubscribe = subscribeToCategories((liveCategories) => {
      if (liveCategories && liveCategories.length > 0) {
        setCategories(liveCategories);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sellers Real-Time Sync with Firestore
  useEffect(() => {
    const unsubscribe = subscribeToSellers((liveSellers) => {
      if (liveSellers && liveSellers.length > 0) {
        setSellers(liveSellers);
      }
    });

    return () => unsubscribe();
  }, []);

  // Local storage backups
  useEffect(() => {
    if (currentSeller) {
      localStorage.setItem('luma_current_seller', JSON.stringify(currentSeller));
    } else {
      localStorage.removeItem('luma_current_seller');
    }
  }, [currentSeller]);

  useEffect(() => {
    localStorage.setItem('luma_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // User Auth Actions
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      showToast('Logged out successfully (লগআউট সম্পন্ন)');
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Error logging out');
    }
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    showToast(`Welcome ${profile.displayName}! Logged in successfully.`);
  };

  // Open Chat with product context
  const handleOpenChatWithProduct = (product: Product) => {
    setChatProductContext(product);
    setShowChatModal(true);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : 'Added to Wishlist ❤️');
      return updated;
    });
  };

  // Select a product to view details
  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back navigation handler
  const handleBack = () => {
    if (selectedProductId) {
      setSelectedProductId(null);
    } else if (activeTab === 'admin' && adminSubView !== 'dashboard') {
      setAdminSubView('dashboard');
      setEditingProduct(null);
    }
  };

  // Seller Handlers
  const handleRegisterSeller = async (newSeller: Seller) => {
    setSellers((prev) => [...prev, newSeller]);
    setCurrentSeller(newSeller);
    try {
      await saveSellerToFirestore(newSeller);
    } catch (e) {
      console.warn('Seller saved in local state', e);
    }
    showToast(`Welcome ${newSeller.shopName}! Seller account created.`);
  };

  const handleLoginSeller = (seller: Seller) => {
    setCurrentSeller(seller);
    showToast(`Logged in as ${seller.shopName}`);
  };

  const handleLogoutSeller = () => {
    setCurrentSeller(null);
    showToast('Logged out of seller portal');
  };

  const handleUpdateSellerProfile = async (updatedSeller: Seller) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === updatedSeller.id ? updatedSeller : s))
    );
    setCurrentSeller(updatedSeller);
    try {
      await saveSellerToFirestore(updatedSeller);
    } catch (e) {
      console.warn('Seller profile updated locally', e);
    }
    showToast('Seller profile & shop info updated!');
  };

  // Admin / Seller Product Actions
  const handleAddProduct = () => {
    setEditingProduct(null);
    setAdminSubView('add-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setAdminSubView('edit-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      try {
        await deleteProductFromFirestore(productId);
      } catch (e) {
        console.warn('Product deleted locally', e);
      }
      showToast('Product deleted from inventory');
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stockCount: validStock,
              inStock: validStock > 0,
            }
          : p
      )
    );
    try {
      await updateProductStockInFirestore(productId, validStock);
    } catch (e) {
      console.warn('Stock updated locally', e);
    }
    showToast(
      validStock === 0
        ? 'Stock updated: Marked as Out of Stock (0)'
        : `Stock updated: ${validStock} units in inventory`
    );
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    const calculatedStockCount =
      productData.stockCount !== undefined ? productData.stockCount : 10;
    const isNowInStock =
      productData.inStock !== undefined
        ? productData.inStock && calculatedStockCount > 0
        : calculatedStockCount > 0;

    let savedProduct: Product;

    if (editingProduct && productData.id) {
      // Update existing
      savedProduct = {
        ...editingProduct,
        ...productData,
        stockCount: calculatedStockCount,
        inStock: isNowInStock,
      } as Product;

      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? savedProduct : p))
      );
      showToast('Product updated successfully!');
    } else {
      // Create new
      savedProduct = {
        id: `prod-${Date.now()}`,
        name: productData.name || 'Untitled Product',
        category: productData.category || 'electronics',
        price: productData.price || 0,
        originalPrice: productData.originalPrice,
        currency: '৳',
        image:
          productData.image ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        description: productData.description || '',
        inStock: isNowInStock,
        stockCount: calculatedStockCount,
        badge: productData.badge,
        sellerId: productData.sellerId || currentSeller?.id || 'seller-1',
        sellerName: productData.sellerName || currentSeller?.shopName || 'Official Store',
        sellerPhone: productData.sellerPhone || currentSeller?.phone || '01319967499',
        sellerWhatsApp:
          productData.sellerWhatsApp ||
          currentSeller?.whatsappNumber ||
          '8801319967499',
        featured: true,
        rating: 5.0,
        reviewsCount: 1,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [savedProduct, ...prev]);
      showToast('New product added to catalog & saved to Firestore!');
    }

    try {
      await saveProductToFirestore(savedProduct);
    } catch (e) {
      console.warn('Product saved locally', e);
    }

    if (activeTab === 'admin') {
      setAdminSubView('dashboard');
      setEditingProduct(null);
    }
  };

  const handleAddCategory = async (name: string, icon: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const newCat: Category = {
      id: slug,
      name,
      slug,
      icon,
      count: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    try {
      await saveCategoryToFirestore(newCat);
    } catch (e) {
      console.warn('Category saved locally', e);
    }
    showToast(`Category "${name}" added`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast('Category deleted');
  };

  const handleNavigateToSearch = (initialQuery = '') => {
    setSearchQuery(initialQuery);
    setSelectedProductId(null);
    setActiveTab('search');
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className={`min-h-screen bg-[#f9f9ff] text-[#141b2b] flex justify-center selection:bg-[#006d2f]/20`}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#141b2b] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-200 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Wrapper */}
      <div
        className={`w-full transition-all duration-300 min-h-screen flex flex-col bg-[#f9f9ff] relative ${
          isMobileFrame
            ? 'max-w-[430px] shadow-2xl border-x border-[#bbcbb9]/30 my-0 md:my-4 md:rounded-3xl md:overflow-hidden md:min-h-[880px]'
            : 'max-w-2xl'
        }`}
      >
        {/* Persistent Header */}
        <Header
          activeTab={activeTab}
          adminSubView={adminSubView}
          selectedProductId={selectedProductId}
          currentUser={currentUser}
          onBack={handleBack}
          onSearchClick={() => handleNavigateToSearch()}
          onProfileClick={() => setShowProfileModal(true)}
          onOpenChat={() => {
            setChatProductContext(null);
            setShowChatModal(true);
          }}
          onOpenAuth={() => setShowAuthModal(true)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Dynamic Screen Content */}
        <main className="flex-1 pt-16">
          {selectedProduct ? (
            <ProductDetailsScreen
              product={selectedProduct}
              onBack={handleBack}
              isWishlisted={wishlist.includes(selectedProduct.id)}
              onToggleWishlist={handleToggleWishlist}
              onOrderWhatsApp={(order) => setWhatsAppOrderData(order)}
              onOpenChat={handleOpenChatWithProduct}
            />
          ) : activeTab === 'home' ? (
            <HomeScreen
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              currentUser={currentUser}
              onSelectCategory={(slug) => setSelectedCategory(slug)}
              onSelectProduct={handleSelectProduct}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onNavigateToSearch={handleNavigateToSearch}
            />
          ) : activeTab === 'categories' ? (
            <CategoriesScreen
              categories={categories}
              products={products}
              onSelectCategory={(slug) => {
                setSelectedCategory(slug);
                setActiveTab('home');
              }}
              onSelectProduct={handleSelectProduct}
            />
          ) : activeTab === 'search' ? (
            <SearchScreen
              products={products}
              categories={categories}
              initialQuery={searchQuery}
              onSelectProduct={handleSelectProduct}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
          ) : activeTab === 'seller' ? (
            <SellerPanel
              products={products}
              categories={categories}
              sellers={sellers}
              currentSeller={currentSeller}
              onRegisterSeller={handleRegisterSeller}
              onLoginSeller={handleLoginSeller}
              onLogoutSeller={handleLogoutSeller}
              onUpdateSellerProfile={handleUpdateSellerProfile}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateStock={handleUpdateStock}
            />
          ) : activeTab === 'admin' ? (
            adminSubView === 'dashboard' ? (
              <AdminDashboard
                products={products}
                categories={categories}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateStock={handleUpdateStock}
              />
            ) : (
              <AdminInventoryScreen
                categories={categories}
                initialProduct={editingProduct}
                onSave={handleSaveProduct}
                onCancel={handleBack}
              />
            )
          ) : null}
        </main>

        {/* Floating Quick Action Button for Live Firestore Chat */}
        {!selectedProductId && (
          <button
            onClick={() => {
              setChatProductContext(null);
              setShowChatModal(true);
            }}
            title="Open Live Chat / প্রশ্ন করুন"
            className="fixed bottom-20 right-4 z-40 bg-[#006d2f] text-white p-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-white ring-2 ring-[#006d2f]/30"
          >
            <span className="material-symbols-outlined text-[24px]">chat</span>
            <span className="text-xs font-bold hidden sm:inline pr-1">Live Chat</span>
          </button>
        )}

        {/* Bottom Navigation (Hidden when viewing full Product Details or Add/Edit Product form) */}
        {!selectedProductId && !(activeTab === 'admin' && adminSubView !== 'dashboard') && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setSelectedProductId(null);
              setAdminSubView('dashboard');
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            wishlistCount={wishlist.length}
          />
        )}
      </div>

      {/* WhatsApp Interactive Order Modal */}
      {whatsAppOrderData && (
        <WhatsAppOrderModal
          orderData={whatsAppOrderData}
          currentUser={currentUser}
          onClose={() => setWhatsAppOrderData(null)}
          onOrderSaved={(id) => {
            showToast(`Order #${id.slice(0, 6).toUpperCase()} logged to Firebase!`);
          }}
        />
      )}

      {/* User Profile Drawer Modal */}
      {showProfileModal && (
        <UserProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          wishlistProducts={wishlistProducts}
          onSelectProduct={handleSelectProduct}
          onGoToAdmin={() => {
            setSelectedProductId(null);
            setAdminSubView('dashboard');
            setActiveTab('admin');
          }}
          onGoToSeller={() => {
            setSelectedProductId(null);
            setActiveTab('seller');
          }}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onOpenChat={() => {
            setChatProductContext(null);
            setShowChatModal(true);
          }}
        />
      )}

      {/* Firebase Authentication Modal (Login, Register, Google Sign-In) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Firebase Real-Time Chat & Inquiries Modal */}
      <LiveChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        currentUser={currentUser}
        productContext={chatProductContext}
        onOpenAuth={() => {
          setShowChatModal(false);
          setShowAuthModal(true);
        }}
      />
    </div>
  );
}
