import React, {RefObject, useRef} from 'react';
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";


export default function PostOptionsButton({editCallback}: {editCallback: () => void}) {
    const optionsMenu: RefObject<any> = useRef(null);
    const items = [
        {
            items: [
                {
                    label: 'עריכה',
                    icon: 'pi pi-pencil',
                    command: editCallback
                }
            ]
        }
    ];


    return <div className="flex flex-row items-center justify-between">
        <Button icon="pi pi-ellipsis-h" rounded text severity="secondary"
            onClick={(event) => optionsMenu?.current.toggle(event)}/>
        <Menu model={items} popup ref={optionsMenu} id="popup_menu" />
    </div>;
};

