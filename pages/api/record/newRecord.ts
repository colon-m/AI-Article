import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { User,Record } from "db/entities";
import { EXCEPTION_USER } from "../exception.config";


export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const {userId} = req.body;
    const db = await getDatabaseConnection();
    const userRep = db.getRepository(User);
    const recordRep = db.getRepository(Record);
    const user = await userRep.findOne({
        where:{
            id: userId
        }
    })
    if(user==null){
         res.status(200).json({...EXCEPTION_USER.NOTFOUND})
         return
    }
    const record = new Record();
    record.user = user;
    await recordRep.save(record);
    res.status(200).json({
        code: 0,
        msg:"成功"
    })
}