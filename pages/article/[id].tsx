import getDatabaseConnection from "db";
import { Article } from "db/entities/article";
import styles from './index.module.scss';
import {format} from 'date-fns';
import Markdown from 'markdown-to-jsx';
import { Avatar,Input,Button, message } from 'antd';
import { EyeOutlined } from "@ant-design/icons";
import { useStore } from "store";
import { useState,useEffect } from "react";
import Link from "next/link";
import { IuserInfo } from "store/userStore";
import fetch from "service/fetch";
import { observer } from "mobx-react-lite";

export const getServerSideProps = async (props : any) =>{
    const id = props.params.id;
    const db = await getDatabaseConnection();
    const articleRep = db.getRepository(Article);
    const article = await articleRep.findOne(
        {
            where:{
                id,
            },
            relations:[
                "user",
                "comments",
                "comments.user"
            ]
        },

    );
    if(article){
        const view = article.view + 1;
        article.view = view;
        articleRep.save(article);
    }
    return {
        props: {
            article: JSON.parse(JSON.stringify(article))
        }
    }
}

const Detail = ({article}: {article:Article})=>{
    const [isShowbtn,setIsShowbtn] = useState(false);
    const [isFocus,setIsFocus] = useState(false);
    const [value, setValue] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const {title,content,user,create_time,update_time,view,comments} = article;
    const {id,nickname,job,avatar} = user;
    const [commentsValue,setcommentsValue] = useState(comments)
    const store = useStore();
    const curUser:IuserInfo = store.userStore.userInfo;
    const {TextArea} = Input;
    useEffect(()=>{
        setIsShowbtn(isFocus || !!value)
    },[isFocus,value])
    const handleSubmit = async()=>{
        console.log("提交")
        const res: any = await fetch.post('/api/comment/publish',{
            content:value,
            article_id: article.id,
            user_id: curUser?.id
        })
        if(res.code === 0){
           messageApi.success("评论成功")
           const newOne = {
            id:0,
            is_deleted:0,
            content: value,
            create_time: new Date(),
            user:{
                ...store.userStore.userInfo!,
            },
            article:{
                ...article
            }
           }
           setcommentsValue([...commentsValue,newOne])
           setValue('')
        }
    }
    return (
        <>
            {contextHolder}
            <div className={`${styles.container} centerlayout`}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h3>{title}</h3>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.avartarArea}>
                            <Avatar size='large' src={avatar} />
                        </div>
                        <div className={styles.right}>
                            <div className={styles.author}>
                                <div className={styles.nickname}>
                                    <span>{nickname}</span>
                                </div>
                                <div className={styles.job}>
                                    <span>{job}</span>
                                </div>
                                {id === store.userStore.userInfo?.id 
                                &&
                                <Link href={`/editor/${article.id}`}> 编辑</Link>
                                }
                            </div>
                            <div className={styles.otherInfo}>
                                <div className={styles.create_time}>
                                    <span>创建时间：{format(new Date(create_time),'yyyy-MM-dd')}</span>
                                </div>
                                <div className={styles.update_time}>
                                    <span>最近更新：{format(new Date(update_time),'yyyy-MM-dd')}</span>
                                </div>
                                <div className={styles.view}>
                                    <EyeOutlined />
                                    <span>{view}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <Markdown>{content}</Markdown>
                    </div>
                </div>
            </div>
            <div className={styles.divider}></div>
            <div className={`${styles.content} centerlayout`}>
                <div className={styles.txt}>
                    <span>
                        评论
                    </span>
                </div>
                <div className={styles.header}>
                    
                    <div className={styles.Avatar}>
                        {curUser?.avatar?<Avatar size="large" src={avatar}></Avatar>
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
                    commentsValue.map((comment: any) => {
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
                    })
                }
            </div>
        </>
    )
}

export default Detail;