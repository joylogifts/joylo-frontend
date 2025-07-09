'use client';

import { LanguageManagementProvider } from '@/lib/context/super-admin/language-management.context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LanguageManagementProvider>{children}</LanguageManagementProvider>;
}
