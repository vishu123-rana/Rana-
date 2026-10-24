/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Shield, Landmark, Scale, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PolicyModalProps {
  policyName: string | null;
  onClose: () => void;
}

export default function PolicyModal({ policyName, onClose }: PolicyModalProps) {
  if (!policyName) return null;

  const getPolicyContent = (name: string) => {
    switch (name) {
      case 'Privacy Policy':
        return {
          icon: <Shield className="w-6 h-6 text-white" />,
          clauses: [
            {
              title: '1. Secure Data Encryption',
              text: 'At RANA Perfumes, we utilize bank-grade AES-256 secure socket layer (SSL) encryption for all personal customer profiles, checkout transaction details, and fragrance histories.',
            },
            {
              title: '2. Cookie Usage and Personalization',
              text: 'We employ secure cookies to remember your boutique preferences, customized shopping bag items, and favorite fragrance notes to personalize your navigation experience.',
            },
            {
              title: '3. Zero Third-Party Monetization',
              text: 'We do not sell, trade, or transfer your personal identity data or contact numbers to any outside marketing companies. All customer statistics are kept strictly internal.',
            },
          ],
        };
      case 'Terms & Conditions':
        return {
          icon: <Scale className="w-6 h-6 text-white" />,
          clauses: [
            {
              title: '1. Intellectual Luxury Rights',
              text: 'All RANA logos, flacon rendering physics, vector formulas, descriptions, and botanical sourcing details are the sole intellectual property of RANA Luxury Perfumes.',
            },
            {
              title: '2. Order Acceptance Thresholds',
              text: 'We reserve the absolute right to limit, cancel, or reject any purchase request if we detect fraudulent address layouts, fake pincode entries, or double payment failures.',
            },
            {
              title: '3. Pricing Integrity',
              text: 'Fragrances are sold starting from ₹1,000. All prices listed on this boutique are binding. GST is dynamically compiled at the standard 18% rate for luxury commodities.',
            },
          ],
        };
      case 'Shipping Policy':
        return {
          icon: <FileText className="w-6 h-6 text-white" />,
          clauses: [
            {
              title: '1. Secure Air Logistics',
              text: 'To preserve fragrance molecular density, all RANA order packages are shipped via express secure temperature-regulated air couriers inside protective shockproof packaging.',
            },
            {
              title: '2. Complimentary Delivery Limit',
              text: 'Complimentary shipping is automatically unlocked for order subtotals exceeding ₹1,500. For lower order values, a standard secure shipping fee of ₹150 is applied.',
            },
            {
              title: '3. Tracking and Security Rings',
              text: 'Once order dispatch completes, a unique tracking identifier is delivered via secure email. Full signature confirmation is required at the doorstep for all deliveries.',
            },
          ],
        };
      case 'Refund Policy':
        return {
          icon: <Landmark className="w-6 h-6 text-white" />,
          clauses: [
            {
              title: '1. 7-Day Boutique Return',
              text: 'We offer an exclusive 7-day hassle-free return window. If the fragrance profile does not align with your expectation, you may request a return or immediate replacement.',
            },
            {
              title: '2. Sanitary Packaging Safeguards',
              text: 'For sanitary and safety reasons, the returned perfume bottle must remain in its original box with the protective outer cellophane sealing wrap unbroken.',
            },
            {
              title: '3. Safe Payment Reimbursements',
              text: 'Once we inspect and confirm the return, your refund will be compiled and directly transferred back to your original source of payment (UPI or credit card) within 3-5 business days.',
            },
          ],
        };
      default:
        return {
          icon: <FileText className="w-6 h-6 text-white" />,
          clauses: [],
        };
    }
  };

  const content = getPolicyContent(policyName);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop glass */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#222222] overflow-hidden z-10 p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto text-[#F5F5F5]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-[#161616] hover:bg-[#222222] text-[#888888] hover:text-white border border-[#2A2A2A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Header */}
          <div className="flex items-center gap-4 border-b border-[#1E1E1E] pb-4">
            <div className="p-3 bg-[#141414] border border-[#262626]">
              {content.icon}
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#888888] block">
                Boutique Charters
              </span>
              <h2 className="font-serif text-xl md:text-2xl font-light text-white tracking-wide">
                {policyName}
              </h2>
            </div>
          </div>

          {/* Legal clauses */}
          <div className="space-y-6">
            {content.clauses.map((clause) => (
              <div key={clause.title} className="space-y-1.5 font-sans">
                <h3 className="font-serif text-sm font-light text-white tracking-wide">
                  {clause.title}
                </h3>
                <p className="text-xs text-[#888888] leading-relaxed font-light">
                  {clause.text}
                </p>
              </div>
            ))}
          </div>

          {/* Footer close */}
          <div className="border-t border-[#1E1E1E] pt-5 text-center">
            <p className="text-[9px] text-[#666666] uppercase tracking-[0.2em] mb-4 font-mono">
              Authorized by RANA Legal and Compliance Committee
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              Acknowledge Policy
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
