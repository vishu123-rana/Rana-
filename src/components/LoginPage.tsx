/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { validateLogin } from '../utils/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateSignup: () => void;
  onBackToHome: () => void;
}

export default function LoginPage({
  onLoginSuccess,
  onNavigateSignup,
  onBackToHome,
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const result = validateLogin(email, password);
      setIsSubmitting(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrors({ general: result.error || 'Authentication failed. Please check credentials.' });
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('arjun@example.com');
    setPassword('rana1234');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Return back home CTA */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#888888] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Boutique</span>
      </button>

      {/* Central Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0C0C0C] border border-[#1E1E1E] p-8 md:p-10 text-left shadow-2xl relative z-10"
      >
        {/* Brand Heading */}
        <div className="border-b border-[#1A1A1A] pb-6 mb-8 text-center">
          <div className="inline-block px-3 py-0.5 bg-[#141414] border border-[#242424] text-[#A3A3A3] text-[9px] font-mono uppercase tracking-widest mb-3">
            Maison Client Portal
          </div>
          <span className="font-serif text-3xl font-light tracking-[0.2em] text-white block">
            RANA
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#737373] block mt-1">
            Sign In to Your Account
          </span>
        </div>

        {/* General Error Banner */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Demo Account Hint Box */}
        <div className="mb-6 p-3 bg-[#111111] border border-[#222222] flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-[#888888] block uppercase text-[9px] tracking-wider">Demo Account</span>
            <span className="text-white text-[11px]">arjun@example.com</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 text-[10px] uppercase font-semibold text-white bg-[#1A1A1A] hover:bg-white hover:text-black border border-[#2E2E2E] transition-colors cursor-pointer"
          >
            Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="name@domain.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-[#121212] border text-xs font-mono text-white placeholder-[#555555] focus:outline-none ${
                  errors.email ? 'border-red-500' : 'border-[#262626] focus:border-white'
                }`}
              />
            </div>
            {errors.email && (
              <span className="block mt-1 font-mono text-[10px] text-red-400">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-[#121212] border text-xs font-mono text-white placeholder-[#555555] focus:outline-none ${
                  errors.password ? 'border-red-500' : 'border-[#262626] focus:border-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="block mt-1 font-mono text-[10px] text-red-400">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer mt-2"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Boutique'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-[#1A1A1A] text-center space-y-3 font-mono text-xs">
          <p className="text-[#737373]">
            New to Maison RANA?{' '}
            <button
              onClick={onNavigateSignup}
              className="text-white hover:underline cursor-pointer font-semibold ml-1"
            >
              Create Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
