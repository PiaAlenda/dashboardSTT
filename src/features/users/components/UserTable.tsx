import { Mail, Clock, RotateCcw, Trash2, User as UserIcon, MoreVertical, Fingerprint } from 'lucide-react';

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
            {/* Header */}
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

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {users.map((u) => (
                    <div 
                        key={u.id} 
                        className={`relative p-6 rounded-[2.5rem] border transition-all duration-300 bg-white border-1 border-orange-300
                            ${u.deleted 
                                ? 'border-red-100 bg-red-50/30' 
                                : 'border-slate-100 hover:border-orange-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/50'}`}
                    >
                        {u.deleted && (
                            <div className="absolute top-5 right-5">
                                <span className="bg-red-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm">Archivado</span>
                            </div>
                        )}

                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className={`relative h-14 w-14 flex items-center justify-center rounded-2xl font-black text-lg transition-transform group-hover:scale-105
                                ${u.deleted ? 'bg-red-100 text-red-400' : 'bg-slate-900 text-white shadow-lg shadow-slate-200'}`}>
                                {u.firstName?.charAt(0)}
                                {!u.deleted && (
                                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                                )}
                            </div>

                            {/* Información Principal */}
                            <div className="space-y-1">
                                <h3 className={`font-black uppercase tracking-tight text-[13px] leading-tight
                                    ${u.deleted ? 'text-red-800' : 'text-slate-800'}`}>
                                    {u.firstName} {u.lastName}
                                </h3>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest
                                        ${u.role === 'ROLE_SUPER_ADMIN' ? 'bg-orange-100/50 text-orange-600' : 
                                          u.role === 'ROLE_ADMIN' ? 'bg-purple-100/50 text-purple-600' : 
                                          'bg-blue-100/50 text-blue-600'}`}>
                                        {u.role?.replace('ROLE_', '')}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                        <Fingerprint size={10} className="opacity-50" /> {u.dni}
                                    </span>
                                </div>
                            </div>

                            {/* Info de contacto */}
                            <div className="w-full bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                                <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-500 truncate">
                                    <Mail size={11} className="text-orange-400" />
                                    {u.email}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-1 pt-1 w-full justify-center">
                                {isSuperAdmin && (
                                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                                        <button
                                            onClick={() => onViewHistory(u.dni)}
                                            className="p-1.5 text-slate-400 hover:text-orange-500 transition-all"
                                        >
                                            <Clock size={15} />
                                        </button>

                                        {u.deleted ? (
                                            <button
                                                onClick={() => onReactivate(u.dni)}
                                                className="p-1.5 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-all shadow-sm"
                                            >
                                                <RotateCcw size={15} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { if (confirm('¿Eliminar?')) onDelete(u.dni) }}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                <button className="p-1.5 text-slate-300 hover:text-slate-800 transition-colors">
                                    <MoreVertical size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};