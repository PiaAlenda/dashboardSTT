import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row">
            <Sidebar />

            <div className="flex-1 min-w-0 flex flex-col relative">
                <Header />

                <main className="p-4 md:p-10 2xl:p-16 flex-1 pb-32 lg:pb-16">
                    <div className="max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>

                <BottomNav />
            </div>
        </div>
    );
};
