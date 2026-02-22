import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight, Server } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="w-full h-auto min-h-[80px] md:h-24 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between px-6 md:px-8 py-4 sm:py-0 shadow-sm gap-4 transition-all">
        {/* Banner */}
        <div className="flex justify-center sm:justify-start">
          <a href="https://sj.sanjuan.gob.ar/" target="_blank" rel="noopener noreferrer">
            <img
              src="/stt_banner.png"
              alt="Secretaría de Tránsito y Transporte"
              className="h-10 md:h-16 object-contain"
            />
          </a>
        </div>

        {/* Botón*/}
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <button
            onClick={() => navigate('/auth/x82b9')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-[#ff8200] hover:text-[#ff8200] active:scale-95 shadow-sm"
          >
            <LogIn size={18} />
            Acceso Personal
          </button>
        </div>
      </header>


      {/* Contenido Principal */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-slate-200/60 border border-slate-100">
          <div className="h-2 bg-[#ff8200]" />

          <div className="p-8 md:p-12 text-center space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Sistema de la Secretaría de Tránsito y Transporte
              </h1>

              <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
                <Server size={16} className="text-green-500 animate-pulse" />
                <p className="text-sm">Servidor de backend activo y procesando solicitudes.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => window.location.href = 'https://boletoescolar.sanjuan.gob.ar/'}
                className="group flex items-center justify-center gap-3 w-full sm:w-auto mx-auto rounded-2xl bg-[#ff8200] px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#e67500] hover:shadow-xl hover:shadow-orange-200 active:scale-[0.98]"
              >
                Ir a Boleto Escolar
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#333e48] py-8 text-center text-white">
        <div className="space-y-2">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Gobierno de San Juan</p>
          <p className="text-[10px] opacity-50 font-medium">
            © {new Date().getFullYear()} Secretaría de Tránsito y Transporte - v1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
};