import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_ITEMS } from "./Sidebar";
import type { Role } from "../types";

export const BottomNav: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    const filteredItems = useMemo(() => {
        if (!user) return [];
        return NAV_ITEMS.filter(item => {
            const hasRole = item.roles.includes(user.role as Role);
            const isUsernameAllowed = item.allowedUsernames ? item.allowedUsernames.includes(user.username) : true;
            return hasRole && isUsernameAllowed;
        });
    }, [user]);

    const activeIndex = filteredItems.findIndex(item => location.pathname === item.path);
    if (!user || activeIndex === -1) return null;

    const itemWidth = 100 / filteredItems.length;

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] lg:hidden w-[92%] max-w-md">
            <div className="relative h-16 flex items-center">
                <div className="absolute inset-0 w-full h-full">
                    <svg
                        viewBox="0 0 400 64"
                        preserveAspectRatio="none"
                        className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
                    >
                        <defs>
                            <mask id="navbar-mask">
                                <rect width="400" height="64" fill="white" rx="32" />
                                <circle
                                    cx={(activeIndex * (400 / filteredItems.length)) + (400 / filteredItems.length / 2)}
                                    cy="0"
                                    r="35"
                                    fill="black"
                                    className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                />
                            </mask>
                        </defs>
                        <rect
                            width="400"
                            height="64"
                            fill="#f9ede1"
                            mask="url(#navbar-mask)"
                            rx="32"
                        />
                    </svg>
                </div>

                <div
                    className="absolute top-0 h-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex justify-center"
                    style={{
                        width: `${itemWidth}%`,
                        left: `${activeIndex * itemWidth}%`,
                    }}
                >
                    <div className="absolute -top-4 w-12 h-12 rounded-full bg-[#ff8200] shadow-[0_8px_20px_rgba(255,130,0,0.4)] flex items-center justify-center z-50">
                        {React.createElement(filteredItems[activeIndex].icon, {
                            size: 22,
                            className: "text-white",
                            strokeWidth: 2.5
                        })}
                    </div>
                </div>

                {filteredItems.map((item, _index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="relative z-10 flex-1 flex items-center justify-center h-full"
                        >
                            <div
                                className={`transition-all duration-500 flex flex-col items-center ${isActive
                                    ? "opacity-0 translate-y-4"
                                    : "text-slate-400"
                                    }`}
                            >
                                <item.icon size={22} strokeWidth={2} />
                            </div>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};