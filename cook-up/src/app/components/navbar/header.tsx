import React from "react";
import {JSX} from "react";
import NavbarItem, {NavbarItemProps} from "@/app/components/navbar/navbar-item";
import NavbarItemsList from "@/app/components/navbar/navbar-items-list";
import UserAvatar, {UserAvatarProps} from "@/app/components/navbar/user-avatar";

export interface HeaderProps {
    userAvatarProps: UserAvatarProps;
    navbarItems: NavbarItemProps[];
}

export default function Header({userAvatarProps, navbarItems}: HeaderProps): JSX.Element {
    React.useEffect(() => {
        const navbar = document.querySelector('[data-navbar]');
        if (navbar) {
            const navbarHeight = navbar.getBoundingClientRect().height;
            
            document.body.style.paddingTop = `${navbarHeight}px`;
        }
        
        return () => {
            document.body.style.paddingTop = '0';
        };
    }, []);

    return (
        <div 
            data-navbar
            className="fixed top-0 left-0 right-0 z-50 flex-no-wrap flex w-full items-center justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700 lg:flex-wrap lg:justify-start lg:py-4"
        >
            <div className="flex w-full flex-wrap items-center justify-between px-3">
                <a className="mb-4 me-5 ms-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0" href="#">
                <img
                    src="/chef.png"
                    style={{height: "30px"}}
                    alt="CookUp"
                    loading="lazy"/>
                </a>
                
                <NavbarItemsList>
                    {navbarItems.map((item: NavbarItemProps) => <NavbarItem key={item.text} {...item}></NavbarItem>)}
                </NavbarItemsList>
                
                <div className="relative flex items-center">
                    <div className="relative"
                        data-twe-dropdown-ref
                        data-twe-dropdown-alignment="end">
                        <UserAvatar {...userAvatarProps}></UserAvatar>
                    </div>
                </div>
            </div>
        </div>
    );
}