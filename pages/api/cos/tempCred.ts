import { getCredential } from 'qcloud-cos-sts';
import { NextApiRequest,NextApiResponse } from 'next';
import { resolve } from 'path';
const config = {
  SecretId: process.env.TENCENT_CLOUD_SECRET_ID!,
  SecretKey: process.env.TENCENT_CLOUD_SECRET_KEY!,
  Bucket: process.env.COS_BUCKET,
  Region: process.env.COS_REGION,
  durationSeconds: Number(process.env.DURATION),
  allowPrefix1: process.env.ALLOWPREFIX1,
  allowPrefix2: process.env.ALLOWPREFIX2,
};

export default async function tempCred (req: NextApiRequest,res: NextApiResponse){
    const appId = config.Bucket!.substring(1 + config.Bucket!.lastIndexOf('-'));
    const policy = {
        'version': '2.0',
        'statement': [{
            'action': [
                // 简单上传
                'name/cos:PutObject',
                'name/cos:PostObject',
                'name/cos:GetObject',
                // 分片上传
                'name/cos:InitiateMultipartUpload',
                'name/cos:ListMultipartUploads',
                'name/cos:ListParts',
                'name/cos:UploadPart',
                'name/cos:CompleteMultipartUpload',
                // 文本审核任务
                'name/ci:CreateAuditingTextJob',
                // 开通媒体处理服务
                'name/ci:CreateMediaBucket'
            ],
            'effect': 'allow',
            'principal': { 'qcs': ['*'] },
                'resource': [
            // cos相关授权，按需使用
                'qcs::cos:' + config.Region + ':uid/' + appId + ':' + config.Bucket + '/' + config.allowPrefix1 + '/*',
                'qcs::cos:' + config.Region + ':uid/' + appId + ':' + config.Bucket + '/' + config.allowPrefix2 + '/*'
            ],
        }]
    }
    const credential = await new Promise((resolve,reject)=>{
        getCredential({
            secretId: config.SecretId,
            secretKey: config.SecretKey,
            proxy: '',
            durationSeconds: config.durationSeconds,
            region: config.Region,
            policy: policy,
        }, function (err, credential) {
            if(err){
                reject({
                    code: 4001,
                    msg: '临时密码拿取失败'
                })
            }else{
                resolve({
                    code: 0,
                    msg: '',
                    data:{
                        credential,
                        Bucket: config.Bucket,
                        Region: config.Region,
                        StartTime: Math.floor(new Date().getTime() / 1000),
                    }
                })
            }

        });
    })
    res.status(200).json(credential)
}