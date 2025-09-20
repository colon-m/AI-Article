import fetch from "service/fetch";
import {uploadArticleFile} from "lib/cos";

const handleUpload = async (file: File,id: number) => {
    console.log("上传文件", file);
    const result: any = await fetch.get('/api/cos/tempCred');
    if(result.code === 0){
        const {credential,Bucket,Region,StartTime} = result.data;
        const expiredTime = credential.expiredTime;
        const {sessionToken,tmpSecretId,tmpSecretKey} = credential.credentials;
        const uploadRes: any = await uploadArticleFile(tmpSecretId, tmpSecretKey,sessionToken,expiredTime,Bucket,Region,file,StartTime,id!);
        if(uploadRes.err){
            console.log(uploadRes.err);
            return
        }
        const imageUrl = `http://${uploadRes.data.Location}`;
        console.log("上传成功", imageUrl);
        return imageUrl;
    }else{
        return "连接云端失败";
    }
}

export default handleUpload;