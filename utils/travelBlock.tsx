import type { ReactNode } from "react";

export default function travelBlock(el: string | ReactNode | undefined):string {
    if(typeof el === 'undefined' || el == null){
        return '';
    }
    if(typeof el === 'string'){
        return el;
    }

    const children = (el as any).props.children;
    if (Array.isArray(children)) {
        const str = children.map((item)=>travelBlock(item)).join('');
        return str;
    }else{
        return travelBlock(children);
    }
}
