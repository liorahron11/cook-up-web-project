import React, {RefObject, useRef} from 'react';
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";


export default function PostOptionsButton({editCallback, removeCallback}: {editCallback: () => void, removeCallback: () => void}) {
    const optionsMenu: RefObject<any> = useRef(null);
    const items = [
        {
            items: [
                {
                    label: 'עריכה',
                    icon: 'pi pi-pencil',
                    command: editCallback
                },
                {
                    label: 'מחיקה',
                    icon: 'pi pi-trash',
                    command: removeCallback
                },
            ]
        }
    ];


    return <div className="flex flex-row items-center justify-between">
        <Button icon="pi pi-ellipsis-h" rounded text severity="secondary"
            onClick={(event) => optionsMenu?.current.toggle(event)}/>
        <Menu model={items} popup ref={optionsMenu} id="popup_menu" />
    </div>;
};

