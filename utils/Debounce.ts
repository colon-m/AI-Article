
const debounce =(fn: Function, time: number)=>{
    let timer: NodeJS.Timeout | null = null;
    let result:any;
    return (value?:any)=>{
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            result = fn(value);
        }, time);
        return result;
    }
}

export default debounce;