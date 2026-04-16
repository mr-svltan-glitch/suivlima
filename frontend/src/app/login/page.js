"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      toast.success('Connexion réussie');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-suivlima-blue/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-suivlima-orange/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-white rounded-[2rem] shadow-premium mb-6 hover-lift">
            <Image 
              src="/logo.png" 
              alt="Logo Suivlima" 
              width={80} 
              height={80} 
              className="object-contain"
            />
          </div>
          <h2 className="text-4xl font-extrabold text-suivlima-blue tracking-tight mb-2">
            Suivlima <span className="text-suivlima-orange">SaaS</span>
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Gérez vos dossiers avec élégance et performance
          </p>
        </div>

        <div className="glass-card p-10 bg-white/40 border-white/60 shadow-2xl relative">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-suivlima-blue transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 border border-transparent rounded-2xl focus:ring-2 focus:ring-suivlima-blue focus:shadow-lg outline-none transition-all placeholder:text-gray-300 font-medium"
                  placeholder="admin@suivlima.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Mot de passe</label>
                <a href="#" className="text-xs font-bold text-suivlima-blue-light hover:underline">Oublié ?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-suivlima-blue transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 border border-transparent rounded-2xl focus:ring-2 focus:ring-suivlima-blue focus:shadow-lg outline-none transition-all placeholder:text-gray-300 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-suivlima-blue text-white rounded-2xl font-bold shadow-xl shadow-suivlima-blue/20 hover:bg-suivlima-blue-light hover-lift transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                  Se Connecter
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-gray-100">
             <div className="flex items-center gap-3 p-4 bg-suivlima-blue/5 rounded-2xl border border-suivlima-blue/10">
                <ShieldCheck className="text-suivlima-blue" size={20} />
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Connexion sécurisée par cryptage 256-bit. <br/>
                  Accès réservé au personnel autorisé de Suivlima.
                </p>
             </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-gray-400 text-sm font-medium">
          Identifiants démo : <span className="text-suivlima-blue">admin@suivlima.com</span> / <span className="text-suivlima-blue">Admin123!</span>
        </p>
      </div>
    </div>
  );
}
