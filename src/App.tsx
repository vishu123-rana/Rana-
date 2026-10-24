/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Sparkles, SlidersHorizontal, Heart, ShieldCheck, CheckCircle2, Leaf } from 'lucide-react';
import { Perfume, CartItem, User, Order, PerfumeCategory, PerfumeSize } from './types';
import { getStoredPerfumes } from './utils/perfumes';
import { getCurrentUser, logoutUser } from './utils/auth';

// Components
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SignatureFragrance from './components/SignatureFragrance';
import CollectionStory from './components/CollectionStory';
import FragranceDiscovery from './components/FragranceDiscovery';
import FinalCTA from './components/FinalCTA';
import CollectionSection from './components/CollectionSection';
import BotanicalShowcase from './components/BotanicalShowcase';
import ShopByFragrance from './components/ShopByFragrance';
import BestsellersSection from './components/BestsellersSection';
import NewArrivalsSection from './components/NewArrivalsSection';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import IngredientsSection from './components/IngredientsSection';
import AboutSection from './components/AboutSection';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import PolicyModal from './components/PolicyModal';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import OrderTrackingPage from './components/OrderTrackingPage';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import AIFragranceAssistant from './components/AIFragranceAssistant';
import BackToTop from './components/BackToTop';
import AboutPage from './components/AboutPage';
import { isAdminLoggedIn } from './utils/adminAuth';

