import {JSX} from "react";
interface NavbarItemsListProps {
    children: JSX.Element[];
}

export default function NavbarItemsList({ children }: NavbarItemsListProps): JSX.Element {
    return (
        <div
            className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
            id="navbarSupportedContent1"
            data-twe-collapse-item>
            <ul
                className="list-style-none me-auto flex flex-col ps-0 lg:flex-row"
                data-twe-navbar-nav-ref>
                {children}
            </ul>
        </div>);
}