import COS from 'cos-js-sdk-v5';

interface result {
    code: number,
    msg:  string,
    data : Record<any,any>
}
const createCos = (tmpSecretId: string,tmpSecretKey: string,sessionToken: string,expiredTime: number,StartTime:number)=>{
    return new COS({
    getAuthorization: async function (options, callback) {
       
      callback({
        TmpSecretId: tmpSecretId,
        TmpSecretKey: tmpSecretKey,
        SecurityToken: sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免客户端本地时间偏差过大导致签名错误
        StartTime: StartTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: expiredTime, // 时间戳，单位秒，如：1580000000
        ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
      });
    }
});
}

export const uploadFile = async(
    tmpSecretId: string,
    tmpSecretKey: string,
    sessionToken: string,
    expiredTime: number,
    Bucket: string,
    Region: string,
    file: any,
    id: number,
    StartTime: number
) => {
    const cos = createCos(tmpSecretId, tmpSecretKey, sessionToken, expiredTime,StartTime);
    const postfix = file.name.substring(file.name.lastIndexOf(".") + 1)
    try{
        const data = await cos.uploadFile({
            Bucket: Bucket, /* 填写自己的 bucket，必须字段 */
            Region: Region,     /* 存储桶所在地域，必须字段 */
            Key: `avatar/${id}_${Math.floor(Math.random()*9000 +1000)}.${postfix}`,              /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
            Body: file, // 上传文件对象
            SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData));
            }})
        return {err: null, data: data}
    }catch (err) {
        return { err: err, data: null };
    }
}
export const uploadArticleFile = async(
    tmpSecretId: string,
    tmpSecretKey: string,
    sessionToken: string,
    expiredTime: number,
    Bucket: string,
    Region: string,
    file: any,
    StartTime: number,
    id: number
) => {
    const cos = createCos(tmpSecretId, tmpSecretKey, sessionToken, expiredTime,StartTime);
    try{
        const data = await cos.uploadFile({
            Bucket: Bucket, /* 填写自己的 bucket，必须字段 */
            Region: Region,     /* 存储桶所在地域，必须字段 */
            Key: `article/${id}/${file.name}`,              /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
            Body: file, // 上传文件对象
            SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData));
            }})
        return {err: null, data: data}
    }catch (err) {
        return { err: err, data: null };
    }
}