export default function App() {
  // 1. Splash Intro Screen Control (runs once on load)
  const [showIntro, setShowIntro] = useState(true);

  // 2. Perfumes Catalog (synced with LocalStorage so admin updates reflect live)
  const [allPerfumes, setAllPerfumes] = useState<Perfume[]>(() => getStoredPerfumes());

  // 3. User Authentication State & View Router
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [activeView, setActiveView] = useState<
    'home' | 'login' | 'signup' | 'checkout' | 'confirmation' | 'orders' | 'tracking' | 'admin' | 'about'
  >('home');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [authNotification, setAuthNotification] = useState<string | null>(null);

  // 4. Shopping Cart & Wishlist persistence state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rana_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Perfume[]>(() => {
    const saved = localStorage.getItem('rana_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('rana_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rana_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Keep allPerfumes up-to-date with stored items when switching back from admin
  useEffect(() => {
    if (activeView === 'home') {
      setAllPerfumes(getStoredPerfumes());
    }
  }, [activeView]);

  // Real-time listener for perfume updates from admin panel
  useEffect(() => {
    const handlePerfumesUpdated = (e: any) => {
      setAllPerfumes(e.detail || getStoredPerfumes());
    };
    window.addEventListener('rana_perfumes_updated', handlePerfumesUpdated);
    return () => window.removeEventListener('rana_perfumes_updated', handlePerfumesUpdated);
  }, []);

  // 5. Admin Authentication Guard & Login Modal State
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  useEffect(() => {
    // Prevent unauthenticated URL or state manipulation to access admin
    if (activeView === 'admin' && !isAdminLoggedIn()) {
      setActiveView('home');
      setIsAdminLoginModalOpen(true);
    }
  }, [activeView]);

  // 6. UI Overlays / Modals Control
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Checkout calculations shared from cart drawer
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState('');

  // 7. Catalog Filtering & Searching
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'all' | PerfumeCategory | 'bestsellers'
  >('all');
  const [activeIngredientFilter, setActiveIngredientFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Scent filter processor (Only active products are shown on public storefront)
  const filteredPerfumes = allPerfumes.filter((perfume) => {
    // 0. Only show enabled products on customer storefront
    if (perfume.isActive === false) return false;

    // 1. Category check
    if (activeCategoryFilter === 'bestsellers') {
      if (!perfume.bestSeller) return false;
    } else if (activeCategoryFilter !== 'all') {
      if (perfume.category !== activeCategoryFilter) return false;
    }

    // 2. Ingredient tag filter
    if (activeIngredientFilter && !perfume.ingredients.includes(activeIngredientFilter)) {
      return false;
    }

    // 3. Search query check
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      const matchName = perfume.name.toLowerCase().includes(lower);
      const matchCat = perfume.category.toLowerCase().includes(lower);
      const matchDesc = perfume.description.toLowerCase().includes(lower);
      const matchNotes = [
        ...perfume.notes.top,
        ...perfume.notes.heart,
        ...perfume.notes.base,
      ].some((note) => note.toLowerCase().includes(lower));

      return matchName || matchCat || matchDesc || matchNotes;
    }

    return true;
  });

  // 7. Cart & Checkout Handlers
  const handleAddToCart = (product: Perfume, qty = 1, size: PerfumeSize = '100ml') => {
    const itemPrice = product.sizes?.[size] ?? product.price;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && (item.selectedSize || '100ml') === size
      );
      if (existingIdx > -1) {
        return prevCart.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prevCart,
        {
          product,
          quantity: qty,
          selectedSize: size,
          itemPrice,
        },
      ];
    });

    setAuthNotification(`Added ${qty} × ${product.name} (${size}) to your Shopping Bag`);
    setTimeout(() => setAuthNotification(null), 3500);
  };

  const handleBuyNow = (product: Perfume, qty = 1, size: PerfumeSize = '100ml') => {
    handleAddToCart(product, qty, size);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQty = (pId: string, newQty: number, size?: string) => {
    if (newQty <= 0) {
      handleRemoveCartItem(pId, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === pId && (item.selectedSize || '100ml') === (size || '100ml')
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (pId: string, size?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.product.id === pId && (item.selectedSize || '100ml') === (size || '100ml'))
      )
    );
  };

  const handleCartToCheckout = (discountAmount: number, activeCoupon: string) => {
    setCheckoutDiscount(discountAmount);
    setCheckoutCoupon(activeCoupon);
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setConfirmedOrder(newOrder);
    setCart([]);
    localStorage.removeItem('rana_cart');
    setActiveView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 8. Wishlist Toggle Handler
  const handleToggleWishlist = (product: Perfume) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        setAuthNotification(`Removed ${product.name} from Wishlist`);
        setTimeout(() => setAuthNotification(null), 3000);
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      setAuthNotification(`Saved ${product.name} to Wishlist`);
      setTimeout(() => setAuthNotification(null), 3000);
      return [...prevWishlist, product];
    });
  };

  // 9. Authentication Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveView('home');
    setAuthNotification(`Welcome back, ${user.name}`);
    setTimeout(() => setAuthNotification(null), 4000);
  };

  const handleSignupSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveView('home');
    setAuthNotification(`Welcome to RANA Luxury Circle, ${user.name}`);
    setTimeout(() => setAuthNotification(null), 4000);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setAuthNotification('You have successfully logged out');
    setTimeout(() => setAuthNotification(null), 3000);
  };

  // 10. Navigation Handler
  const handleNavClick = (section: string) => {
    if (section === 'home') {
      setActiveView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (section === 'admin') {
      setActiveView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (section === 'tracking') {
      setActiveView('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (section === 'about') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    if (section === 'contact') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById('site-footer');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }

    if (activeView !== 'home') {
      setActiveView('home');
    }

    setTimeout(() => {
      if (section === 'mens-collection') {
        setActiveCategoryFilter('Men');
        const cat = document.getElementById('catalog');
        if (cat) cat.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (section === 'womens-collection') {
        setActiveCategoryFilter('Women');
        const cat = document.getElementById('catalog');
        if (cat) cat.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (section === 'unisex-collection') {
        setActiveCategoryFilter('Unisex');
        const cat = document.getElementById('catalog');
        if (cat) cat.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (section === 'oud-collection') {
        setActiveCategoryFilter('Oud');
        const cat = document.getElementById('catalog');
        if (cat) cat.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (section === 'premium-collection') {
        setActiveCategoryFilter('Premium');
        const cat = document.getElementById('catalog');
        if (cat) cat.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (section === 'gift-sets') {
        setActiveCategoryFilter('Gift Sets');
        const cat = document.getElementById('catalog');
        if (cat) cat.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (section === 'collections') {
        const coll = document.getElementById('collections');
        if (coll) coll.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (section === 'bestsellers') {
        const bestEl = document.getElementById('bestsellers');
        if (bestEl) bestEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const handleShopCollectionCategory = (cat: PerfumeCategory) => {
    setActiveCategoryFilter(cat);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectFragranceFamily = (familyKey: string) => {
    if (familyKey === 'Oud') setActiveCategoryFilter('Oud');
    else if (familyKey === 'Unisex') setActiveCategoryFilter('Unisex');
    else {
      setActiveCategoryFilter('all');
      setSearchQuery(familyKey);
    }
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-[#0B1B13] text-[#F7F5EE] min-h-screen font-sans selection:bg-[#274233] selection:text-[#FAF8F2]">
      {/* 1. Introductory cinematic splash animation */}
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* Main applet content */}
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen"
        >
          {/* RENDER LOGIN PAGE */}
          {activeView === 'login' ? (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateSignup={() => {
                setActiveView('signup');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : activeView === 'signup' ? (
            /* RENDER SIGNUP PAGE */
            <SignupPage
              onSignupSuccess={handleSignupSuccess}
              onNavigateLogin={() => {
                setActiveView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : activeView === 'checkout' ? (
            /* RENDER FULL CHECKOUT PAGE */
            <CheckoutPage
              cartItems={cart}
              currentUser={currentUser}
              initialDiscountAmount={checkoutDiscount}
              initialCouponCode={checkoutCoupon}
              onBackToStore={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOrderPlaced={handleOrderPlaced}
            />
          ) : activeView === 'confirmation' && confirmedOrder ? (
            /* RENDER ORDER CONFIRMATION PAGE */
            <OrderConfirmationPage
              order={confirmedOrder}
              onContinueShopping={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewMyOrders={() => {
                setActiveView('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : activeView === 'orders' ? (
            /* RENDER ORDER HISTORY PAGE */
            <OrderHistoryPage
              onBackToStore={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectOrder={(selectedOrder) => {
                setConfirmedOrder(selectedOrder);
                setActiveView('confirmation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTrackOrder={(oId) => {
                setTrackingOrderId(oId);
                setActiveView('tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : activeView === 'tracking' ? (
            /* RENDER ORDER TRACKING PAGE */
            <OrderTrackingPage
              initialOrderId={trackingOrderId}
              onBackToStore={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewMyOrders={() => {
                setActiveView('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : activeView === 'admin' ? (
            /* RENDER ADMIN DASHBOARD */
            <AdminDashboard
              onBackToStore={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={() => {
                setActiveView('home');
                setAuthNotification('Administrator session terminated successfully.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : activeView === 'about' ? (
            /* RENDER ABOUT US PAGE */
            <AboutPage
              onBackToStore={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreCatalog={() => {
                setActiveView('home');
                setTimeout(() => {
                  const cat = document.getElementById('catalog');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
          ) : (
            /* RENDER MAIN STOREFRONT HOME PAGE */
            <div className="relative min-h-screen">
              {/* Notification Banner */}
              <AnimatePresence>
                {authNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 right-4 z-50 rounded-2xl bg-[#0D263D] text-[#EAF4F8] border border-[#BFD9E8] px-5 py-3 shadow-2xl font-mono text-xs flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#BFD9E8]" />
                    <span>{authNotification}</span>
                    <button
                      onClick={() => setAuthNotification(null)}
                      className="ml-2 text-[#BFD9E8]/70 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1. STICKY LUXURY HEADER: RANA LUXURY PERFUME */}
              <Navbar
                cartCount={totalCartCount}
                wishlistCount={wishlist.length}
                currentUser={currentUser}
                onLoginClick={() => {
                  setActiveView('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSignupClick={() => {
                  setActiveView('signup');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOrdersClick={() => {
                  setActiveView('orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLogoutClick={handleLogout}
                onCartClick={() => setIsCartOpen(true)}
                onWishlistClick={() => {
                  setActiveCategoryFilter('all');
                  const catalogElement = document.getElementById('catalog');
                  if (catalogElement) catalogElement.scrollIntoView({ behavior: 'smooth' });
                }}
                onNavClick={handleNavClick}
                onOpenAIAssistant={() => setIsAiAssistantOpen(true)}
                onSearch={(q) => setSearchQuery(q)}
                searchQuery={searchQuery}
                allPerfumes={allPerfumes}
                onSelectProduct={(p) => setSelectedPerfume(p)}
              />

              {/* 2. EDITORIAL HERO CAMPAIGN */}
              <Hero
                onExploreClick={() => {
                  const coll = document.getElementById('collection-story');
                  if (coll) coll.scrollIntoView({ behavior: 'smooth' });
                }}
                onShopNowClick={() => {
                  const cat = document.getElementById('catalog');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }}
                onQuickView={(p) => setSelectedPerfume(p)}
                onAddToCart={(p) => handleAddToCart(p, 1, '100ml')}
              />

              {/* 3. SIGNATURE FRAGRANCE EDITORIAL FEATURE */}
              <SignatureFragrance
                perfumes={allPerfumes}
                onQuickView={(p) => setSelectedPerfume(p)}
                onAddToCart={(p, qty, size) => handleAddToCart(p, qty, size)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={selectedPerfume ? wishlist.some((w) => w.id === selectedPerfume.id) : false}
              />

              {/* 4. THE SEVEN LUXURY COLLECTIONS STORY */}
              <CollectionStory
                onSelectCategory={(cat) => {
                  if (cat === 'all') {
                    setActiveCategoryFilter('all');
                  } else {
                    setActiveCategoryFilter(cat as any);
                  }
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* 5. SECTION 3: BESTSELLERS */}
              <BestsellersSection
                perfumes={allPerfumes}
                onAddToCart={(p, qty, size) => handleAddToCart(p, qty, size)}
                onBuyNow={(p, qty, size) => handleBuyNow(p, qty, size)}
                onQuickView={(p) => setSelectedPerfume(p)}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />

              {/* 6. SECTION 4: NEW ARRIVALS */}
              <NewArrivalsSection
                perfumes={allPerfumes}
                onQuickView={(p) => setSelectedPerfume(p)}
                onAddToCart={(p, qty, size) => handleAddToCart(p, qty, size)}
                onExploreCatalog={() => {
                  const cat = document.getElementById('catalog');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* 7. SECTION 5: THE ART OF FRAGRANCE & TRUST PILLARS */}
              <AboutSection />

              {/* 8. SECTION 6: NOBLE RAW MATERIALS & FRAGRANCE NOTES */}
              <IngredientsSection
                onFindPerfumeWithIngredient={(ing) => {
                  setActiveIngredientFilter(ing);
                  setActiveCategoryFilter('all');
                  const cat = document.getElementById('catalog');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* 9. FRAGRANCE DISCOVERY INTERACTIVE SCENT FINDER */}
              <FragranceDiscovery
                perfumes={allPerfumes}
                onQuickView={(p) => setSelectedPerfume(p)}
                onAddToCart={(p, qty, size) => handleAddToCart(p, qty, size)}
              />

              {/* 10. VERIFIED PATRON REVIEWS */}
              <ReviewsSection />

              {/* 11. COMPLETE ARCHIVE CATALOG & LIVE SEARCH */}
              <section
                id="catalog"
                className="py-24 lg:py-32 bg-[#050505] border-b border-[#181818] relative text-[#F5F5F5]"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                  {/* Section Title */}
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="w-6 h-[1px] bg-white/60" />
                      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#888888] font-medium">
                        COMPLETE ATELIER ARCHIVE
                      </span>
                      <span className="w-6 h-[1px] bg-white/60" />
                    </div>
                    <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.03em] text-white mb-3">
                      Fragrance Catalog
                    </h2>
                    <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] max-w-lg mx-auto font-light leading-relaxed">
                      Hand-blended with 35% pure extrait concentration. Available in 20ml travel atomizers, 50ml flacons, and 100ml grand extraits.
                    </p>
                  </div>

                  {/* Filter and Search Bar Controls */}
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-12 p-3 bg-[#0B0B0B] border border-[#1E1E1E]">
                    {/* Category Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {[
                        { id: 'all', label: 'All Scents' },
                        { id: 'Men', label: "Men's" },
                        { id: 'Women', label: "Women's" },
                        { id: 'Unisex', label: 'Unisex' },
                        { id: 'Oud', label: 'Oud' },
                        { id: 'Premium', label: 'Signature' },
                        { id: 'Gift Sets', label: 'Gift Sets' },
                        { id: 'bestsellers', label: 'Best Sellers' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveCategoryFilter(tab.id as any)}
                          className={`px-3.5 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            activeCategoryFilter === tab.id
                              ? 'bg-white text-black font-semibold'
                              : 'bg-[#111111] text-[#888888] hover:text-white border border-[#222222]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Search Input Box */}
                    <div className="relative w-full lg:max-w-xs">
                      <input
                        type="text"
                        placeholder="Filter by scent, notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 pl-9 bg-[#111111] border border-[#222222] text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#555555]"
                      />
                      <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Ingredient Filter Badge */}
                  {activeIngredientFilter && (
                    <div className="mb-8 flex items-center justify-between px-4 py-2 bg-[#111111] border border-[#242424] max-w-md font-mono text-xs">
                      <span className="text-[#A3A3A3]">
                        Showing note: <strong className="text-white">{activeIngredientFilter}</strong>
                      </span>
                      <button
                        onClick={() => setActiveIngredientFilter(null)}
                        className="p-1 text-[#777777] hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Empty State */}
                  {filteredPerfumes.length === 0 ? (
                    <div className="py-20 text-center space-y-4 bg-[#0A0A0A] border border-[#1A1A1A]">
                      <SlidersHorizontal className="w-8 h-8 mx-auto text-[#555555]" />
                      <h3 className="font-serif text-2xl text-white font-light">No Fragrances Found</h3>
                      <p className="font-sans text-xs text-[#888888]">
                        Try adjusting your search query or selecting a different category.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveIngredientFilter(null);
                          setActiveCategoryFilter('all');
                        }}
                        className="py-2.5 px-6 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    /* PRODUCT GRID SHELF WITH EXACT PRODUCT MAPPING */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredPerfumes.map((perfume) => (
                        <ProductCard
                          key={perfume.id}
                          product={perfume}
                          onAddToCart={(p, qty, size) => handleAddToCart(p, qty, size)}
                          onBuyNow={(p, qty, size) => handleBuyNow(p, qty, size)}
                          onQuickView={(p) => setSelectedPerfume(p)}
                          onToggleWishlist={handleToggleWishlist}
                          isWishlisted={wishlist.some((w) => w.id === perfume.id)}
                          theme="dark"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* 12. FINAL EDITORIAL CTA */}
              <FinalCTA
                onExploreClick={() => {
                  const cat = document.getElementById('catalog');
                  if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                }}
                onDiscoverClick={() => {
                  const disc = document.getElementById('discovery');
                  if (disc) disc.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* 13. LUXURY FOOTER */}
              <Footer
                onNavClick={handleNavClick}
                onPolicyClick={setActivePolicy}
                onOpenAIAssistant={() => setIsAiAssistantOpen(true)}
                onAdminLoginClick={() => setIsAdminLoginModalOpen(true)}
              />
            </div>
          )}

          {/* FLOATING CONCIERGE CHATBOT */}
          <AIFragranceAssistant
            isOpenExternal={isAiAssistantOpen}
            onCloseExternal={() => setIsAiAssistantOpen(false)}
            onSelectProduct={(product) => setSelectedPerfume(product)}
            onAddToCart={(product) => handleAddToCart(product)}
          />

          {/* BACK TO TOP BUTTON */}
          <BackToTop />

          {/* SLIDING SHOPPING BAG DRAWER */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handleCartToCheckout}
            onAddRecommended={(rec) => handleAddToCart(rec, 1, '100ml')}
          />

          {/* QUICK VIEW & INSPECT MODAL WITH EXACT PRODUCT MAPPING */}
          <QuickViewModal
            product={selectedPerfume}
            onClose={() => setSelectedPerfume(null)}
            onAddToCart={(p, qty, size) => handleAddToCart(p, qty, size)}
            onBuyNow={(p, qty, size) => handleBuyNow(p, qty, size)}
            isWishlisted={
              selectedPerfume ? wishlist.some((w) => w.id === selectedPerfume.id) : false
            }
            onToggleWishlist={handleToggleWishlist}
            onSelectComplementary={(comp) => setSelectedPerfume(comp)}
          />

          {/* LEGAL POLICIES MODAL */}
          <PolicyModal
            policyName={activePolicy}
            onClose={() => setActivePolicy(null)}
          />

          {/* SECURE ADMIN LOGIN MODAL */}
          <AdminLoginModal
            isOpen={isAdminLoginModalOpen}
            onClose={() => setIsAdminLoginModalOpen(false)}
            onLoginSuccess={() => {
              setIsAdminLoginModalOpen(false);
              setActiveView('admin');
              setAuthNotification('Administrator session active. Welcome to Atelier Management.');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
