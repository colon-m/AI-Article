import { useRef } from "react";
export function useElement (){
    const elements= useRef< HTMLDivElement []|null >([]);
    const addElement = (el:HTMLDivElement )=>{
        if(el && elements.current && !elements.current.includes(el)){
            elements.current.push(el)
        }
    }
    return {elements,addElement}
}