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
        return <div>Loading...</div>; // Render a loading state while authentication status is checked
    }

    if (!isAuthenticated) {
        return <Signin />; // Render Signin component if not authenticated
    }

    return <>{children}</>; // Render the children if authenticated
}
