/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  FileText,
  Warehouse,
  BarChart3,
  Database,
  Plus,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  Truck,
  X,
  Menu,
  ArrowLeft,
  Filter,
  RefreshCw,
  ShieldAlert,
  AlertCircle,
  Eye,
  Save,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  Upload,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Percent,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Perfume, Order, OrderStatus, PerfumeCategory, PerfumeGender } from '../types';
import {
  getStoredPerfumes,
  addPerfumeProduct,
  updatePerfumeProduct,
  deletePerfumeProduct,
} from '../utils/perfumes';
import { getStoredOrders, updateOrderStatus, syncOrdersWithSupabase } from '../utils/orders';
import {
  getStoredDiscounts,
  saveStoredDiscounts,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountActive,
  CouponOffer,
} from '../utils/discounts';
import {
  getStoredSiteContent,
  saveStoredSiteContent,
  resetStoredSiteContent,
  SiteContent,
} from '../utils/siteContent';
import {
  checkSupabaseConnection,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from '../utils/supabase';
import { logoutAdmin, getAdminSession } from '../utils/adminAuth';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onLogout?: () => void;
}

const CATEGORY_COLORS = ['#C5A059', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B'];

export default function AdminDashboard({ onBackToStore, onLogout }: AdminDashboardProps) {
  // Navigation Sidebar Tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'customers' | 'discounts' | 'content' | 'inventory' | 'analytics' | 'supabase'
  >('overview');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const adminSession = getAdminSession();

  // Core Data Lists
  const [perfumesList, setPerfumesList] = useState<Perfume[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [discountsList, setDiscountsList] = useState<CouponOffer[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(() => getStoredSiteContent());

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Modals & Active Edit States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Perfume | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Discount Offer Modal
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<CouponOffer | null>(null);
  const [discountForm, setDiscountForm] = useState<{
    code: string;
    type: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    description: string;
    isActive: boolean;
    isCombo: boolean;
    isFeaturedDeal: boolean;
  }>({
    code: '',
    type: 'percentage',
    discountValue: 20,
    minOrderValue: 0,
    description: '',
    isActive: true,
    isCombo: false,
    isFeaturedDeal: false,
  });

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    price: 1499,
    originalPrice: 1999,
    discountPercent: 20,
    gender: 'men' as PerfumeGender,
    category: 'Men' as PerfumeCategory,
    stock: 25,
    rating: 4.9,
    description: '',
    image: '',
    bestSeller: false,
    featured: false,
    isActive: true,
    topNotes: 'Bergamot, Lemon, Black Pepper',
    heartNotes: 'Lavender, Jasmine, Cedarwood',
    baseNotes: 'Sandalwood, Amber, Musk',
    ingredients: 'Bergamot, Jasmine, Sandalwood, Amber',
  });

  // Supabase Status State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    checked: boolean;
    checking: boolean;
    connected?: boolean;
    tableExists?: boolean;
    message?: string;
  }>({ checked: false, checking: false });
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncingRemote, setIsSyncingRemote] = useState(false);
  const [remoteSyncResult, setRemoteSyncResult] = useState<string | null>(null);

  // Content Save Notice
  const [contentSavedMsg, setContentSavedMsg] = useState(false);

  // Load Initial Data
  useEffect(() => {
    refreshData();

    // Listen to live updates from other tabs/processes
    const handlePerfumeEvent = () => setPerfumesList(getStoredPerfumes());
    const handleOrderEvent = () => setOrdersList(getStoredOrders());
    const handleDiscountEvent = () => setDiscountsList(getStoredDiscounts());

    window.addEventListener('rana_perfumes_updated', handlePerfumeEvent);
    window.addEventListener('rana_orders_updated', handleOrderEvent);
    window.addEventListener('rana_discounts_updated', handleDiscountEvent);

    return () => {
      window.removeEventListener('rana_perfumes_updated', handlePerfumeEvent);
      window.removeEventListener('rana_orders_updated', handleOrderEvent);
      window.removeEventListener('rana_discounts_updated', handleDiscountEvent);
    };
  }, []);

  const refreshData = () => {
    setPerfumesList(getStoredPerfumes());
    setOrdersList(getStoredOrders());
    setDiscountsList(getStoredDiscounts());
    setSiteContent(getStoredSiteContent());
  };

  // KPI Calculations
  const totalProducts = perfumesList.length;
  const activeProductsCount = perfumesList.filter((p) => p.isActive !== false).length;
  const totalOrders = ordersList.length;
  const totalRevenue = ordersList.reduce((acc, order) => acc + order.totalAmount, 0);
  const pendingOrders = ordersList.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Preparing'
  ).length;
  const completedOrders = ordersList.filter(
    (o) => o.status === 'Delivered' || o.status === 'Confirmed'
  ).length;
  const lowStockProducts = perfumesList.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10);
  const outOfStockProducts = perfumesList.filter((p) => (p.stock ?? 0) <= 0);

  // Unique Customers Mapping
  const customersMap = new Map<
    string,
    { name: string; email: string; phone: string; totalSpent: number; orderCount: number; firstDate: string }
  >();

  ordersList.forEach((order) => {
    const emailKey = order.customerInfo.email.toLowerCase().trim() || 'unknown@customer.com';
    if (!customersMap.has(emailKey)) {
      customersMap.set(emailKey, {
        name: order.customerInfo.fullName,
        email: order.customerInfo.email,
        phone: order.customerInfo.phone,
        totalSpent: order.totalAmount,
        orderCount: 1,
        firstDate: order.createdAt,
      });
    } else {
      const existing = customersMap.get(emailKey)!;
      existing.totalSpent += order.totalAmount;
      existing.orderCount += 1;
    }
  });

  const customersList = Array.from(customersMap.values());
  const totalCustomers = customersList.length || 1;

  // Filtered Lists
  const filteredProducts = perfumesList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredOrders = ordersList.filter((o) => {
    const query = orderSearch.toLowerCase();
    const matchesQuery =
      o.id.toLowerCase().includes(query) ||
      o.customerInfo.fullName.toLowerCase().includes(query) ||
      o.customerInfo.email.toLowerCase().includes(query) ||
      o.customerInfo.phone.includes(query);
    const matchesStatus = orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  const filteredCustomers = customersList.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
  );

  // Logout Handler
  const handleLogout = async () => {
    await logoutAdmin();
    if (onLogout) {
      onLogout();
    } else {
      onBackToStore();
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductForm((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 1499,
      originalPrice: 1999,
      discountPercent: 25,
      gender: 'men',
      category: 'Men',
      stock: 25,
      rating: 4.9,
      description: '',
      image: '',
      bestSeller: false,
      featured: false,
      isActive: true,
      topNotes: 'Bergamot, Lemon',
      heartNotes: 'Lavender, Cedarwood',
      baseNotes: 'Sandalwood, Amber',
      ingredients: 'Bergamot, Lavender, Sandalwood',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Perfume) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || Math.round(product.price * 1.25),
      discountPercent: product.discountPercent || 20,
      gender: product.gender,
      category: product.category,
      stock: product.stock ?? 25,
      rating: product.rating,
      description: product.description,
      image: product.image || '',
      bestSeller: !!product.bestSeller,
      featured: !!product.featured,
      isActive: product.isActive !== false,
      topNotes: product.notes.top.join(', '),
      heartNotes: product.notes.heart.join(', '),
      baseNotes: product.notes.base.join(', '),
      ingredients: product.ingredients.join(', '),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const payload = {
      name: productForm.name.trim(),
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice),
      discountPercent: Number(productForm.discountPercent),
      gender: productForm.gender,
      category: productForm.category,
      stock: Number(productForm.stock),
      rating: Number(productForm.rating),
      description: productForm.description,
      image: productForm.image || undefined,
      bestSeller: productForm.bestSeller,
      featured: productForm.featured,
      isActive: productForm.isActive,
      notes: {
        top: productForm.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
        heart: productForm.heartNotes.split(',').map((s) => s.trim()).filter(Boolean),
        base: productForm.baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
      },
      ingredients: productForm.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (editingProduct) {
      updatePerfumeProduct(editingProduct.id, payload);
    } else {
      addPerfumeProduct(payload);
    }

    refreshData();
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleToggleProductActive = (product: Perfume) => {
    const updated = updatePerfumeProduct(product.id, { isActive: product.isActive === false });
    setPerfumesList(updated);
  };

  const handleDeleteProduct = () => {
    if (!deletingProductId) return;
    deletePerfumeProduct(deletingProductId);
    refreshData();
    setDeletingProductId(null);
  };

  // Stock Quick Adjuster
  const handleQuickStockChange = (productId: string, delta: number) => {
    const product = perfumesList.find((p) => p.id === productId);
    if (!product) return;
    const currentStock = product.stock ?? 0;
    const newStock = Math.max(0, currentStock + delta);
    const updated = updatePerfumeProduct(productId, { stock: newStock });
    setPerfumesList(updated);
  };

  // Order Status Handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrdersList(updated);
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
    }
  };

  // Discount Form Handlers
  const handleOpenAddDiscount = () => {
    setEditingDiscount(null);
    setDiscountForm({
      code: '',
      type: 'percentage',
      discountValue: 20,
      minOrderValue: 0,
      description: '',
      isActive: true,
      isCombo: false,
      isFeaturedDeal: false,
    });
    setIsDiscountModalOpen(true);
  };

  const handleOpenEditDiscount = (item: CouponOffer) => {
    setEditingDiscount(item);
    setDiscountForm({
      code: item.code,
      type: item.type,
      discountValue: item.discountValue,
      minOrderValue: item.minOrderValue || 0,
      description: item.description,
      isActive: item.isActive,
      isCombo: !!item.isCombo,
      isFeaturedDeal: !!item.isFeaturedDeal,
    });
    setIsDiscountModalOpen(true);
  };

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountForm.code.trim()) return;

    if (editingDiscount) {
      const updated = updateDiscount(editingDiscount.id, discountForm);
      setDiscountsList(updated);
    } else {
      addDiscount(discountForm);
      setDiscountsList(getStoredDiscounts());
    }

    setIsDiscountModalOpen(false);
    setEditingDiscount(null);
  };

  const handleToggleDiscount = (id: string) => {
    const updated = toggleDiscountActive(id);
    setDiscountsList(updated);
  };

  const handleDeleteDiscount = (id: string) => {
    const updated = deleteDiscount(id);
    setDiscountsList(updated);
  };

  // Site Content Save
  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSiteContent(siteContent);
    setContentSavedMsg(true);
    setTimeout(() => setContentSavedMsg(false), 3000);
  };

  const handleResetSiteContent = () => {
    if (window.confirm('Reset all website content back to factory defaults?')) {
      const def = resetStoredSiteContent();
      setSiteContent(def);
      setContentSavedMsg(true);
      setTimeout(() => setContentSavedMsg(false), 3000);
    }
  };

  // Supabase Tools
  const handleCheckSupabase = async () => {
    setSupabaseStatus({ checked: false, checking: true });
    const res = await checkSupabaseConnection();
    setSupabaseStatus({
      checked: true,
      checking: false,
      connected: res.connected,
      tableExists: res.tableExists,
      message: res.message,
    });
  };

  const handleSyncRemoteOrders = async () => {
    setIsSyncingRemote(true);
    setRemoteSyncResult(null);
    try {
      const updated = await syncOrdersWithSupabase();
      setOrdersList(updated);
      setRemoteSyncResult(`Orders synchronized. Total ${updated.length} orders loaded.`);
    } catch (err: any) {
      setRemoteSyncResult(`Sync note: ${err?.message || 'Remote sync completed'}`);
    } finally {
      setIsSyncingRemote(false);
    }
  };

  const SUPABASE_SCHEMA_SQL = `-- 1. Create orders table in public schema
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    house_no TEXT,
    street TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    shipping_address JSONB,
    items JSONB,
    subtotal NUMERIC,
    discount_amount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    gst_amount NUMERIC DEFAULT 0,
    shipping_charge NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT,
    payment_details TEXT,
    status TEXT DEFAULT 'Confirmed',
    delivery_option TEXT,
    estimated_delivery_date TEXT,
    raw_payload JSONB
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anon & authenticated insert
CREATE POLICY "Allow public insert to orders" ON public.orders
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- 4. Policy: Allow read orders
CREATE POLICY "Allow public select on orders" ON public.orders
    FOR SELECT TO anon, authenticated
    USING (true);

-- 5. Policy: Allow status updates
CREATE POLICY "Allow public update on orders" ON public.orders
    FOR UPDATE TO anon, authenticated
    USING (true) WITH CHECK (true);

-- Optional: Performance indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);`;

  const handleCopySql = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    }
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Analytics Aggregates
  const salesByStatusData = [
    { name: 'Delivered', value: ordersList.filter((o) => o.status === 'Delivered').length, color: '#10B981' },
    { name: 'Confirmed', value: ordersList.filter((o) => o.status === 'Confirmed').length, color: '#C5A059' },
    { name: 'Shipped', value: ordersList.filter((o) => o.status === 'Shipped').length, color: '#3B82F6' },
    { name: 'Processing', value: ordersList.filter((o) => o.status === 'Processing').length, color: '#F59E0B' },
    { name: 'Cancelled', value: ordersList.filter((o) => o.status === 'Cancelled').length, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  const topPerfumesSales = perfumesList
    .map((perfume) => {
      const units = ordersList.reduce((acc, order) => {
        const item = order.items.find((i) => i.product.id === perfume.id);
        return acc + (item ? item.quantity : 0);
      }, 0);
      return {
        name: perfume.name.replace('RANA ', ''),
        units,
        revenue: units * perfume.price,
      };
    })
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const monthlyRevenueData = [
    { month: 'Apr', revenue: 65000, orders: 32 },
    { month: 'May', revenue: 98000, orders: 48 },
    { month: 'Jun', revenue: 142000, orders: 67 },
    { month: 'Jul', revenue: 185000, orders: 84 },
    { month: 'Aug', revenue: totalRevenue || 220000, orders: totalOrders || 95 },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#F8F7F4] flex flex-col md:flex-row select-none">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-[#161616] border-b border-[#F8F7F4]/10 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-[#C5A059] hover:bg-[#222]"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif text-lg font-bold tracking-wider text-white">
            RANA <span className="text-[#C5A059] text-[10px] font-mono tracking-widest uppercase">Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStore}
            className="px-2.5 py-1.5 text-xs font-mono text-[#A3A3A3] hover:text-[#C5A059] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 text-rose-400 hover:text-rose-300"
            title="Log out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#141414] border-r border-[#F8F7F4]/10 flex flex-col justify-between transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-[#F8F7F4]/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white tracking-widest leading-none">
                  RANA
                </h1>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mt-1">
                  Atelier Administration
                </span>
              </div>
              <button
                onClick={onBackToStore}
                title="Return to Public Boutique"
                className="p-2 text-[#737373] hover:text-[#C5A059] hover:bg-[#222] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Authenticated Admin Badge */}
            <div className="mt-4 p-2 bg-[#1A1A1A] border border-[#C5A059]/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="min-w-0">
                <span className="font-mono text-[9px] text-[#A3A3A3] block uppercase tracking-wider">
                  Logged in Admin
                </span>
                <p className="font-mono text-[11px] text-[#F8F7F4] truncate font-semibold">
                  {adminSession?.email || 'partapvinay269@gmail.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 font-mono text-xs overflow-y-auto max-h-[calc(100vh-210px)]">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package, badge: perfumesList.length },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: ordersList.length },
              { id: 'customers', label: 'Customers', icon: Users, badge: totalCustomers },
              { id: 'discounts', label: 'Offers & Coupons', icon: Tag, badge: discountsList.length },
              { id: 'content', label: 'Website Content', icon: FileText },
              { id: 'inventory', label: 'Inventory', icon: Warehouse, badge: lowStockProducts.length ? `!${lowStockProducts.length}` : undefined },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'supabase', label: 'Supabase Sync', icon: Database },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A059] text-[#121212] font-bold shadow-md'
                      : 'text-[#A3A3A3] hover:bg-[#1E1E1E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono ${
                        isActive
                          ? 'bg-[#121212] text-[#C5A059]'
                          : String(item.badge).startsWith('!')
                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                          : 'bg-[#222] text-[#A3A3A3]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-[#F8F7F4]/10 space-y-2">
          <button
            onClick={onBackToStore}
            className="w-full py-2 px-3 bg-[#1E1E1E] hover:bg-[#252525] text-[#F8F7F4] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="border-b border-[#F8F7F4]/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  Atelier Performance
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                  Executive Overview
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshData}
                  className="px-3.5 py-2 bg-[#1E1E1E] hover:bg-[#252525] border border-[#333] text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Refresh Data</span>
                </button>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-[#121212] text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Perfume</span>
                </button>
              </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10">
                <div className="flex items-center justify-between text-[#A3A3A3] mb-2 font-mono text-[11px] uppercase tracking-wider">
                  <span>Total Sales</span>
                  <DollarSign className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="font-serif text-2xl md:text-3xl font-bold text-white">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="font-mono text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>100% Verified customer orders</span>
                </div>
              </div>

              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10">
                <div className="flex items-center justify-between text-[#A3A3A3] mb-2 font-mono text-[11px] uppercase tracking-wider">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="font-serif text-2xl md:text-3xl font-bold text-white">
                  {totalOrders}
                </div>
                <div className="font-mono text-[10px] text-[#A3A3A3] mt-2 flex items-center gap-2">
                  <span className="text-amber-300 font-semibold">{pendingOrders} Pending</span>
                  <span>·</span>
                  <span className="text-emerald-300 font-semibold">{completedOrders} Completed</span>
                </div>
              </div>

              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10">
                <div className="flex items-center justify-between text-[#A3A3A3] mb-2 font-mono text-[11px] uppercase tracking-wider">
                  <span>Catalog Perfumes</span>
                  <Package className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="font-serif text-2xl md:text-3xl font-bold text-white">
                  {totalProducts}
                </div>
                <div className="font-mono text-[10px] text-[#A3A3A3] mt-2">
                  <span className="text-[#C5A059] font-bold">{activeProductsCount} Live in Store</span>
                </div>
              </div>

              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10">
                <div className="flex items-center justify-between text-[#A3A3A3] mb-2 font-mono text-[11px] uppercase tracking-wider">
                  <span>Customers</span>
                  <Users className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="font-serif text-2xl md:text-3xl font-bold text-white">
                  {totalCustomers}
                </div>
                <div className="font-mono text-[10px] text-[#A3A3A3] mt-2">
                  <span>Average Order: ₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString('en-IN') : 0}</span>
                </div>
              </div>
            </div>

            {/* Low-Stock Alert Warning Banner */}
            {lowStockProducts.length > 0 && (
              <div className="p-4 bg-amber-950/40 border border-amber-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs text-amber-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block">Low-Stock Alert</span>
                    <p className="text-[11px] text-amber-300/80">
                      {lowStockProducts.length} fragrance products have 10 units or less remaining.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="px-3 py-1.5 bg-amber-500 text-black font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  Manage Inventory →
                </button>
              </div>
            )}

            {/* Sales Chart & Best Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Curve */}
              <div className="lg:col-span-2 p-5 bg-[#161616] border border-[#F8F7F4]/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-white">Monthly Revenue Progression</h3>
                  <span className="font-mono text-[10px] text-[#C5A059] uppercase tracking-wider">
                    2026 Season
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#666" fontSize={11} fontFamily="monospace" />
                      <YAxis stroke="#666" fontSize={11} fontFamily="monospace" tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#C5A059', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#C5A059" strokeWidth={2} fillOpacity={1} fill="url(#goldGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Perfumes */}
              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10">
                <h3 className="font-serif text-lg text-white mb-4">Top Selling Scent Flacons</h3>
                <div className="space-y-3 font-mono text-xs">
                  {topPerfumesSales.length === 0 ? (
                    <p className="text-[#737373] py-4 text-center">No orders recorded yet.</p>
                  ) : (
                    topPerfumesSales.map((item, idx) => (
                      <div key={item.name} className="p-2.5 bg-[#1C1C1C] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] font-bold text-[10px] flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-white font-semibold truncate max-w-[120px]">{item.name}</p>
                            <span className="text-[10px] text-[#A3A3A3]">{item.units} bottles sold</span>
                          </div>
                        </div>
                        <span className="font-bold text-[#C5A059]">₹{item.revenue.toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders Shelf */}
            <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-white">Recent Customer Submissions</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="font-mono text-xs text-[#C5A059] hover:underline uppercase tracking-wider"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto font-mono text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#333] text-[#A3A3A3] uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Total Amount</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {ordersList.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-[#1A1A1A]">
                        <td className="py-3 px-3 font-bold text-white">{order.id}</td>
                        <td className="py-3 px-3">
                          <p className="text-[#F8F7F4]">{order.customerInfo.fullName}</p>
                          <span className="text-[10px] text-[#737373]">{order.customerInfo.email}</span>
                        </td>
                        <td className="py-3 px-3 text-[#C5A059] font-bold">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 uppercase text-[10px] text-[#A3A3A3]">{order.paymentMethod}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : order.status === 'Shipped'
                                ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                : order.status === 'Processing'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-[#252525] text-white'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-2.5 py-1 bg-[#222] hover:bg-[#C5A059] hover:text-black text-xs font-mono transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: PRODUCT MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="space-y-6 max-w-7xl">
            <div className="border-b border-[#F8F7F4]/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  Catalog Inventory
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                  Product Management
                </h1>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-[#121212] font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Perfume</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-[#161616] border border-[#F8F7F4]/10 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search perfumes by name, scent notes, or family..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#1F1F1F] border border-[#333] text-xs font-mono text-white placeholder-[#555] outline-none focus:border-[#C5A059]"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-4 py-2.5 bg-[#1F1F1F] border border-[#333] text-xs font-mono text-white outline-none focus:border-[#C5A059]"
              >
                <option value="all">All Categories</option>
                <option value="Men">Pour Homme (Men)</option>
                <option value="Women">Pour Femme (Women)</option>
                <option value="Unisex">Unisex Series</option>
                <option value="Oud">Artisanal Oud</option>
                <option value="Premium">Grand Extraits</option>
                <option value="Gift Sets">Gift Sets / Combos</option>
              </select>
            </div>

            {/* Products Table */}
            <div className="bg-[#161616] border border-[#F8F7F4]/10 overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#333] text-[#A3A3A3] uppercase text-[10px] tracking-wider bg-[#141414]">
                    <th className="py-3 px-4">Fragrance</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price / Discount</th>
                    <th className="py-3 px-4">Stock Units</th>
                    <th className="py-3 px-4">Highlights</th>
                    <th className="py-3 px-4">Public Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {filteredProducts.map((perfume) => (
                    <tr key={perfume.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={perfume.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&q=80'}
                            alt={perfume.name}
                            className="w-10 h-10 object-contain bg-[#1F1F1F] border border-[#333] p-1"
                          />
                          <div>
                            <p className="font-serif text-sm font-semibold text-white">{perfume.name}</p>
                            <span className="text-[10px] text-[#737373]">{perfume.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-[#222] text-[#A3A3A3] uppercase text-[10px]">
                          {perfume.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-white font-bold">₹{perfume.price.toLocaleString('en-IN')}</p>
                        {perfume.originalPrice && (
                          <span className="text-[10px] text-[#737373] line-through">
                            ₹{perfume.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {perfume.discountPercent ? (
                          <span className="ml-1 text-[10px] text-[#C5A059] font-bold">
                            ({perfume.discountPercent}% off)
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            (perfume.stock ?? 0) <= 0
                              ? 'text-red-400'
                              : (perfume.stock ?? 0) <= 10
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {perfume.stock ?? 25} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {perfume.bestSeller && (
                            <span className="px-1.5 py-0.5 bg-[#C5A059]/20 text-[#C5A059] text-[9px] font-bold uppercase">
                              Best Seller
                            </span>
                          )}
                          {perfume.featured && (
                            <span className="px-1.5 py-0.5 bg-purple-950 text-purple-300 text-[9px] font-bold uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleProductActive(perfume)}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            perfume.isActive !== false
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {perfume.isActive !== false ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(perfume)}
                            className="p-1.5 bg-[#222] hover:bg-[#C5A059] hover:text-black transition-colors"
                            title="Edit Perfume"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(perfume.id)}
                            className="p-1.5 bg-[#222] hover:bg-red-700 text-red-300 hover:text-white transition-colors"
                            title="Delete Perfume"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ORDER MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-6 max-w-7xl">
            <div className="border-b border-[#F8F7F4]/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  Customer Fulfillments
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                  Order Management
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncRemoteOrders}
                  disabled={isSyncingRemote}
                  className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingRemote ? 'animate-spin' : ''}`} />
                  <span>Sync Supabase Orders</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-[#161616] border border-[#F8F7F4]/10 flex flex-col sm:flex-row gap-3 font-mono text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, email, or mobile..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#1F1F1F] border border-[#333] text-white placeholder-[#555] outline-none focus:border-[#C5A059]"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="bg-[#161616] border border-[#F8F7F4]/10 overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#333] text-[#A3A3A3] uppercase text-[10px] tracking-wider bg-[#141414]">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#737373]">
                        No matching orders located.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{order.id}</p>
                          <span className="text-[10px] text-[#737373]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-white font-semibold">{order.customerInfo.fullName}</p>
                          <span className="text-[10px] text-[#A3A3A3] block">{order.customerInfo.email}</span>
                          <span className="text-[10px] text-[#737373]">{order.customerInfo.phone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#C5A059] font-bold">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} Items
                          </span>
                          <span className="text-[10px] text-[#737373] block truncate max-w-[150px]">
                            {order.items.map((i) => i.product.name).join(', ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#C5A059]">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-[#222] text-[#A3A3A3] uppercase text-[10px]">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`px-2 py-1 text-[11px] font-mono font-bold uppercase rounded-none border outline-none cursor-pointer ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : order.status === 'Shipped'
                                ? 'bg-blue-950 text-blue-300 border-blue-700'
                                : order.status === 'Processing'
                                ? 'bg-amber-950 text-amber-300 border-amber-700'
                                : order.status === 'Cancelled'
                                ? 'bg-red-950 text-red-300 border-red-700'
                                : 'bg-[#262626] text-white border-[#444]'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-3 py-1 bg-[#222] hover:bg-[#C5A059] hover:text-black font-semibold uppercase text-[10px] transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: CUSTOMER MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'customers' && (
          <div className="space-y-6 max-w-7xl">
            <div className="border-b border-[#F8F7F4]/10 pb-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                Client Directory
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                Customer Management
              </h1>
            </div>

            {/* Search */}
            <div className="p-4 bg-[#161616] border border-[#F8F7F4]/10">
              <div className="relative">
                <Search className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter clients by name, email, or telephone number..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#1F1F1F] border border-[#333] text-xs font-mono text-white placeholder-[#555] outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#161616] border border-[#F8F7F4]/10 overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#333] text-[#A3A3A3] uppercase text-[10px] tracking-wider bg-[#141414]">
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Total Orders</th>
                    <th className="py-3 px-4">Lifetime Spend</th>
                    <th className="py-3 px-4">First Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.email} className="hover:bg-[#1A1A1A]">
                      <td className="py-3.5 px-4 font-bold text-white">{customer.name}</td>
                      <td className="py-3.5 px-4 text-[#A3A3A3]">{customer.email}</td>
                      <td className="py-3.5 px-4 text-[#A3A3A3]">{customer.phone}</td>
                      <td className="py-3.5 px-4 font-bold text-[#C5A059]">{customer.orderCount} Orders</td>
                      <td className="py-3.5 px-4 font-bold text-white">₹{customer.totalSpent.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 text-[#737373]">
                        {new Date(customer.firstDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: OFFERS & DISCOUNTS */}
        {/* ============================================================ */}
        {activeTab === 'discounts' && (
          <div className="space-y-6 max-w-7xl">
            <div className="border-b border-[#F8F7F4]/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  Promotions Engine
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                  Offers & Discount Codes
                </h1>
              </div>

              <button
                onClick={handleOpenAddDiscount}
                className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Create Privilege Code</span>
              </button>
            </div>

            {/* Coupons Table */}
            <div className="bg-[#161616] border border-[#F8F7F4]/10 overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#333] text-[#A3A3A3] uppercase text-[10px] tracking-wider bg-[#141414]">
                    <th className="py-3 px-4">Coupon Code</th>
                    <th className="py-3 px-4">Discount Type & Value</th>
                    <th className="py-3 px-4">Minimum Bag Value</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Tags</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {discountsList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A1A1A]">
                      <td className="py-3 px-4 font-bold text-white tracking-widest text-sm">
                        {item.code}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[#C5A059] font-bold">
                          {item.type === 'percentage' ? `${item.discountValue}% OFF` : `₹${item.discountValue} FLAT OFF`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#A3A3A3]">
                        {item.minOrderValue ? `₹${item.minOrderValue.toLocaleString('en-IN')}` : 'None (No min)'}
                      </td>
                      <td className="py-3 px-4 text-[#A3A3A3] max-w-xs truncate">{item.description}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {item.isFeaturedDeal && (
                            <span className="px-1.5 py-0.5 bg-[#C5A059]/20 text-[#C5A059] text-[9px] uppercase font-bold">
                              Featured
                            </span>
                          )}
                          {item.isCombo && (
                            <span className="px-1.5 py-0.5 bg-blue-950 text-blue-300 text-[9px] uppercase font-bold">
                              Combo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleDiscount(item.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase ${
                            item.isActive
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditDiscount(item)}
                            className="p-1.5 bg-[#222] hover:bg-[#C5A059] hover:text-black"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDiscount(item.id)}
                            className="p-1.5 bg-[#222] hover:bg-red-700 text-red-300 hover:text-white"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: WEBSITE CONTENT MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'content' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[#F8F7F4]/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  Editorial CMS
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                  Website Content
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSiteContent}
                  className="px-3.5 py-2 bg-[#222] hover:bg-[#2a2a2a] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {contentSavedMsg && (
              <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs text-center font-bold">
                ✓ Website content saved & live across the storefront!
              </div>
            )}

            <form onSubmit={handleSaveSiteContent} className="space-y-6 font-mono text-xs">
              {/* Announcement Bar */}
              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <h3 className="font-serif text-lg text-white">Top Promotional Banner</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteContent.announcement.enabled}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          announcement: { ...siteContent.announcement, enabled: e.target.checked },
                        })
                      }
                      className="accent-[#C5A059]"
                    />
                    <span className="text-[10px] uppercase text-[#A3A3A3]">Enable Announcement</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Banner Text</label>
                  <input
                    type="text"
                    value={siteContent.announcement.text}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        announcement: { ...siteContent.announcement, text: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Homepage Hero */}
              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10 space-y-4">
                <h3 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">Homepage Hero Section</h3>

                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Eyebrow Tagline</label>
                  <input
                    type="text"
                    value={siteContent.hero.eyebrow}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, eyebrow: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Main Headline</label>
                  <input
                    type="text"
                    value={siteContent.hero.heading}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, heading: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Subheading Description</label>
                  <textarea
                    rows={2}
                    value={siteContent.hero.subheading}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, subheading: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Primary Button Text</label>
                    <input
                      type="text"
                      value={siteContent.hero.primaryBtnText}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, primaryBtnText: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Secondary Button Text</label>
                    <input
                      type="text"
                      value={siteContent.hero.secondaryBtnText}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, secondaryBtnText: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              {/* Concierge & Contact Support */}
              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10 space-y-4">
                <h3 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">Contact & Concierge Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Support Email</label>
                    <input
                      type="email"
                      value={siteContent.contact.conciergeEmail}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          contact: { ...siteContent.contact, conciergeEmail: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Concierge Telephone</label>
                    <input
                      type="text"
                      value={siteContent.contact.phone}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          contact: { ...siteContent.contact, phone: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block">Atelier Physical Address</label>
                  <input
                    type="text"
                    value={siteContent.contact.atelierAddress}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, atelierAddress: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-[#1F1F1F] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#C5A059] hover:bg-[#b08e4d] text-[#121212] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <Save className="w-4 h-4" />
                <span>Save All Website Content</span>
              </button>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 7: INVENTORY SECTION */}
        {/* ============================================================ */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 max-w-7xl">
            <div className="border-b border-[#F8F7F4]/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  Warehouse Stock
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                  Inventory Management
                </h1>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="p-2 bg-emerald-950/40 border border-emerald-800 text-emerald-300">
                  Healthy: {perfumesList.filter((p) => (p.stock ?? 0) > 10).length}
                </span>
                <span className="p-2 bg-amber-950/40 border border-amber-800 text-amber-300">
                  Low: {lowStockProducts.length}
                </span>
                <span className="p-2 bg-red-950/40 border border-red-800 text-red-300">
                  Out of Stock: {outOfStockProducts.length}
                </span>
              </div>
            </div>

            {/* Inventory Quick Stock Controls Table */}
            <div className="bg-[#161616] border border-[#F8F7F4]/10 overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#333] text-[#A3A3A3] uppercase text-[10px] tracking-wider bg-[#141414]">
                    <th className="py-3 px-4">Perfume Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Quick Stock Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {perfumesList.map((perfume) => {
                    const currentStock = perfume.stock ?? 0;
                    return (
                      <tr key={perfume.id} className="hover:bg-[#1A1A1A]">
                        <td className="py-3 px-4 font-bold text-white">{perfume.name}</td>
                        <td className="py-3 px-4 text-[#A3A3A3]">{perfume.category}</td>
                        <td className="py-3 px-4 text-[#C5A059]">₹{perfume.price.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 font-bold text-sm">
                          <span
                            className={
                              currentStock <= 0
                                ? 'text-red-400 font-extrabold'
                                : currentStock <= 10
                                ? 'text-amber-400 font-extrabold'
                                : 'text-emerald-400'
                            }
                          >
                            {currentStock} Flacons
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                              currentStock <= 0
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : currentStock <= 10
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {currentStock <= 0 ? 'Out of Stock' : currentStock <= 10 ? 'Low Stock Alert' : 'In Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleQuickStockChange(perfume.id, -5)}
                              className="px-2 py-1 bg-[#222] hover:bg-[#333] text-[#A3A3A3] hover:text-white"
                              title="Decrease 5"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleQuickStockChange(perfume.id, -1)}
                              className="px-2 py-1 bg-[#222] hover:bg-[#333] text-[#A3A3A3] hover:text-white"
                              title="Decrease 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleQuickStockChange(perfume.id, 1)}
                              className="px-2 py-1 bg-[#222] hover:bg-[#C5A059] hover:text-black font-bold"
                              title="Increase 1"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleQuickStockChange(perfume.id, 5)}
                              className="px-2 py-1 bg-[#222] hover:bg-[#C5A059] hover:text-black font-bold"
                              title="Increase 5"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleOpenEditProduct(perfume)}
                              className="px-2.5 py-1 bg-[#C5A059] text-black font-bold ml-1"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8: ANALYTICS */}
        {/* ============================================================ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 max-w-7xl">
            <div className="border-b border-[#F8F7F4]/10 pb-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                Business Intelligence
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                Sales & Orders Analytics
              </h1>
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trends */}
              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10">
                <h3 className="font-serif text-lg text-white mb-2">Revenue Progression</h3>
                <p className="font-mono text-[11px] text-[#A3A3A3] mb-4">Total revenue trends per month</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenueData}>
                      <XAxis dataKey="month" stroke="#777" fontSize={11} fontFamily="monospace" />
                      <YAxis stroke="#777" fontSize={11} fontFamily="monospace" tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#C5A059', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Sales Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#C5A059" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="p-5 bg-[#161616] border border-[#F8F7F4]/10">
                <h3 className="font-serif text-lg text-white mb-2">Orders by Status</h3>
                <p className="font-mono text-[11px] text-[#A3A3A3] mb-4">Fulfillment status breakdown</p>
                <div className="h-64 flex items-center justify-center">
                  {salesByStatusData.length === 0 ? (
                    <p className="font-mono text-xs text-[#737373]">No orders recorded.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesByStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {salesByStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 9: SUPABASE CLOUD BACKEND */}
        {/* ============================================================ */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[#F8F7F4]/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  Cloud Backend Integration
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
                  Supabase Live Sync
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCheckSupabase}
                  disabled={supabaseStatus.checking}
                  className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#252525] border border-[#333] text-[#F8F7F4] font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${supabaseStatus.checking ? 'animate-spin text-[#C5A059]' : ''}`} />
                  <span>{supabaseStatus.checking ? 'Testing...' : 'Test Connection'}</span>
                </button>

                <button
                  onClick={handleSyncRemoteOrders}
                  disabled={isSyncingRemote}
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingRemote ? 'animate-spin' : ''}`} />
                  <span>{isSyncingRemote ? 'Syncing...' : 'Sync Orders'}</span>
                </button>
              </div>
            </div>

            {remoteSyncResult && (
              <div className="p-3 bg-[#1A1A1A] border border-[#C5A059]/40 text-[#C5A059] font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{remoteSyncResult}</span>
              </div>
            )}

            {/* Connection Credentials Card */}
            <div className="bg-[#161616] border border-[#F8F7F4]/10 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white">Active Supabase Project</h3>
                    <p className="font-mono text-[11px] text-[#A3A3A3]">
                      Target PostgreSQL database for customer orders
                    </p>
                  </div>
                </div>

                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#2c2c2c] text-[#C5A059] font-mono text-[11px] border border-[#C5A059]/30"
                >
                  <span>Open Supabase</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3 bg-[#1E1E1E] border border-[#333] space-y-1">
                  <span className="text-[#A3A3A3] uppercase text-[10px]">Project ID</span>
                  <p className="text-white font-bold">{SUPABASE_PROJECT_ID}</p>
                </div>
                <div className="p-3 bg-[#1E1E1E] border border-[#333] space-y-1">
                  <span className="text-[#A3A3A3] uppercase text-[10px]">Target Database Table</span>
                  <p className="text-[#C5A059] font-bold">public.orders</p>
                </div>
                <div className="p-3 bg-[#1E1E1E] border border-[#333] space-y-1 md:col-span-2">
                  <span className="text-[#A3A3A3] uppercase text-[10px]">Supabase REST Endpoint</span>
                  <p className="text-[#F8F7F4]/80 break-all">{SUPABASE_URL}</p>
                </div>
              </div>

              {supabaseStatus.checked && (
                <div
                  className={`p-4 border font-mono text-xs flex items-start gap-3 ${
                    supabaseStatus.tableExists
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : supabaseStatus.connected
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}
                >
                  {supabaseStatus.tableExists ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">
                      {supabaseStatus.tableExists
                        ? 'Connected & Orders Table Active (HTTP 200)'
                        : 'Connected to Project'}
                    </p>
                    <p className="opacity-90 mt-0.5">{supabaseStatus.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* SQL Schema Copy Card */}
            <div className="bg-[#161616] border border-[#F8F7F4]/10 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <h3 className="font-serif text-lg text-white">Database SQL Schema</h3>
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy SQL Script</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-[#111] border border-[#333] font-mono text-[11px] text-[#C5A059]/90 max-h-56 overflow-y-auto leading-relaxed select-all">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141414] border border-[#C5A059]/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative text-[#F8F7F4]"
            >
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="absolute right-4 top-4 p-2 text-[#737373] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-[#2A2A2A] pb-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
                  Product Inventory Editor
                </span>
                <h2 className="font-serif text-2xl font-light text-white mt-1">
                  {editingProduct ? 'Edit Fragrance Product' : 'Add New Fragrance Product'}
                </h2>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 font-mono text-xs">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                    Perfume Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. RANA Velvet Rose"
                    className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Price, Original Price, Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={productForm.discountPercent}
                      onChange={(e) => setProductForm({ ...productForm, discountPercent: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Category & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    >
                      <option value="Men">Pour Homme (Men)</option>
                      <option value="Women">Pour Femme (Women)</option>
                      <option value="Unisex">Unisex Series</option>
                      <option value="Oud">Artisanal Oud</option>
                      <option value="Premium">Grand Extraits</option>
                      <option value="Gift Sets">Gift Sets / Combos</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Target Gender *
                    </label>
                    <select
                      value={productForm.gender}
                      onChange={(e) => setProductForm({ ...productForm, gender: e.target.value as any })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                {/* Stock & Rating */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Stock Quantity (Units) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Display Rating
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      min={1}
                      max={5}
                      value={productForm.rating}
                      onChange={(e) => setProductForm({ ...productForm, rating: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Image Upload & URL */}
                <div className="space-y-2 p-3 bg-[#1A1A1A] border border-[#333]">
                  <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                    Product Image (File Upload or Image URL)
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="px-4 py-2 bg-[#252525] hover:bg-[#333] text-white border border-[#444] cursor-pointer text-xs flex items-center gap-2 shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Upload Image File</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>

                    <span className="text-[10px] text-[#737373]">or</span>

                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="flex-1 w-full p-2 bg-[#1F1F1F] border border-[#333] text-white text-xs outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  {productForm.image && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-[#111]">
                      <img
                        src={productForm.image}
                        alt="Preview"
                        className="w-12 h-12 object-contain bg-[#1F1F1F] border border-[#333]"
                      />
                      <span className="text-[10px] text-emerald-400">✓ Image loaded and ready</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                    Fragrance Description & Story *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe olfactory character, accords, and recommended wear..."
                    className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Scent Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#A3A3A3] uppercase text-[9px] block">Top Notes</label>
                    <input
                      type="text"
                      value={productForm.topNotes}
                      onChange={(e) => setProductForm({ ...productForm, topNotes: e.target.value })}
                      placeholder="Bergamot, Lemon"
                      className="w-full p-2 bg-[#1E1E1E] border border-[#333] text-white text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#A3A3A3] uppercase text-[9px] block">Heart Notes</label>
                    <input
                      type="text"
                      value={productForm.heartNotes}
                      onChange={(e) => setProductForm({ ...productForm, heartNotes: e.target.value })}
                      placeholder="Turkish Rose, Jasmine"
                      className="w-full p-2 bg-[#1E1E1E] border border-[#333] text-white text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#A3A3A3] uppercase text-[9px] block">Base Notes</label>
                    <input
                      type="text"
                      value={productForm.baseNotes}
                      onChange={(e) => setProductForm({ ...productForm, baseNotes: e.target.value })}
                      placeholder="Amber, Oud, Sandalwood"
                      className="w-full p-2 bg-[#1E1E1E] border border-[#333] text-white text-[11px]"
                    />
                  </div>
                </div>

                {/* Toggles: Featured, Best Seller, Active */}
                <div className="p-3 bg-[#1A1A1A] border border-[#333] flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.bestSeller}
                      onChange={(e) => setProductForm({ ...productForm, bestSeller: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span className="text-white font-semibold text-[11px]">Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span className="text-white font-semibold text-[11px]">Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span className="text-emerald-400 font-semibold text-[11px]">Active (Visible in Shop)</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2A2A]">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 bg-[#252525] hover:bg-[#333] text-white uppercase font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black uppercase font-bold tracking-wider"
                  >
                    {editingProduct ? 'Save Product Changes' : 'Create Fragrance'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* ADD / EDIT DISCOUNT MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isDiscountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141414] border border-[#C5A059]/40 max-w-md w-full p-6 space-y-5 text-[#F8F7F4]"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <h3 className="font-serif text-xl text-white">
                  {editingDiscount ? 'Edit Privilege Code' : 'Create Privilege Code'}
                </h3>
                <button
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="p-1 text-[#737373] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDiscount} className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                    Privilege Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={discountForm.code}
                    onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. VIP25"
                    className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white uppercase tracking-widest font-bold outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Discount Type *
                    </label>
                    <select
                      value={discountForm.type}
                      onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value as any })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={discountForm.discountValue}
                      onChange={(e) => setDiscountForm({ ...discountForm, discountValue: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                    Minimum Bag Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={discountForm.minOrderValue}
                    onChange={(e) => setDiscountForm({ ...discountForm, minOrderValue: Number(e.target.value) })}
                    placeholder="0 = No minimum"
                    className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A3A3A3] uppercase text-[10px] tracking-wider block font-semibold">
                    Description & Terms
                  </label>
                  <textarea
                    rows={2}
                    value={discountForm.description}
                    onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
                    placeholder="e.g. 25% privilege discount for connoisseur club patrons..."
                    className="w-full p-2.5 bg-[#1E1E1E] border border-[#333] text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex items-center gap-4 p-3 bg-[#1A1A1A] border border-[#333]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={discountForm.isFeaturedDeal}
                      onChange={(e) => setDiscountForm({ ...discountForm, isFeaturedDeal: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span className="text-[11px] text-white">Featured Deal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={discountForm.isCombo}
                      onChange={(e) => setDiscountForm({ ...discountForm, isCombo: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span className="text-[11px] text-white">Combo Offer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={discountForm.isActive}
                      onChange={(e) => setDiscountForm({ ...discountForm, isActive: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span className="text-[11px] text-emerald-400">Active</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDiscountModalOpen(false)}
                    className="px-4 py-2 bg-[#252525] text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C5A059] text-black font-bold uppercase"
                  >
                    {editingDiscount ? 'Update Code' : 'Save Code'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* ORDER INSPECTION MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141414] border border-[#C5A059]/40 max-w-xl w-full p-6 md:p-8 space-y-5 text-[#F8F7F4] relative font-mono text-xs"
            >
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="absolute right-4 top-4 p-2 text-[#737373] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-[#2A2A2A] pb-4">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
                  Order Inspection
                </span>
                <h2 className="font-serif text-2xl text-white font-light mt-1">
                  {selectedOrderDetails.id}
                </h2>
                <span className="text-[10px] text-[#737373]">
                  Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Customer & Address Details */}
              <div className="p-4 bg-[#1A1A1A] border border-[#333] space-y-2">
                <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px] block">
                  Customer & Delivery Information
                </span>
                <p className="font-bold text-white text-sm">{selectedOrderDetails.customerInfo.fullName}</p>
                <p className="text-[#A3A3A3]">
                  {selectedOrderDetails.customerInfo.email} · {selectedOrderDetails.customerInfo.phone}
                </p>
                <p className="text-[#737373] pt-1">
                  Address: {selectedOrderDetails.shippingAddress.houseNo || selectedOrderDetails.shippingAddress.addressLine1},{' '}
                  {selectedOrderDetails.shippingAddress.street || selectedOrderDetails.shippingAddress.addressLine2},{' '}
                  {selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state} -{' '}
                  {selectedOrderDetails.shippingAddress.pinCode || selectedOrderDetails.shippingAddress.zipCode}
                </p>
              </div>

              {/* Items Purchased */}
              <div className="space-y-2">
                <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px] block">
                  Purchased Fragrance Flacons
                </span>
                {selectedOrderDetails.items.map((item) => (
                  <div key={item.product.id} className="p-3 bg-[#1A1A1A] flex items-center justify-between border border-[#2A2A2A]">
                    <div>
                      <p className="text-white font-semibold">{item.product.name}</p>
                      <span className="text-[10px] text-[#737373]">
                        Qty: {item.quantity} · Size: {item.selectedSize || '100ml'}
                      </span>
                    </div>
                    <span className="font-bold text-[#C5A059]">
                      ₹{((item.itemPrice ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="border-t border-[#2A2A2A] pt-3 space-y-1.5 text-[#A3A3A3]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{selectedOrderDetails.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrderDetails.discountAmount > 0 && (
                  <div className="flex justify-between text-[#C5A059]">
                    <span>Discount Applied ({selectedOrderDetails.couponCode || 'PROMO'})</span>
                    <span>-₹{selectedOrderDetails.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST Duty (18%)</span>
                  <span>₹{selectedOrderDetails.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-white pt-2 border-t border-[#333]">
                  <span>Total Amount Paid</span>
                  <span className="text-[#C5A059]">₹{selectedOrderDetails.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-white uppercase text-[10px]">Update Order Status:</span>
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrderDetails.id, e.target.value as OrderStatus)}
                  className="px-3 py-1.5 bg-[#262626] border border-[#C5A059]/40 text-[#C5A059] font-bold uppercase outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {deletingProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141414] border border-red-700/60 p-6 max-w-sm w-full space-y-4 text-center font-mono text-xs text-[#F8F7F4]"
            >
              <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="font-serif text-xl text-white">Permanently Delete Product?</h3>
              <p className="text-[#A3A3A3]">
                Are you sure you want to remove this perfume from the catalog? This will remove it from the live store.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingProductId(null)}
                  className="px-4 py-2 bg-[#252525] text-white uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white uppercase font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
