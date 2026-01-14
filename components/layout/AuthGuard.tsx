"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, hasProfile, user } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Allow access to login page
        if (pathname === "/login") return;

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        // If authenticated but no usageMode, redirect to onboarding
        // Allow access to onboarding page itself to avoid loop
        if (isAuthenticated && !user?.usageMode && pathname !== "/onboarding") {
            router.push("/onboarding");
        }
    }, [isAuthenticated, pathname, router, user]);

    // If on login or onboarding page, render children
    if (pathname === "/login" || pathname === "/onboarding") {
        return <>{children}</>;
    }

    // If authenticated, render protected content
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // While checking or redirecting, show nothing (or a spinner)
    return null;
}
