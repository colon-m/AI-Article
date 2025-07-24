import getDatabaseConnection from "db";
import {User} from "db/entities/user";
import { Article } from "db/entities/article";
import ListItem from "components/ListItem";

interface Iprops {
  articles : Article[]
}

export async function getServerSideProps(){
  const db = await getDatabaseConnection();
  const articleRep = db.getRepository(Article);
  const articles = await articleRep.find({
    relations:{
      user: true
    }
  })
  return {
    props:{
      articles: JSON.parse(JSON.stringify(articles))
    }
  }
}
export const home = ({articles}:Iprops)=>{
  return (
    <div>
      {articles.map(article=>{
        return <ListItem key={article.id} article={article}/>
      })}
    </div>
  )
}

export default home;