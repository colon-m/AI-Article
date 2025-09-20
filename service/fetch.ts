// utils/fetch.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const fetch = axios.create({
  baseURL: '/',
  timeout: 60000, // 设置超时时间
});

fetch.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

fetch.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response;
    }
    return response;
  },
  error => Promise.reject(error)
);


export const sseRequest = async (
  instance: AxiosInstance,
  config: AxiosRequestConfig,
  handlers: {
    onData: (data: string) => void;
    onComplete: () => void;
    onError: (error: any) => void;
    onProgress?: (progress: number) => void;
  }
) => {
  let lastPosition = 0;
  let isFirstChunk = true;
  let receivedLength = 0;
  
  try {
    const response = await instance({
      ...config,
      responseType: 'text',
      onDownloadProgress: (progressEvent: any) => {
        try {
          // 进度回调
          if (handlers.onProgress && progressEvent.lengthComputable) {
            handlers.onProgress(progressEvent.loaded / progressEvent.total);
          }
          
          // 获取完整响应文本
          const fullText = progressEvent.event.target.response as string;
          receivedLength = fullText.length;
          
          // 处理新增内容
          if (fullText.length > lastPosition) {
            const newContent = fullText.substring(lastPosition);
            lastPosition = fullText.length;
            
            // 跳过初始空响应
            if (isFirstChunk) {
              if (newContent.trim() === '') return;
              isFirstChunk = false;
            }
            
            handlers.onData(newContent);
          }
        } catch (error) {
          console.error('处理下载进度时出错:', error);
          handlers.onError(error);
        }
      }
    });
    
    handlers.onComplete();
    return response;
  } catch (error: any) {
    // 处理取消请求
    if (axios.isCancel(error)) {
      console.log('请求被取消');
    } else {
      // 尝试获取部分响应
      if (error.response?.data) {
        const responseText = error.response.data as string;
        if (responseText.length > lastPosition) {
          const newContent = responseText.substring(lastPosition);
          handlers.onData(newContent);
        }
      }
      
      handlers.onError(error);
    }
    throw error;
  }
};

export default fetch;