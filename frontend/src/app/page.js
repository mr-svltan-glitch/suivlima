"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  BarChart3, 
  ShieldCheck, 
  Globe, 
  MessageCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-suivlima-blue/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-suivlima-orange/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="hover-lift" />
            <span className="text-2xl font-black tracking-tighter text-suivlima-blue">
              Suiv<span>lima</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <a href="#features" className="text-sm font-bold text-gray-500 hover:text-suivlima-blue transition-colors">Fonctionnalités</a>
            <a href="#market" className="text-sm font-bold text-gray-500 hover:text-suivlima-blue transition-colors">Marché Afrique</a>
            <a href="#pricing" className="text-sm font-bold text-gray-500 hover:text-suivlima-blue transition-colors">Tarifs</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-suivlima-blue hover:text-suivlima-blue-light transition-colors">
              Connexion
            </Link>
            <Link 
              href="/login"
              className="px-6 py-3 bg-suivlima-blue text-white rounded-2xl font-bold text-sm shadow-xl shadow-suivlima-blue/20 hover:bg-suivlima-blue-light hover-lift transition-all"
            >
              Essai Gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-suivlima-blue/5 border border-suivlima-blue/10 rounded-full text-suivlima-blue text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-suivlima-blue rounded-full animate-ping" />
              SaaS n°1 en Afrique de l'Ouest
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-suivlima-blue">
              Arrêtez de <span className="text-suivlima-orange">supplier</span> pour être payé.
            </h1>
            
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
              L'argent dort dehors ? Suivlima automatise vos relances WhatsApp et gère vos dossiers pour que vous puissiez vous concentrer sur la vente.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link 
                href="/login"
                className="group flex items-center justify-center gap-3 px-8 py-5 bg-suivlima-blue text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-suivlima-blue/30 hover:bg-suivlima-blue-light hover-lift transition-all"
              >
                Démarrer Maintenant
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-[2rem] border border-gray-100 shadow-premium">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                      </div>
                    ))}
                 </div>
                 <div className="text-sm">
                    <p className="font-black text-suivlima-blue">+500 marchands</p>
                    <p className="text-gray-400 font-bold">confiants ce mois</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="relative z-10 glass-card p-4 bg-white/40 border-white/60 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
               <Image 
                src="/hero-main.png" 
                alt="Suivlima Visual" 
                width={800} 
                height={600} 
                className="rounded-[1.5rem] shadow-2xl shadow-suivlima-blue/20"
               />
               
               {/* Floating Widgets */}
               <div className="absolute -top-10 -left-10 p-6 bg-white rounded-3xl shadow-premium animate-bounce duration-[3000ms] hidden xl:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">✅</div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase">Relance WhatsApp</p>
                      <p className="text-lg font-black text-suivlima-blue">Payée !</p>
                    </div>
                  </div>
               </div>

               <div className="absolute -bottom-10 -right-10 p-6 bg-white rounded-3xl shadow-premium animate-pulse hidden xl:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">💰</div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase">Trésorerie</p>
                      <p className="text-lg font-black text-suivlima-blue">2.450.000 FCFA</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Market Context Section */}
      <section id="market" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-5xl font-black tracking-tight text-suivlima-blue">
              Conçu pour les réalités du <span className="text-suivlima-orange">terrain</span>.
            </h2>
            <p className="text-lg text-gray-500 font-medium">
              Vendre sur WhatsApp est un métier. Récupérer son argent ne devrait pas l'être.
            </p>
          </div>

          <div className="bento-grid">
            <div className="bento-item bg-suivlima-blue text-white p-10 col-span-1 lg:col-span-2 row-span-2 flex flex-col justify-between">
               <div className="space-y-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">📱</div>
                  <h3 className="text-4xl font-black leading-tight">Le Chaos WhatsApp,<br/>enfin maîtrisé.</h3>
                  <p className="text-lg opacity-70 font-medium">Ne perdez plus aucune commande dans le fil des discussions. Chaque client a son dossier, chaque dossier a son suivi.</p>
               </div>
               <div className="pt-10 flex items-center gap-4">
                  <div className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/20">Dakar</div>
                  <div className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/20">Abidjan</div>
                  <div className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/20">Bamako</div>
               </div>
            </div>

            <div className="bento-item bg-[#F1F5F9] p-10 flex flex-col justify-center gap-6">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">⏳</div>
               <h4 className="text-2xl font-black text-suivlima-blue">Fin du "Je paie demain"</h4>
               <p className="text-gray-500 font-medium">Suivlima relance automatiquement vos clients retardataires via WhatsApp.</p>
            </div>

            <div className="bento-item bg-suivlima-orange/5 border border-suivlima-orange/10 p-10 flex flex-col justify-center gap-6">
               <div className="w-14 h-14 bg-suivlima-orange text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-suivlima-orange/20">💸</div>
               <h4 className="text-2xl font-black text-suivlima-blue">Mobile Money Ready</h4>
               <p className="text-gray-500 font-medium">Suivez les dépôts Orange Money, Wave et Free Money en un clic.</p>
            </div>

            <div className="bento-item bg-white shadow-premium p-10 col-span-1 lg:col-span-2 flex items-center gap-10">
               <div className="hidden sm:flex shrink-0 w-24 h-24 bg-suivlima-blue/5 rounded-full items-center justify-center text-4xl">📈</div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-black text-suivlima-blue">Statistiques en Temps Réel</h4>
                  <p className="text-gray-500 font-medium">Visualisez votre chiffre d'affaires mensuel et annuel instantanément sur votre tableau de bord.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1">
                 <div className="relative glass-card p-6 bg-white/40 border-white/60 shadow-premium -rotate-3 hover:rotate-0 transition-all duration-700">
                    <Image 
                      src="/dashboard-mockup.png" 
                      alt="Interface Suivlima" 
                      width={800} 
                      height={600} 
                      className="rounded-2xl"
                    />
                 </div>
              </div>
              
              <div className="order-1 lg:order-2 space-y-12">
                 <div className="space-y-4">
                    <span className="text-suivlima-orange font-black text-sm uppercase tracking-widest">Technologie</span>
                    <h2 className="text-5xl font-black tracking-tight text-suivlima-blue leading-tight">Le robot qui travaille quand vous dormez.</h2>
                 </div>

                 <div className="space-y-8">
                    {[
                      {
                        title: "Relance WhatsApp Intelligente",
                        desc: "Messages polis et pro envoyés automatiquement aux clients qui n'ont pas encore payé.",
                        icon: <MessageCircle className="text-suivlima-orange" />
                      },
                      {
                        title: "Exports PDF & Excel Pro",
                        desc: "Générez vos listes de clients et rapports financiers en un clic pour votre comptabilité.",
                        icon: <TrendingUp className="text-suivlima-blue" />
                      },
                      {
                        title: "Sécurité de Niveau Bancaire",
                        desc: "Vos données clients sont cryptées et protégées sur nos serveurs haute performance.",
                        icon: <ShieldCheck className="text-suivlima-blue" />
                      }
                    ].map((f, i) => (
                      <div key={i} className="flex gap-6 group">
                         <div className="shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            {f.icon}
                         </div>
                         <div className="space-y-1">
                            <h5 className="text-xl font-black text-suivlima-blue">{f.title}</h5>
                            <p className="text-gray-500 font-medium">{f.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="relative rounded-[3rem] overflow-hidden bg-suivlima-blue p-16 lg:p-24 text-center space-y-10 text-white">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-5xl lg:text-6xl font-black tracking-tight">Prêt à transformer votre business ?</h2>
              <p className="text-xl opacity-80 font-medium">Rejoignez la révolution de la gestion commerciale en Afrique de l'Ouest.</p>
           </div>

           <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/login"
                className="w-full sm:w-auto px-10 py-6 bg-white text-suivlima-blue rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition-all"
              >
                Créer Mon Compte Gratuit
              </Link>
              <p className="text-sm font-bold opacity-60 italic">Sans carte bancaire • Inscription en 2 min</p>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-4 gap-16">
              <div className="col-span-1 md:col-span-2 space-y-8">
                 <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                    <span className="text-3xl font-black tracking-tighter text-suivlima-blue">
                      Suiv<span>lima</span>
                    </span>
                 </div>
                 <p className="text-lg text-gray-400 font-medium max-w-sm">
                   La plateforme tout-en-un qui aide les entrepreneurs africains à sécuriser leur trésorerie et professionnaliser leur gestion.
                 </p>
              </div>
              
              <div className="space-y-6">
                 <h6 className="text-sm font-black uppercase tracking-widest text-suivlima-blue">Produit</h6>
                 <ul className="space-y-4 text-gray-500 font-bold">
                    <li><a href="#" className="hover:text-suivlima-orange transition-colors">Fonctionnalités</a></li>
                    <li><a href="#" className="hover:text-suivlima-orange transition-colors">Tarification</a></li>
                    <li><a href="#" className="hover:text-suivlima-orange transition-colors">Relance WhatsApp</a></li>
                 </ul>
              </div>

              <div className="space-y-6">
                 <h6 className="text-sm font-black uppercase tracking-widest text-suivlima-blue">Légal</h6>
                 <ul className="space-y-4 text-gray-500 font-bold">
                    <li><a href="#" className="hover:text-suivlima-orange transition-colors">Confidentialité</a></li>
                    <li><a href="#" className="hover:text-suivlima-orange transition-colors">CGV</a></li>
                    <li><a href="#" className="hover:text-suivlima-orange transition-colors">Contact</a></li>
                 </ul>
              </div>
           </div>
           
           <div className="mt-20 pt-10 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-sm font-bold text-gray-400">&copy; 2026 Suivlima SaaS. Tous droits réservés.</p>
              <div className="flex items-center gap-8 text-sm font-black text-suivlima-blue">
                 <a href="#" className="hover:text-suivlima-orange transition-colors">Twitter</a>
                 <a href="#" className="hover:text-suivlima-orange transition-colors">LinkedIn</a>
                 <a href="#" className="hover:text-suivlima-orange transition-colors">Facebook</a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
