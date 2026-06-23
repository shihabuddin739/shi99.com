import type { Metadata } from "next";
import "antd/dist/reset.css";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import WelcomeModal from "@/components/WelcomeModal";

export const metadata: Metadata = {
  title: "SHI999",
  description: "SHI999 gaming lobby with premium and pro slot experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
          <WelcomeModal />
        </AppProviders>
      </body>
    </html>
  );
}
