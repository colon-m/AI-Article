import { User, Article } from "db/entities";
import * as ICON from '@ant-design/icons';
import { Tabs,message } from 'antd';
import { useStore } from "store";
import React, { useState,useEffect } from "react";
import fetch from "@/service/fetch";
import styles from "./index.module.scss";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import type { TabsProps } from 'antd';
const { TabPane } = Tabs;

export interface Itag {
  id: number,
  icon: string,
  title: string,
  follow_count: number,
  article_count: number,
  users: User[],
  articles: Article[]
}

const label = () => {
  const [followTags,setFollowTags] = useState<Itag[]>();
  const [allTags,setAllTags] = useState<Itag[]>();
  const [flush,setFlush] = useState<Boolean>(true);
  const store = useStore();
  const [messageApi,content] =message.useMessage()

  const id = store.userStore.userInfo?.id;
  useEffect(()=>{
    fetch.get('/api/tag/get').then((res:any)=>{
      if(res.code === 0){
        const {followTags = [],allTags =[]} = res.data;
        setFollowTags(followTags);
        setAllTags(allTags);
      }
    })
  },[flush]);
  const handleUnfollow = async (id:number)=>{
    const result: any = await fetch.post('/api/tag/follow',{
      type: "unfollow",
      id,
    })
    if(result.code === 0){
      messageApi.success("取关成功");
      setFlush(!flush)
    }
  }
  const handleFollow = async (id:number)=>{
    const result: any = await fetch.post('/api/tag/follow',{
      type: "follow",
      id,
    })
    if(result.code === 0){
      messageApi.success("关注成功");
      setFlush(!flush)
    }
  }
  const children = (Tags:Itag[] | undefined)=>(
      <div className={styles.body}>
        {Tags?.map((tag:Itag)=>{
          return (
            <div className={styles.item} key={tag.id}>
              <div className={styles.icon}>{(ICON as any)[tag.icon]?.render()}</div>
              <div className={styles.title}>{tag.title}</div>
              <div className={styles.follow}>
                {tag.follow_count} <span>关注</span>
                &nbsp;{tag.article_count} <span>文章</span>
              </div>
              <div className={styles.concern}>
                {tag.users?.find((item)=>item.id===id)
                ?
                <Button type="primary" onClick={()=>handleUnfollow(tag.id)}>已关注</Button>
                :
                <Button type="primary" onClick={()=>handleFollow(tag.id)}>关注</Button>}
              </div>
            </div>)
        })}
      </div>);
  const items: TabsProps['items'] = [
  {
    key: '1',
    label: '已关注',
    children: children(followTags),
  },
  {
    key: '2',
    label: '全部标签',
    children: children(allTags),
  },
];
  return (
    <>
      {content}
      <Tabs
        className={`${styles.container} centerlayout`}
        centered
        defaultActiveKey="1"
        items={items}
      />
    </>

  )
}

export default observer(label);
