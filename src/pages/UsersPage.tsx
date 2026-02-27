import React from 'react';
import { Search, UserPlus, Users2, FilterX } from 'lucide-react';
import { useUsers } from '../features/users/hooks/useUsers';
import { UserTable } from '../features/users/components/UserTable';
import { UserCreateForm } from '../features/users/components/UserCreateForm';
import { UserHistoryModal } from '../features/users/components/UserHistoryModal';
import { UserDeleteModal } from '../features/users/components/UserDeleteModal';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

export const UsersPage: React.FC = () => {
    const {
        users, isLoading,
        searchTerm, setSearchTerm,
        isModalOpen, setIsModalOpen,
        handleCloseModal,
        historyUserDni, setHistoryUserDni,
        dniToDelete, setDniToDelete,
        showDeleted, setShowDeleted,
        formData, setFormData,
        isSuperAdmin,
        history, isLoadingHistory,
        deleteMutation,
        reactivateMutation,
        handleSubmit,
        createMutation
    } = useUsers();

    if (isLoading) {
        return <LoadingOverlay message="Sincronizando Base de Usuarios..." />;
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10">
            <header className="px-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-[#ff8200] shadow-lg shadow-slate-200">
                        <Users2 size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl 2xl:text-4xl font-black text-slate-800 tracking-tight">
                            Gestión de <span className="text-[#ff8200]">Personal</span>
                        </h1>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Panel de control de usuarios y permisos
                        </p>
                    </div>
                </div>
            </header>

            {/* BARRA DE ACCIONES  */}
            <section className="flex flex-col sm:flex-row items-center gap-4 px-2">

                <div className="relative group flex-1 w-full max-w-2xl">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff8200] transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido, DNI..."
                        className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition-all focus:border-[#ff8200] focus:ring-4 focus:ring-orange-500/5 placeholder:text-slate-300 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* BOTÓN NUEVO USUARIO */}
                {isSuperAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-3 rounded-2xl bg-slate-900 text-white transition-all hover:bg-[#ff8200] active:scale-95 shadow-lg shadow-slate-200 hover:shadow-orange-200/40
                                   h-[54px] w-full sm:w-auto sm:px-8 shrink-0 group"
                        title="Nuevo Usuario"
                    >
                        <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-widest">
                            Nuevo Usuario
                        </span>
                    </button>
                )}
            </section>

            <main className="min-h-[450px]">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <UserTable
                        users={users}
                        isSuperAdmin={isSuperAdmin}
                        showDeleted={showDeleted}
                        onToggleShowDeleted={setShowDeleted}
                        onViewHistory={setHistoryUserDni}
                        onDelete={setDniToDelete}
                        onReactivate={(dni: string) => reactivateMutation.mutate(dni)}
                    />
                </div>

                {users.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 mx-2 mt-4 animate-in zoom-in-95 duration-500">
                        <div className="p-6 bg-slate-50 rounded-full mb-6">
                            <FilterX size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">Sin resultados</h3>
                        <p className="text-[11px] text-slate-300 font-bold mt-2 uppercase tracking-widest">
                            No se encontraron usuarios activos o con ese criterio
                        </p>
                    </div>
                )}
            </main>

            {/* MODALES */}
            <UserCreateForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                isSubmitting={createMutation.isPending}
            />

            <UserHistoryModal
                isOpen={!!historyUserDni}
                onClose={() => setHistoryUserDni(null)}
                history={history as any[]}
                isLoading={isLoadingHistory}
            />

            <UserDeleteModal
                isOpen={!!dniToDelete}
                onClose={() => setDniToDelete(null)}
                dni={dniToDelete}
                onConfirm={(dni: string) => deleteMutation.mutate(dni)}
            />
        </div>
    );
};