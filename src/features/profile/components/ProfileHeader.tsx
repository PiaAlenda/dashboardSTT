import { Fingerprint } from 'lucide-react';

interface ProfileHeaderProps {
    firstName: string;
    lastName: string;
    role: string;
    dni: string;
}

export const ProfileHeader = ({ firstName, lastName, role, dni }: ProfileHeaderProps) => (
    <div className="relative bg-white rounded-[3rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="h-28 w-28 md:h-32 md:w-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-slate-900/20 border-4 border-white transition-transform group-hover:rotate-3">
                {firstName?.charAt(0)}
            </div>

            <div className="flex flex-col items-center md:items-start space-y-3">
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border 
                        ${role === 'ROLE_SUPER_ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {role.replace('ROLE_', '')}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <Fingerprint size={14} className="text-slate-400" />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{dni}</span>
                    </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter leading-none">
                    {firstName} <span className="text-orange-500">{lastName}</span>
                </h1>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Perfil de Usuario Autorizado
                </p>
            </div>
        </div>
    </div>
);