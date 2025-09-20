import Link from "next/link";
import { MDXRemote } from 'next-mdx-remote'
import { Avatar} from 'antd';
import {format} from 'date-fns';
import { EyeOutlined } from "@ant-design/icons";
import { Article } from "db/entities/article";
import { useStore } from "store";
import CodeBlock from "components/CodeBlock";
import styles from "./index.module.scss"
const ArticleDetail = ({article,mdxSource}: {article:Article,mdxSource:any})=>{
    const {title,content,user,create_time,update_time,view,comments} = article;
    const {id,nickname,job,avatar} = user;
    const store = useStore();
    const userInfo = store.userStore.userInfo;

    return (
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
                                {id === userInfo?.id 
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
                        <MDXRemote {...mdxSource} components={{  pre: (props) => <CodeBlock {...props} /> }} />
                        {/* <MDXRemote {...mdxSource} /> */}
                    </div>
                </div>
            </div>)
}

export default ArticleDetail;