import styles from './index.module.scss'
import { FloatButton,Input,Button, message} from 'antd';
import {RobotFilled,UpOutlined } from '@ant-design/icons';
import { useState,useRef, ChangeEvent, useEffect } from 'react';
import fetch,{sseRequest} from 'service/fetch';
const { TextArea } = Input;
interface Imessage{
    role: string,
    content: string
}
export const AiChat = ()=>{
    const [isShowWindow, setShowWindow] = useState<boolean>(false);
    const [messages,setMessages] = useState<Imessage[]>([]);
    const [userContent,setUserContent] = useState<string>('');
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const dis = useRef({x:0,y:0});
    const handleSubmit = async () => {
        if (!userContent) return;

        const temp = userContent;
        const userMessage = {
            role: "user",
            content: userContent
        };

        // 添加用户消息
        setMessages((preValue) => [...preValue, userMessage]);
        setUserContent("");

        // 创建助手消息
        const assistantId = Date.now();
        setMessages((preValue) => [...preValue, { 
            role: "assistant", 
            content: "", 
            id: assistantId 
        }]);

         try {
            await sseRequest(
                fetch,
                {
                    method: 'POST',
                    url: '/api/chat/globalChat',
                    data: { message: temp },
                },
                {
                    onData: (newContent) => {
                    // 直接追加新内容到助手消息
                    setMessages(preValue => preValue.map((msg: any) => 
                        msg.id === assistantId 
                        ? { ...msg, content: msg.content + newContent } 
                        : msg
                    ));
                    },
                    onComplete: () => {
                    console.log("流式响应完成");
                    },
                    onError: (error) => {
                    console.error("请求失败:", error);
                    setMessages(preValue => preValue.map((msg: any) => 
                        msg.id === assistantId 
                        ? { ...msg, content: msg.content + "\n\n抱歉，请求失败了 😢" } 
                        : msg
                    ));
                    }
                }
                );
            } catch (error) {
                console.error("请求初始化失败:", error);
                setMessages(preValue => preValue.map((msg: any) => 
                msg.id === assistantId 
                    ? { ...msg, content: "请求初始化失败" } 
                    : msg
                ));
            }
        };

    const handleTxtChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setUserContent(e.target.value)
    }
    const handleMouseDown = (e:React.MouseEvent<HTMLDivElement>)=>{
         if (e.target !== chatWindowRef.current) {
            return;
        }
        const el = chatWindowRef.current!;
        const rect = el.getBoundingClientRect();
        dis.current.x =  e.clientX - rect.left;
        dis.current.y = e.clientY - rect.top;
    
        el.style.transform = 'none'; 
        el.style.left = rect.left + 'px'; 
        el.style.top = rect.top + 'px';
        el.style.userSelect = 'none';
        el.addEventListener("mousemove",handleMousemove);
        el.addEventListener("mouseup",handleMouseUp)
    }
    const handleMousemove = (e:MouseEvent)=>{
        const left = e.clientX - dis.current.x;
        const top = e.clientY - dis.current.y;
        chatWindowRef.current!.style.left = Math.min(Math.max(left,0), window.innerWidth-chatWindowRef.current!.offsetWidth) +'px';
        chatWindowRef.current!.style.top = Math.min(Math.max( top,0), window.innerHeight-chatWindowRef.current!.offsetHeight) +'px';
    };
    const handleMouseUp = ()=>{
        chatWindowRef.current!.removeEventListener("mousemove",handleMousemove);
        chatWindowRef.current!.removeEventListener("mouseup",handleMouseUp);
        chatWindowRef.current!.style.userSelect = 'auto';
    }
    return (<>
        <FloatButton.Group trigger="click" type="primary" shape="square" placement='top' icon={<UpOutlined  />}>
            <FloatButton onClick={()=>setShowWindow(!isShowWindow)} type="primary" shape="square" icon={<RobotFilled />}/>
        </FloatButton.Group>
        {isShowWindow && 
        <div ref={chatWindowRef} className={styles.window} onMouseDown={handleMouseDown}>
            <div className={styles.chatArea} >
                {messages.map((message:Imessage,index)=>{
                    return (<div key={index} className={`${message.role === "user" ? styles.userRecord : styles.assiRecord}`}>
                        <div className={styles.warp}>{message.content}</div>
                    </div>)
                })}
            </div>
            <div className={styles.inputArea}>
                <TextArea className={styles.input} value={userContent} onChange={handleTxtChange}/>
                <Button className={styles.btn} type="primary" onClick={handleSubmit}>发送</Button>    
            </div>
        </div>}
    </>)
    
}