/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Mail, User as UserIcon, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { registerUser } from '../utils/auth';

interface SignupPageProps {
  onSignupSuccess: (user: User) => void;
  onNavigateLogin: () => void;
  onBackToHome: () => void;
}

export default function SignupPage({
  onSignupSuccess,
  onNavigateLogin,
  onBackToHome,
}: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Full Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
      const result = registerUser(
        name.trim(),
        email.trim(),
        password,
        phone.trim() || undefined
      );

      setIsSubmitting(false);

      if (result.success && result.user) {
        onSignupSuccess(result.user);
      } else {
        setErrors({ general: result.error || 'Registration failed. Please try again.' });
      }
    }, 450);
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

      {/* Central Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0C0C0C] border border-[#1E1E1E] p-8 md:p-10 text-left shadow-2xl relative z-10"
      >
        {/* Brand Heading */}
        <div className="border-b border-[#1A1A1A] pb-6 mb-8 text-center">
          <div className="inline-block px-3 py-0.5 bg-[#141414] border border-[#242424] text-[#A3A3A3] text-[9px] font-mono uppercase tracking-widest mb-3">
            Maison Privilege Circle
          </div>
          <span className="font-serif text-3xl font-light tracking-[0.2em] text-white block">
            RANA
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#737373] block mt-1">
            Create Your Account
          </span>
        </div>

        {/* General Error Banner */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Lord / Lady ..."
                className={`w-full px-4 py-2.5 pl-10 bg-[#121212] border text-xs font-mono text-white placeholder-[#555555] focus:outline-none ${
                  errors.name ? 'border-red-500' : 'border-[#262626] focus:border-white'
                }`}
              />
              <UserIcon className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.name && (
              <span className="block mt-1 font-mono text-[10px] text-red-400">{errors.name}</span>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="name@domain.com"
                className={`w-full px-4 py-2.5 pl-10 bg-[#121212] border text-xs font-mono text-white placeholder-[#555555] focus:outline-none ${
                  errors.email ? 'border-red-500' : 'border-[#262626] focus:border-white'
                }`}
              />
              <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && (
              <span className="block mt-1 font-mono text-[10px] text-red-400">{errors.email}</span>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 pl-10 bg-[#121212] border border-[#262626] focus:border-white text-xs font-mono text-white placeholder-[#555555] focus:outline-none"
              />
              <Phone className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 pl-10 pr-10 bg-[#121212] border text-xs font-mono text-white placeholder-[#555555] focus:outline-none ${
                  errors.password ? 'border-red-500' : 'border-[#262626] focus:border-white'
                }`}
              />
              <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
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

          {/* Confirm Password */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 pl-10 bg-[#121212] border text-xs font-mono text-white placeholder-[#555555] focus:outline-none ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[#262626] focus:border-white'
                }`}
              />
              <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.confirmPassword && (
              <span className="block mt-1 font-mono text-[10px] text-red-400">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer mt-4"
          >
            {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-[#1A1A1A] text-center font-mono text-xs text-[#737373]">
          Already an account holder?{' '}
          <button
            onClick={onNavigateLogin}
            className="text-white hover:underline cursor-pointer font-semibold ml-1"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
}
