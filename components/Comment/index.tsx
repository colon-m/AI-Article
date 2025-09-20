import { useState,useEffect } from 'react';
import { Avatar,Input,Button, message,Spin } from 'antd';
import {format} from 'date-fns';
import { useStore } from "store";
import { IuserInfo } from "store/userStore";
import { useComment } from 'hooks/useComment';
import styles from "./index.module.scss"
const comment = ({id}:{id:number})=>{
    const {data, isLoading, error, submit} = useComment(id);
    const [isShowbtn,setIsShowbtn] = useState(false);
    const [isFocus,setIsFocus] = useState(false);
    const [value, setValue] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const {TextArea} = Input;
    const store = useStore();
    const curUser:IuserInfo = store.userStore.userInfo;

    const handleSubmit = async()=>{
        if(!curUser){
            messageApi.warning("请先登录！");
            return;
        }
        const res: any = await submit(curUser.id, value);
        if(res.code === 0){
           messageApi.success("评论成功");
           setValue('');
        }
    }
    useEffect(()=>{
        setIsShowbtn(isFocus || !!value)
    },[isFocus,value])
    return(
        <div className={`${styles.content} centerlayout`}>
            {contextHolder}
            <div className={styles.txt}>
                <span>
                    评论
                </span>
            </div>
            <div className={styles.header}>
                
                <div className={styles.Avatar}>
                    {curUser?.avatar?<Avatar size="large" src={curUser.avatar}></Avatar>
                    :<Avatar size="large" src='/images/default.jpg'></Avatar>}
                </div>
                <div className={styles.editArea}>
                    <TextArea size="large" 
                    value={value}
                    disabled={!(!!curUser?.id)}
                    onFocus={()=>{setIsFocus(true)}}
                    onBlur={()=>setIsFocus(false)}
                    onChange={(e)=>setValue(e.target.value)}
                    className={styles.editor}></TextArea>
                </div>
            </div>
                {isShowbtn&&<div className={styles.submit}>
                <Button className={styles.btn} type="primary" onClick={handleSubmit}>提交</Button>
            </div>}
            {
                data ? data.comments?.map((comment: any) => {
                    return (
                    <div className={styles.comment}>
                        <div className={styles.comAvatar}>
                            <Avatar src={comment.user.avatar} size="large"></Avatar>
                        </div>
                        <div className={styles.mainInfo}>
                            <div className={styles.name}>
                                <span>{comment.user.nickname}</span>
                            </div>
                            <div className={styles.comtxt}>
                                <span>{comment.content}</span>
                            </div>
                            <div className={styles.createTime}>
                                <span>时间：{format(new Date(comment.create_time),'yyyy-MM-dd')}</span>
                            </div>
                        </div>
                    </div>)
                }) : <Spin/>
            }
        </div>)
}
export default comment;