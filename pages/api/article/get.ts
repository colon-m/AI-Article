import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { User,Article,Tag } from "db/entities";
import { getIronSession } from "iron-session";
import type { ISession } from "pages/api/interface";
import { IronOptions } from "config/index";


export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const session: ISession = await getIronSession(req,res,IronOptions);
    const db = await getDatabaseConnection();
    const {user_id = 0} = session;
    const userRep = db.getRepository(User);
    const articleRep = db.getRepository(Article);
    const articles = await articleRep.find({
        relations: ["user"],
        where: {
            user: {
                id: Number(user_id)
            }
        }
    })

    res.status(200).json({
        code: 0,
        msg: '',
        data:{
            articles,
        }
    })
}