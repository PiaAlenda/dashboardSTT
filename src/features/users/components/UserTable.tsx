import { Mail, Clock, RotateCcw, Trash2, User as UserIcon, Fingerprint } from 'lucide-react';

interface UserTableProps {
    users: any[];
    isSuperAdmin: boolean;
    showDeleted: boolean;
    onToggleShowDeleted: (checked: boolean) => void;
    onViewHistory: (dni: string) => void;
    onDelete: (dni: string) => void;
    onReactivate: (dni: string) => void;
}

export const UserTable = ({
    users,
    isSuperAdmin,
    showDeleted,
    onToggleShowDeleted,
    onViewHistory,
    onDelete,
    onReactivate
}: UserTableProps) => {
    return (
        <div className="space-y-6">

            {/* --- HEADER --- */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <UserIcon size={14} className="text-[#ff8200]" />
                    Personal Registrado ({users.length})
                </h2>

                <label className="flex items-center gap-3 cursor-pointer group bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-red-200 transition-all">
                    <span className={`text-[10px] font-black uppercase tracking-tight transition-colors ${showDeleted ? 'text-red-500' : 'text-slate-500'}`}>
                        Ver Usuarios Eliminados
                    </span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={showDeleted}
                            onChange={(e) => onToggleShowDeleted(e.target.checked)}
                        />
                        <div className="h-5 w-9 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full shadow-inner" />
                    </div>
                </label>
            </div>

            {/* --- GRID DE CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {users.map((u) => (
                    <div
                        key={u.id}
                        className={`relative p-6 rounded-[2.5rem] border transition-all duration-300 bg-white
                            ${u.deleted
                                ? 'border-red-100 bg-red-50/30 grayscale opacity-80'
                                : 'border-slate-100 hover:border-orange-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10'}`}
                    >
                        {u.deleted && (
                            <div className="absolute top-6 right-6">
                                <span className="bg-red-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm tracking-widest">Archivado</span>
                            </div>
                        )}

                        <div className="flex flex-col items-center text-center space-y-4">
                            {/* Avatar */}
                            <div className={`relative h-16 w-16 flex items-center justify-center rounded-[1.5rem] font-black text-xl transition-transform
                                ${u.deleted ? 'bg-red-100 text-red-400' : 'bg-slate-900 text-white shadow-xl shadow-slate-200'}`}>
                                {u.firstName?.charAt(0)}
                                {!u.deleted && (
                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-4 border-white rounded-full" />
                                )}
                            </div>

                            {/* Info Principal */}
                            <div className="space-y-1">
                                <h3 className={`font-black uppercase tracking-tight text-[13px] leading-tight
                                    ${u.deleted ? 'text-red-800' : 'text-slate-800'}`}>
                                    {u.firstName} {u.lastName}
                                </h3>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest
                                        ${u.role === 'ROLE_SUPER_ADMIN' ? 'bg-orange-100 text-orange-600' :
                                            u.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-600' :
                                                'bg-blue-100 text-blue-600'}`}>
                                        {u.role?.replace('ROLE_', '')}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                        <Fingerprint size={10} className="opacity-50" /> {u.dni}
                                    </span>
                                </div>
                            </div>

                            {/* Info de contacto */}
                            <div className="w-full bg-slate-50 p-3 rounded-[1.5rem] border border-slate-100 group">
                                <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-500 truncate lowercase">
                                    <Mail size={12} className="text-[#ff8200]" />
                                    {u.email}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-2 pt-1 w-full justify-center">
                                {isSuperAdmin && (
                                    <div className="flex items-center gap-1 bg-white p-1 rounded-[1.2rem] border border-slate-100 shadow-sm">
                                        <button
                                            onClick={() => onViewHistory(u.dni)}
                                            className="p-2 text-slate-400 hover:text-[#ff8200] hover:bg-orange-50 rounded-xl transition-all"
                                            title="Historial"
                                        >
                                            <Clock size={16} />
                                        </button>



                                        {u.deleted ? (
                                            <button
                                                onClick={() => onReactivate(u.dni)}
                                                className="p-2 bg-green-500 rounded-xl text-white hover:bg-slate-900 transition-all shadow-md"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onDelete(u.dni)} // Acción directa sin alert ni modal local
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};