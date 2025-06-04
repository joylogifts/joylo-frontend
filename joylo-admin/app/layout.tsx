import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";


export const metadata = {
  title: "Joylo dashboard",
  icons: {
    icon: "/favicon.png",
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
