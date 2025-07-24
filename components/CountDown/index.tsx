import { useState,useEffect, use } from "react";
interface CountDownProps {
  time: number;
  onEnd: () => void;
}

const CountDown = ({ time, onEnd }: CountDownProps) => {
    const [count, setCount] = useState(time);
    useEffect(() => {
        const id = setInterval(() => {
            setCount(preCount =>{
                const newCount =  preCount - 1;
                if (newCount <= 0) {
                    clearInterval(id);
                    onEnd();
                    return 0;
                } else {
                    return newCount;
                }
            })
        }, 1000);
        return () => {
            clearInterval(id);
        };
    }, [count]);
    return (
        <div>
            <span>{count}</span>
        </div>
    );
}

export default CountDown;