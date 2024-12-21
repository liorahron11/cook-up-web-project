import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import Header, {HeaderProps} from "@/app/components/navbar/header";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew"],
  weight: '400'
});

export const metadata: Metadata = {
  title: "CookUp",
  description: "A recipe sharing platform",
};

const headerProps: HeaderProps = {
    userAvatarProps: {
        src: 'https://tecdn.b-cdn.net/img/new/avatars/2.jpg'
    },
    navbarItems: [
        {
            href: "/",
            text: "דף הבית"
        },
        {
            href: "/create-recipe",
            text: "צור מתכון"
        },
    ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he">
      <body className={assistant.className} dir="rtl">
      <Header {...headerProps}></Header>
        {children}
      </body>
    </html>
  );
}
