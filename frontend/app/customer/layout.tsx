"use client";

import MainLayout from "@/components/layout/MainLayout";
import { withAuth } from "@/components/auth/useAuth";

function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout portal="customer">
      {children}
    </MainLayout>
  );
}

// Wrap export with allowed roles: CUSTOMER/USER, VENDOR, and ADMIN
export default withAuth(CustomerLayout, [ "USER", "VENDOR", "ADMIN"]);