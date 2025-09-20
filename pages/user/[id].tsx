import styles from "./index.module.scss";
import React,{ useEffect,useState } from "react";
import fetch from "service/fetch";
import { useStore } from "store";
import { Avatar,message } from "antd";

import * as ICON from '@ant-design/icons';
import { format } from "date-fns";
import {markdownToTxt} from "markdown-to-txt";
import {uploadFile} from "lib/cos";
import {observer} from "mobx-react-lite"

const User = ()=>{
    const [messageApi,context] = message.useMessage();
    const userStore = useStore().userStore
    const {id,avatar='',nickname,job,introduce} = userStore.userInfo || {};
    const [userAvatar,setAvatar] = useState<string>(avatar);
    const [articles,setArticles] = useState([])
    const [tags,setTags] = useState([])
    useEffect(() => {
        fetch.get('/api/article/get').then((res: any)=>{
            if(res.code === 0){
                setArticles(res.data.articles)
            }
        })
        fetch.get('/api/tag/get').then((res: any)=>{
            if(res.code === 0){
                setTags(res.data.followTags)
            }
        })
    }, []);
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files==null){
            messageApi.info("请选择头像");
            return
        }
        const file = e.target.files[0];
        const result: any = await fetch.get('/api/cos/tempCred');
        if(result.code === 0){
            const {credential,Bucket,Region,StartTime} = result.data;
            const expiredTime = credential.expiredTime;
            const {sessionToken,tmpSecretId,tmpSecretKey} = credential.credentials;
            const uploadRes: any = await uploadFile(tmpSecretId, tmpSecretKey,sessionToken,expiredTime,Bucket,Region,file, id!,StartTime);
            if(uploadRes.err){
                console.log(uploadRes.err);
                return
            }
            const imageUrl = `http://${uploadRes.data.Location}`
            const fetchRes: any = await fetch.post("/api/user/update/avatar",{
                imageUrl
            })
            if(fetchRes.code === 0){
                messageApi.success("更换头像成功");
                setAvatar(imageUrl);
                userStore.setUserInfo({...userStore.userInfo!, avatar:imageUrl})
            }
        }else{
            messageApi.error("连接云端失败")
        }

    }
    return(
        <div className={`${styles.container} centerlayout`}>
            {context}
            <div className={styles.userInfo}>
                <div className={styles.avatar}>
                    <Avatar className={styles.phtoto} size={60} src={userAvatar}></Avatar>
                    <div className={styles.modify}>
                        <label htmlFor="updateAva" className={styles.proxy}>修改头像</label>
                        <input id="updateAva" type="file" name={id+''} className={styles.update} accept=".jpg, .jpeg, .png" multiple={false} onChange={handleFileSelect}/>
                    </div>
                </div>
                <div className={styles.others}>
                    <div className={styles.head}>
                        <div className={styles.nickname}>
                            <span>{nickname}</span>
                        </div>
                        <div className={styles.job}>
                            <span>{job}</span>
                        </div>
                        <div className={styles.modify}><span>修改个人信息</span></div>
                    </div>
                    <div className={styles.introduce}>
                        <span>个人介绍：{introduce}</span>
                    </div>
                    <div className={styles.tagArea}>
                        <div className={styles.txt}><span>标签:</span></div>
                        <div className={styles.tags}>
                            {tags.map((tag: any)=>{
                                return (
                                    <div className={styles.item} key={tag.id}>
                                        <div className={styles.icon}>{(ICON as any)[tag.icon].render()}</div>
                                        <div className={styles.txt}>{tag.title}</div>
                                    </div>
                                )
                            })}
                        </div>

                    </div> 
                </div>
            </div>
            <div className={styles.listTxt}><h2>文章</h2></div>
            <div className={styles.articles}>
                {articles.map((article: any) =>{
                    return (
                        <div className={styles.article} key={article.id}>
                            <div className={styles.title}><h4>标题：{article.title}</h4></div>
                            <div className={styles.content}><span>{markdownToTxt(article.content)}</span></div>
                            <div className={styles.bottom}>
                                <div className={styles.createTime}><span>创建时间：{format(new Date(article.create_time),'yyyy-MM-dd')}</span></div>
                                <div className={styles.updateTime}><span>近期修改：{format(new Date(article.update_time),'yyyy-MM-dd')}</span></div>
                                <div className={styles.visit}><span>浏览人数：{article.view}</span></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default observer(User);