import {JSX} from "react";
export interface NavbarItemProps {
    text: string;
    href: string;
}

export default function NavbarItem({ text, href }: NavbarItemProps): JSX.Element {
    return (<li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
            <a className="text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
                href={href}
                data-twe-nav-link-ref>
                {text}
            </a>
        </li>);
}
