/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  User as UserIcon,
  ShoppingBag,
  Heart,
  Menu,
  X,
  LogOut,
  Package,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Perfume } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onOrdersClick?: () => void;
  onNavClick: (section: string) => void;
  onOpenAIAssistant?: () => void;
  wishlistCount: number;
  currentUser?: User | null;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onLogoutClick?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  allPerfumes?: Perfume[];
  onSelectProduct?: (perfume: Perfume) => void;
}

export default function Navbar({
  cartCount,
  onCartClick,
  onWishlistClick,
  onOrdersClick,
  onNavClick,
  wishlistCount,
  currentUser,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onSearch,
  searchQuery = '',
  allPerfumes = [],
  onSelectProduct,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState(searchQuery);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Smooth scroll listener for transparent-to-dark transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleClearSearch = () => {
    setInternalQuery('');
    if (onSearch) {
      onSearch('');
    }
    setIsSearchOpen(false);
  };

  const searchSuggestions =
    internalQuery.trim().length > 1
      ? allPerfumes
          .filter(
            (p) =>
              p.name.toLowerCase().includes(internalQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(internalQuery.toLowerCase()) ||
              p.notes.top.some((n) => n.toLowerCase().includes(internalQuery.toLowerCase())) ||
              p.notes.heart.some((n) => n.toLowerCase().includes(internalQuery.toLowerCase())) ||
              p.notes.base.some((n) => n.toLowerCase().includes(internalQuery.toLowerCase()))
          )
          .slice(0, 5)
      : [];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 select-none transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-[#202020] shadow-2xl shadow-black/80'
          : 'bg-[#050505]/40 backdrop-blur-md border-b border-white/[0.06]'
      }`}
    >
      {/* 1. Header Navigation Bar */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* ======================================================== */}
        {/* LEFT: RANA LOGO & MONOGRAM                               */}
        {/* ======================================================== */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onNavClick('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            aria-label="RANA Luxury Perfumes Homepage"
          >
            {/* Elegant R Monogram Badge */}
            <span className="w-8 h-8 rounded-none border border-white/60 flex items-center justify-center font-serif text-base font-bold text-white group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
              R
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.25em] text-[#FFFFFF] group-hover:text-white transition-colors">
                RANA
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-[#A3A3A3] -mt-1 font-light">
                LUXURY PERFUMES
              </span>
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* CENTER/MAIN NAVIGATION: Home · About · Products · Collections */}
        {/* ======================================================== */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[11px] font-mono uppercase tracking-[0.24em] font-medium text-[#D4D4D4]">
          <button
            onClick={() => {
              onNavClick('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer py-1 relative group"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
          </button>

          <button
            onClick={() => onNavClick('about')}
            className="hover:text-white transition-colors cursor-pointer py-1 relative group"
          >
            <span>About</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
          </button>

          <button
            onClick={() => onNavClick('catalog')}
            className="hover:text-white transition-colors cursor-pointer py-1 relative group"
          >
            <span>Products</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
          </button>

          {/* COLLECTIONS DROPDOWN */}
          <div
            className="relative py-1"
            onMouseEnter={() => setIsCollectionsHovered(true)}
            onMouseLeave={() => setIsCollectionsHovered(false)}
          >
            <button
              onClick={() => onNavClick('collections')}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
            >
              <span>Collections</span>
              <ChevronDown className="w-3 h-3 text-[#888888] group-hover:rotate-180 transition-transform duration-200" />
            </button>

            <AnimatePresence>
              {isCollectionsHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full -left-6 w-64 bg-[#0E0E0E] border border-[#242424] shadow-2xl py-3 px-2 z-50"
                >
                  <button
                    onClick={() => {
                      onNavClick('mens-collection');
                      setIsCollectionsHovered(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    RANA Men
                  </button>
                  <button
                    onClick={() => {
                      onNavClick('womens-collection');
                      setIsCollectionsHovered(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    RANA Women
                  </button>
                  <button
                    onClick={() => {
                      onNavClick('unisex-collection');
                      setIsCollectionsHovered(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    RANA Unisex
                  </button>
                  <button
                    onClick={() => {
                      onNavClick('oud-collection');
                      setIsCollectionsHovered(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    Oud Collection
                  </button>
                  <button
                    onClick={() => {
                      onNavClick('premium-collection');
                      setIsCollectionsHovered(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    Signature Élixirs
                  </button>
                  <button
                    onClick={() => {
                      onNavClick('limited-collection');
                      setIsCollectionsHovered(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] transition-colors border-t border-[#202020] mt-1 pt-2"
                  >
                    Limited Editions
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ======================================================== */}
        {/* RIGHT: Search · Account · Wishlist · Shopping Bag · Menu */}
        {/* ======================================================== */}
        <div className="flex items-center gap-3 sm:gap-5 text-[#CCCCCC]">
          
          {/* SEARCH BUTTON */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1.5 hover:text-white transition-colors cursor-pointer relative"
            aria-label="Search Fragrances"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* ACCOUNT BUTTON & POPOVER */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="p-1.5 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="User Account"
            >
              <UserIcon className="w-4 h-4" />
              {currentUser && (
                <span className="hidden xl:inline font-mono text-[10px] uppercase tracking-wider text-white">
                  {currentUser.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Account Popover Menu */}
            <AnimatePresence>
              {isAccountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-56 bg-[#0E0E0E] border border-[#242424] shadow-2xl py-3 px-2 z-50"
                >
                  {currentUser ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 border-b border-[#202020] mb-2">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-[#777777]">
                          Signed In As
                        </p>
                        <p className="font-serif text-sm font-medium text-white truncate">
                          {currentUser.name}
                        </p>
                        <p className="font-mono text-[10px] text-[#888888] truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          if (onOrdersClick) onOrdersClick();
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5" />
                        My Order History
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsAccountOpen(false);
                            onNavClick('admin');
                          }}
                          className="w-full text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Maison Admin
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          if (onLogoutClick) onLogoutClick();
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 hover:text-red-300 hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors border-t border-[#202020] mt-1 pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="px-3 py-2 border-b border-[#202020] mb-2">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-[#777777]">
                          Client Portal
                        </p>
                        <p className="font-serif text-xs text-white">
                          Access your saved collection & orders
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          if (onLoginClick) onLoginClick();
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white bg-[#1A1A1A] hover:bg-[#252525] transition-colors"
                      >
                        Sign In
                      </button>

                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          if (onSignupClick) onSignupClick();
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WISHLIST BUTTON */}
          <button
            onClick={onWishlistClick}
            className="p-1.5 hover:text-white transition-colors cursor-pointer relative"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-white text-black font-mono text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* SHOPPING BAG BUTTON */}
          <button
            onClick={onCartClick}
            className="p-1.5 hover:text-white transition-colors cursor-pointer relative flex items-center gap-1"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-black font-mono text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 hover:text-white transition-colors cursor-pointer ml-1"
            aria-label="Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. EXPANDABLE SEARCH OVERLAY BAR                         */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#202020] bg-[#0E0E0E] px-4 py-4 sm:px-8 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-[#777777]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={internalQuery}
                  onChange={handleSearchChange}
                  placeholder="Search fragrances, olfactive families, notes (e.g., Bergamot, Oud, Noir)..."
                  className="w-full bg-[#161616] border border-[#2B2B2B] text-white text-xs sm:text-sm pl-11 pr-10 py-3 rounded-none focus:outline-hidden focus:border-white font-mono placeholder:text-[#555555]"
                />
                {internalQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 p-1 text-[#888888] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Instant Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="mt-2 bg-[#121212] border border-[#242424] divide-y divide-[#1F1F1F]">
                  {searchSuggestions.map((item) => (
                    <button
                      key={'sugg-' + item.id}
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(item);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-[#1A1A1A] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-contain bg-[#050505] p-1 border border-[#242424]"
                        />
                        <div>
                          <p className="font-serif text-xs text-white font-medium">{item.name}</p>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#888888]">
                            {item.category} · {item.notes.top.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#E5E5E5] font-semibold">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 3. MOBILE SLIDEOUT NAVIGATION DRAWER                     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-y-0 left-0 w-80 bg-[#0B0B0B] border-r border-[#202020] p-6 z-50 flex flex-col justify-between shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#202020]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 border border-white flex items-center justify-center font-serif text-sm font-bold text-white">
                    R
                  </span>
                  <span className="font-serif text-base font-bold tracking-[0.2em] text-white">
                    RANA
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#888888] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 font-mono text-xs uppercase tracking-[0.25em]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavClick('home');
                  }}
                  className="block text-left text-[#CCCCCC] hover:text-white"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavClick('about');
                  }}
                  className="block text-left text-[#CCCCCC] hover:text-white"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavClick('catalog');
                  }}
                  className="block text-left text-[#CCCCCC] hover:text-white"
                >
                  Products
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavClick('collections');
                  }}
                  className="block text-left text-[#CCCCCC] hover:text-white"
                >
                  Collections
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavClick('mens-collection');
                  }}
                  className="block text-left text-[#777777] pl-3 hover:text-white"
                >
                  — Men
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavClick('womens-collection');
                  }}
                  className="block text-left text-[#777777] pl-3 hover:text-white"
                >
                  — Women
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavClick('oud-collection');
                  }}
                  className="block text-left text-[#777777] pl-3 hover:text-white"
                >
                  — Oud
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#202020] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onWishlistClick) onWishlistClick();
                }}
                className="w-full py-2.5 px-3 border border-[#333333] text-left text-xs font-mono uppercase tracking-[0.2em] text-[#CCCCCC] flex items-center justify-between"
              >
                <span>Wishlist</span>
                <span>({wishlistCount})</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onCartClick) onCartClick();
                }}
                className="w-full py-2.5 px-3 bg-white text-black text-center text-xs font-mono uppercase tracking-[0.2em] font-semibold"
              >
                Shopping Bag ({cartCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
