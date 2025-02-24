"use client";

import { useEffect, useState } from "react";
import Signin from "@/components/Signin";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authtoken");
        if (token) {
            setIsAuthenticated(true);
            router.push("/"); // Perform navigation as a side effect
        } else {
            setIsAuthenticated(false);
            router.push("/signin");
        }
    }, [router]);

    if (isAuthenticated === null) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                {/* Animated Loader */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute w-24 h-24 border-4 border-[#C4A484] border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute w-16 h-16 border-4 border-[#857B74] border-t-transparent rounded-full animate-spin-slow"></div>
                    <span className="text-[#C4A484] font-bold text-2xl tracking-wide">M</span>
                </div>
                <p className="mt-6 text-[#857B74] text-lg font-semibold tracking-wide">
                    Elevating Your Style at
                    <span className="text-[#C4A484] font-bold"> Merri Store</span>...
                </p>
                <p className="mt-2 text-sm text-gray-500 opacity-80 animate-fade-in">
                    Just a moment, fashion takes time.
                </p>
            </div>
        );

    }

    if (!isAuthenticated) {
        return <Signin />; // Render Signin component if not authenticated
    }

    return <>{children}</>; // Render the children if authenticated
}
