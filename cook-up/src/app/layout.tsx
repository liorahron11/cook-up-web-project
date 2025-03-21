'use client'

import React from "react";
import { Assistant } from "next/font/google";
import "./globals.css";
import Header, {HeaderProps} from "@/app/components/navbar/header";
import { usePathname } from 'next/navigation';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import {createGlobalStyle} from "styled-components";
import {getUserFromLocalStorage,} from "@/app/services/local-storage.service";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew"],
  weight: '400'
});
const currentStoredUser = getUserFromLocalStorage();

const headerProps: HeaderProps = {
    userAvatarProps: {
        src: `${currentStoredUser?.profilePictureUrl}`
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
const GlobalStyle = createGlobalStyle`
  .p-tooltip {
      font-family: Assistant, sans-serif;
    font-size: 14px;
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const isNoNavbarPage: boolean = noNavbarRoutes.includes(usePathname());

    return (
      <GoogleOAuthProvider
      clientId="195091915679-n2245brh5hqob9ts9bhbbulg6n4vmkjl.apps.googleusercontent.com"
      >
    <html lang="he">
    <head>
        <title>CookUp</title>
        <script
            dangerouslySetInnerHTML={{
                __html: `
              const style = document.createElement('style')
              style.innerHTML = '@layer tailwind-base, primereact, tailwind-utilities;'
              style.setAttribute('type', 'text/css')
              document.querySelector('head').prepend(style)
            `,
            }}
        />
    </head>
      <body className={assistant.className} dir="rtl">
      <GlobalStyle/>
      <PrimeReactProvider>
          {!isNoNavbarPage && <Header {...headerProps}></Header>}
          {children}
      </PrimeReactProvider>
      </body>
    </html>
    </GoogleOAuthProvider>
  );
}
