/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, X, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { authenticateAdmin } from '../utils/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both administrator email and security password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticateAdmin(email, password);
      if (result.success) {
        setEmail('');
        setPassword('');
        onLoginSuccess();
      } else {
        setErrorMessage(result.error || 'Invalid administrator email or password. Access denied.');
      }
    } catch (err: any) {
      setErrorMessage('Authentication service error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#121212] border border-[#C5A059]/30 shadow-2xl p-6 sm:p-8 text-[#F8F7F4] z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#F8F7F4]/40 hover:text-[#C5A059] transition-colors cursor-pointer"
            title="Return to Boutique"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-[#F8F7F4]/10">
            <div className="w-12 h-12 mx-auto bg-[#1A1A1A] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Lock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
                Atelier Administration
              </span>
              <h2 className="font-serif text-2xl font-light text-white tracking-wide mt-1">
                Admin Portal
              </h2>
            </div>
            <p className="font-mono text-[11px] text-[#A3A3A3] max-w-xs mx-auto leading-relaxed">
              Authorized management access for RANA Luxury Perfumes boutique operations.
            </p>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block font-semibold">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737373]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ranaperfumes.com"
                  className="w-full pl-9 pr-3 py-3 bg-[#1A1A1A] border border-[#2E2E2E] text-white placeholder-[#555] focus:outline-none focus:border-[#C5A059] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#A3A3A3] text-[10px] uppercase tracking-wider block font-semibold">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737373]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-3 bg-[#1A1A1A] border border-[#2E2E2E] text-white placeholder-[#555] focus:outline-none focus:border-[#C5A059] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#737373] hover:text-[#C5A059] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3.5 bg-[#C5A059] hover:bg-[#b08e4d] text-[#121212] font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer security note */}
          <div className="mt-6 pt-4 border-t border-[#F8F7F4]/10 text-center font-mono text-[10px] text-[#737373] flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Encrypted Session · Restricted to Authorized Staff</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
