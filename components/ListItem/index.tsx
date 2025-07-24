import styles from './index.module.scss';
import { Article } from 'db/entities/article';
import { Avatar } from 'antd';
import { format } from 'date-fns';
import {EyeOutlined} from '@ant-design/icons';
import {markdownToTxt} from "markdown-to-txt";
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
interface Iprops {
    article:Article
}
const ListItem = ({article}:Iprops) =>{
    const {title,content,update_time,user, view} = article
    const {nickname,avatar} = user
    const router = useRouter()
    const handleGoToDetails = ()=>{
        router.push(`/article/${article.id}`)
    }
    return(
        <div className={`${styles.container} centerlayout`}>
            <div className={styles.article} onClick={handleGoToDetails}>
                <div className={styles.titleArea}>
                    <div className={styles.text}>标题：</div>
                    <h4 className={styles.title}>{title}</h4>
                </div>
                <p className={styles.content}>{markdownToTxt(content)}</p>
            </div>
            <div className={styles.info}>
                <div className={styles.avatarArea}>
                    <Avatar className={styles.avatar} size="small" src={avatar}></Avatar>
                </div>
                <div className={styles.author}>{nickname}</div>
                <div className={styles.time}>修改时间：{format(new Date(update_time),'MM/dd/yyyy')}</div>
                <div className={styles.view}>
                    <EyeOutlined />
                    <div className={styles.number}>
                        <span>{view}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(ListItem);