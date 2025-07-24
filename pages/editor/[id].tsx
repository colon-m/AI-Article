import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import styles from "./index.module.scss"
import dynamic from "next/dynamic";
import { useState } from "react";
import { Input,Button,message,Select, Space } from "antd";
import * as ICON from "@ant-design/icons";
import fetch from "service/fetch";
import { useRouter } from "next/router";
import getDatabaseConnection from "db";
import { Article } from "db/entities/article";
import { Tag } from "db/entities";


const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);
interface Iresponse {
  code: number;
  msg: string;
  data?: any;
}
export async function getServerSideProps(props: any) {
    const id = props.params.id;
    const db = await getDatabaseConnection();
    const articleRep = db.getRepository(Article);
    const tagRep = db.getRepository(Tag);
    const article = await articleRep.findOne(
        {
            where:{
                id,
            },
            relations:[
                "user",
                "tags"
            ]
        },
    );
    const tags = await tagRep.find();
    return {
        props: {
            article: JSON.parse(JSON.stringify(article)),
            tags: JSON.parse(JSON.stringify(tags))
        }
    }
}
const Update = ({article,tags}:{article:Article,tags:Tag[]}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [value, setValue] = useState(`${article.content}`);
  const [title, setTitle] = useState<string>(`${article.title}`);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const defaultTag = article.tags.map(tag=>tag.title);
  const handleSetTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const handleSubmit = async()=>{
    console.log("进入提交")
    console.log("title:",title)
    if(!title){
      messageApi.open({
        type: 'warning',
        content: '标题不能为空',
      });
      return
    }else{
      const res:Iresponse = await fetch.post('/api/article/update',{
        id: article.id,
        title,
        content: value,
        tagsName: selectedTags
      })
      if(res.code === 0){
        message.success(res.msg)
        router.push(`/article/${article.id}`)
      }else{
        message.error(res.msg)
      }
    }
  }
  const handlesetValue = (content: any)=> {
    setValue(content)
  };
  const handleChange = (value: string[]) => {
  setSelectedTags(value)
  };
  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.header}>
          <Input className={styles.title} placeholder="请输入标题" value={title} onChange={handleSetTitle}/>
          <Button className={styles.submit} type='primary' onClick={handleSubmit}>发布</Button>
      </div>
      <div className={styles.tags}>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="选择标签"
          defaultValue={defaultTag}
          onChange={handleChange}
          options={tags.map(tag => ({
            label: tag.title,
            value: tag.title,
            key: tag.id.toString(),
            data: tag
          }))}
          optionRender={(option) => (
            <Space>
              <span role="img" aria-label={option.data.label}>
                {(ICON as any)[option.data.data.icon].render()}
              </span>
              {option.data.value}
            </Space>
          )}
        />
      </div>
      <MDEditor value={value} height={1080} onChange={handlesetValue} />
    </div>
  );
}
Update.isShowLayout = false

export default Update;