import { LoginForm } from '../features/auth/components/LoginForm';

export const LoginPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-4 md:p-10">
            <div className="flex w-full max-w-[850px] 2xl:max-w-[1100px] min-h-[550px] 2xl:min-h-[700px] bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-200 rounded-sm overflow-hidden transition-all duration-500">

                <div className="hidden md:flex md:w-5/12 bg-slate-900 p-10 2xl:p-16 flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff8200] opacity-10 blur-[120px] -mr-48 -mt-48" />

                    <div className="relative z-10 bg-white/10 w-16 h-16 2xl:w-24 2xl:h-24 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-12 2xl:mb-20">
                        <img src="/favicon.png" alt="Logo" className="w-10 h-10 2xl:w-16 2xl:h-16 object-contain" />
                    </div>

                    <div className="relative z-10 flex flex-col">
                        <h2 className="text-white text-3xl 2xl:text-5xl font-black uppercase leading-[0.9] tracking-tighter">
                            Sistema de Gestión <br />
                            <span className="text-[#ff8200]">Boleto Escolar <br />Docente</span>
                        </h2>
                        
                        <div className="h-1.5 w-16 bg-[#ff8200] mt-8 opacity-70" />

                        <p className="text-slate-400 text-lg 2xl:text-2xl font-medium leading-relaxed max-w-[280px] 2xl:max-w-[400px] mt-16 2xl:mt-24 border-l-4 border-slate-800 pl-6">
                            Acceda a la plataforma administrativa de la Secretaría de Tránsito y Transporte.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-7/12 flex flex-col relative bg-white">
                    <div className="h-2 w-full bg-[#ff8200]" />

                    <div className="flex-1 p-8 md:p-16 2xl:p-24 flex flex-col justify-center transition-all">
                        <div className="text-center space-y-10 2xl:space-y-16">
                            <img
                                src="/stt_banner.png"
                                alt="Secretaría de Tránsito y Transporte"
                                className="h-14 2xl:h-24 mx-auto object-contain"
                            />

                            <div className="space-y-3">
                                <h1 className="text-2xl 2xl:text-4xl font-black text-slate-800 uppercase tracking-tight">
                                    Iniciar Sesión
                                </h1>
                                <p className="text-[10px] 2xl:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                                    Credenciales del Personal Administrativo
                                </p>
                            </div>

                            <div className="max-w-[320px] 2xl:max-w-[450px] mx-auto w-full pt-4 2xl:scale-110">
                                <LoginForm />
                            </div>
                        </div>
                    </div>

                    <footer className="p-8 2xl:p-12 border-t border-slate-50 text-center md:text-right">
                        <p className="text-[10px] 2xl:text-xs font-black text-slate-300 uppercase tracking-[0.3em]">
                            Gobierno de San Juan • Sistema v1.2.0
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};