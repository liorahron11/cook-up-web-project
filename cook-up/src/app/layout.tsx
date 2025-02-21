'use client'

import { Assistant } from "next/font/google";
import "./globals.css";
import Header, {HeaderProps} from "@/app/components/navbar/header";
import { usePathname } from 'next/navigation';
import moment from "moment";
import 'moment/locale/he';

moment.locale('he');
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew"],
  weight: '400'
});

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
const noNavbarRoutes: string[] = ['/login', '/register'];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const isNoNavbarPage: boolean = noNavbarRoutes.includes(usePathname());

    return (
    <html lang="he">
    <head>
        <title>CookUp</title>
    </head>
      <body className={assistant.className} dir="rtl">
      {!isNoNavbarPage && <Header {...headerProps}></Header>}
        {children}
      </body>
    </html>
  );
}
