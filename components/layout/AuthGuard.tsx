"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, hasProfile } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Allow access to login page
        if (pathname === "/login") return;

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, pathname, router]);

    // If on login page, render children (the login page itself)
    if (pathname === "/login") {
        return <>{children}</>;
    }

    // If authenticated, render protected content
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // While checking or redirecting, show nothing (or a spinner)
    return null;
}
