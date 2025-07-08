'use client';
import { RestaurantLayoutProvider } from '@/lib/context/super-admin/layout-restaurant.context';
import SUPER_ADMIN_GUARD from '@/lib/hoc/SUPER_ADMIN_GUARD';
// Layout
import SuperAdminLayout from '@/lib/ui/layouts/protected/super-admin';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ProtectedLayout = SUPER_ADMIN_GUARD(
    ({ children }: { children: React.ReactNode }) => {
      return <SuperAdminLayout>
          <RestaurantLayoutProvider>
            {children}
          </RestaurantLayoutProvider>
        </SuperAdminLayout>;
    }
  );

  return <ProtectedLayout>{children}</ProtectedLayout>;
}
