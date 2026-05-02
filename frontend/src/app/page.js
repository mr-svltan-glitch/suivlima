"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  MessageSquare, 
  Shield, 
  Zap, 
  BarChart3, 
  Smartphone,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh text-white selection:bg-suivlima-orange selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-suivlima-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Suiv<span className="text-suivlima-orange">lima</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Produit</a>
            <a href="#automation" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">WhatsApp</a>
            <a href="#pricing" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Tarifs</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              Connexion
            </Link>
            <Link 
              href="/login"
              className="px-6 py-2.5 bg-suivlima-orange text-white rounded-full font-black text-sm shadow-lg shadow-suivlima-orange/20 hover:scale-105 transition-transform"
            >
              Démarrer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full animate-fade-in">
             <span className="w-2 h-2 bg-suivlima-orange rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Le futur du CRM est sur WhatsApp</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-slide-up">
            Vendez. Relancez.<br/>
            <span className="text-gradient-orange">Encaissez.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-medium leading-relaxed animate-slide-up delay-1">
            Suivlima transforme vos conversations WhatsApp en dossiers clients organisés et 
            automatise vos relances pour sécuriser votre trésorerie instantanément.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-slide-up delay-2">
            <Link 
              href="/login"
              className="w-full sm:w-auto px-10 py-5 bg-white text-suivlima-blue rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition-all"
            >
              Essayer Gratuitement
            </Link>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <img key={i} className="w-8 h-8 rounded-full border-2 border-suivlima-bg" src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  ))}
               </div>
               <span>Rejoint par +500 marchands</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="max-w-6xl mx-auto px-6 mt-24 relative animate-fade-in delay-3">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-suivlima-blue/20 blur-[120px] rounded-full -z-10" />
           <div className="glass-card p-4 rounded-[2.5rem] border-white/10 rotate-1 group hover:rotate-0 transition-transform duration-700">
              <Image 
                src="/hero-main.png" 
                alt="Suivlima Dashboard" 
                width={1200} 
                height={800} 
                className="rounded-[2rem] shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-10 -left-10 p-6 glass-card rounded-3xl animate-float hidden lg:block">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-suivlima-orange/10 rounded-2xl flex items-center justify-center text-suivlima-orange">💰</div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Encaissé ce mois</p>
                       <p className="text-xl font-black italic">2.450.000 FCFA</p>
                    </div>
                 </div>
              </div>

              <div className="absolute -bottom-10 -right-10 p-6 glass-card rounded-3xl animate-float delay-1 hidden lg:block">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-suivlima-blue-light/10 rounded-2xl flex items-center justify-center text-suivlima-blue-light">✅</div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp Bot</p>
                       <p className="text-xl font-black italic">Relance effectuée</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </header>

      {/* Bento Grid Features */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">L'outil <span className="text-suivlima-orange">ultime</span> du commerçant.</h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-sm">Maîtrisez votre flux de trésorerie</p>
          </div>

          <div className="bento-grid">
             <div className="lg:col-span-8 bento-item glass-card p-12 flex flex-col justify-between group">
                <div className="space-y-6">
                   <div className="w-16 h-16 bg-suivlima-orange rounded-3xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">📱</div>
                   <h3 className="text-4xl font-black leading-tight">Le Chaos WhatsApp,<br/>enfin dompté.</h3>
                   <p className="max-w-md text-gray-400 font-medium text-lg">Centralisez vos discussions et transformez-les en dossiers structurés. Ne perdez plus jamais une commande dans le fil des messages.</p>
                </div>
                <div className="mt-12 flex flex-wrap gap-4">
                   {['Wave', 'Orange Money', 'Free Money', 'CinetPay'].map(m => (
                     <span key={m} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest">{m}</span>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-4 bento-item bg-suivlima-orange p-10 flex flex-col justify-center gap-8 text-suivlima-blue group">
                <Zap size={60} className="group-hover:scale-125 transition-transform" />
                <div>
                   <h3 className="text-3xl font-black tracking-tighter leading-none mb-4 italic">Relances Automatiques</h3>
                   <p className="font-bold opacity-80">Suivlima relance vos clients via WhatsApp sans que vous n'ayez à bouger le petit doigt.</p>
                </div>
             </div>

             <div className="lg:col-span-4 bento-item glass-card p-10 flex flex-col justify-between group">
                <BarChart3 size={40} className="text-suivlima-orange group-hover:translate-y-[-10px] transition-transform" />
                <div className="space-y-4">
                   <h4 className="text-2xl font-black italic uppercase tracking-tighter">Analytics Pro</h4>
                   <p className="text-gray-400 font-medium">Visualisez vos performances de vente et vos prévisions d'encaissement en temps réel.</p>
                </div>
             </div>

             <div className="lg:col-span-8 bento-item glass-card p-10 flex items-center gap-10 group overflow-hidden">
                <div className="space-y-6 flex-1">
                   <h3 className="text-3xl font-black leading-tight italic uppercase tracking-tighter">Sécurité de niveau Bancaire</h3>
                   <p className="text-gray-400 font-medium">Vos données clients et vos transactions sont cryptées et protégées sur nos serveurs haute performance.</p>
                </div>
                <div className="hidden sm:block shrink-0 rotate-12 translate-x-10 group-hover:translate-x-0 transition-transform">
                   <Lock size={120} className="text-white/10" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6">
           <div className="relative rounded-[3rem] overflow-hidden bg-suivlima-blue p-16 lg:p-24 text-center space-y-10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-suivlima-blue via-suivlima-blue to-suivlima-orange/20 opacity-50" />
              <div className="relative z-10 space-y-6">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">Prêt à encaisser plus ?</h2>
                 <p className="text-xl text-white/70 font-medium max-w-xl mx-auto italic font-bold tracking-widest">REJOIGNEZ LA RÉVOLUTION DU COMMERCE EN AFRIQUE DE L'OUEST</p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                 <Link 
                   href="/login"
                   className="w-full sm:w-auto px-12 py-6 bg-white text-suivlima-blue rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all"
                 >
                   DÉMARRER MAINTENANT
                 </Link>
                 <p className="text-xs font-black text-white/50 uppercase tracking-widest italic">Sans carte bancaire • Inscription 2 min</p>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
                <span className="text-2xl font-black tracking-tighter uppercase italic">
                  Suiv<span className="text-suivlima-orange">lima</span>
                </span>
              </div>
              <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-gray-500">
                 <a href="#" className="hover:text-white transition-colors">Produit</a>
                 <a href="#" className="hover:text-white transition-colors">Tarifs</a>
                 <a href="#" className="hover:text-white transition-colors">Contact</a>
                 <a href="#" className="hover:text-white transition-colors">Légal</a>
              </div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                 &copy; 2026 Suivlima. Tout droits réservés.
              </p>
           </div>
        </div>
      </footer>
    </div>
  );
}
