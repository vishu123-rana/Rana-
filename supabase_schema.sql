-- ==========================================================
-- RANA LUXURY PERFUMES - SUPABASE SCHEMA FOR ORDERS TABLE
-- Project ID: jmgphiuxddonqdyeydjs
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==========================================================

-- 1. Create orders table
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
    status TEXT DEFAULT 'Processing',
    delivery_option TEXT,
    estimated_delivery_date TEXT,
    raw_payload JSONB
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anon/public users to insert new orders from checkout forms
CREATE POLICY "Allow public insert to orders" ON public.orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 4. Policy: Allow anon/public users to view orders (e.g. for order tracking by order ID)
CREATE POLICY "Allow public select on orders" ON public.orders
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 5. Policy: Allow updates (e.g. for order status or admin updates)
CREATE POLICY "Allow public update on orders" ON public.orders
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Optional: Create index on customer email and status for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
