import fetch from "../fetch";

export const fetchAISuggestion = async (text:any) => {
  const response = await fetch.post('/api/chat/editorChat', { text });
  return response.data;
};

export const fetchHTMLTranslation = async (text:any) => {
    const response: any = await fetch.post('/api/chat/transChat', { text });
    if(response.data.code !== 0){
        return {
            code: response.data.code,
            msg: response.data.msg
        };
    }else{
        return {
            code: 0,
            msg: '请求成功',
            data: response.data.data
        };
    }
};