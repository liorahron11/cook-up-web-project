import {JSX} from "react";
export interface UserAvatarProps {
    src: string;
}

export default function UserAvatar({ src }: UserAvatarProps): JSX.Element {
    return (<a
        className="flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
        href="#"
        id="dropdownMenuButton2"
        role="button"
        data-twe-dropdown-toggle-ref
        aria-expanded="false">
        <img
            src={src}
            className="rounded-full"
            style={{height: "25px", width: "25px"}}
            alt=""
            loading="lazy"/>
    </a>);
}
