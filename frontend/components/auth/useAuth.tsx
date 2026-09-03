'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Role = 'USER' | 'VENDOR' | 'ADMIN';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: Role[]
) {
  return function ProtectedComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Wait for AuthContext session hydration to complete before evaluating access
      if (isLoading) return;

      // Unauthenticated users -> Redirect to Login
      if (!user) {
        router.replace('/login');
        return;
      }
      if (!allowedRoles && user.role === 'ADMIN') {
        router.replace('/admin/dashboard');
        return;
      }
      // Role mismatch -> Redirect to user's assigned dashboard
      if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
        const fallbackRoute =
          user.role === 'VENDOR' ? '/vendor/dashboard' : '/customer/dashboard';
        router.replace(fallbackRoute);
      }
    }, [user, isLoading, router]);

    // Render loading state while checking credentials
    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">Authenticating session...</p>
        </div>
      );
    }

    // Block UI rendering during route redirection
    if (!user || (allowedRoles && !allowedRoles.includes(user.role as Role))) {
      return null;
    }

    return <Component {...props} />;
  };
}