import fetch from "service/fetch"
import type { IuserInfo } from "./userStore"
import { time } from "console"
export type IrecordInfo = {
    id?: number,
    articleId: number,
    title: string,
    user: IuserInfo,
    time: Date,
    tags?: string[],
    duration?: number
} | null

export interface IviewedArticlesStore {
    user: IuserInfo |string,
    name: string,
    unstoredName: string,
    records: IrecordInfo[],
    unstoredRecords: IrecordInfo[],
    syncInterval: NodeJS.Timeout | null, // 新增定时器引用
    modefyUser: (value?:IuserInfo | string) => void,
    setRecords: (value:IrecordInfo[])=>void,
    addRecord: (value:IrecordInfo)=>void,
    getRecords: () => Promise<any>,
    initiateRecords: () => void,
    removeHistory: () => void,
    startSyncTimer: () => void,
    stopSyncTimer: () => void,
    syncUnstoredRecords: () => Promise<void>,
    setupUnloadListener: () => void,
    forceSyncOnUnload: () => void
}

export const createViewedArticlesStore = (): IviewedArticlesStore => {
    return {
        user: '',
        records: [],
        unstoredRecords: [],
        name: '',
        unstoredName: '',
        syncInterval: null,
        async initiateRecords(){  
            this.name = (typeof this.user === 'object' && this.user?.id ) ? `user_${this.user.id}_viewedArticles` : 'viewedArticles';
            this.unstoredName = (typeof this.user === 'object' && this.user?.id ) ? `user_${this.user.id}_unstoredArticles` : 'unstoredArticles';
            this.records = await this.getRecords();
            if(typeof this.user !== "string" && this.user?.id) {
                this.startSyncTimer();
                this.setupUnloadListener();
            }else{
                this.stopSyncTimer();
            }
        },
        modefyUser(value = 'viewedArticles'){
            this.user = value;
        },
        setRecords(value){
            this.records = value
        },
        async getRecords(){
            if(this.name === 'viewedArticles') {
                return JSON.parse(localStorage.getItem(this.name) || '[]');
            }else{
                if(typeof this.user === 'string' || !this.user?.id) return [];
                const res = await fetch.get(`/api/record/getViewedArticles?userId=${(this.user as any)?.id}`)
                return res.data.records || [];
            }
        },
        addRecord(value){
            if(!this.records.some((record:any)=>record.articleId === value?.articleId)){
                this.records.push(value);

                const savedRecords = JSON.parse(localStorage.getItem(this.name) || '[]');
                if(value !== null &&savedRecords.some((record: any)=>record.articleId === value?.articleId)){
                    // 如果本地存储中已存在该记录，则更新
                    const index = savedRecords.findIndex((record: any) => record.articleId === value?.articleId);
                    savedRecords[index] = {...value,duration: savedRecords[index].duration + value.duration};
                }else{
                    savedRecords.push(value);
                }
                localStorage.setItem(this.name, JSON.stringify(savedRecords));

                if (typeof this.user !== 'string' && this.user?.id && !this.unstoredRecords.some((record: any) => record.articleId === value?.articleId)) {
                    this.unstoredRecords.push(value);
                    localStorage.setItem(this.unstoredName, JSON.stringify(this.unstoredRecords));
                    if(this.unstoredRecords.length > 5){
                        this.syncUnstoredRecords();
                    }
                }
            }
        },
        removeHistory(){
            this.records = [];
            if(this.name === 'viewedArticles') {
                localStorage.removeItem(this.name);
            }else{
                localStorage.removeItem(this.unstoredName);
                fetch.post('/api/record/removeViewedArticles', { 
                    userId: (this.user as IuserInfo)?.id
                });
            }
        },
             // 新增: 启动定时同步
        startSyncTimer() {
            if (this.syncInterval ) {
                clearInterval(this.syncInterval);
            };
            if (typeof this.user === 'string' || !this.user?.id) return;

            this.syncInterval = setInterval(() => {
                this.syncUnstoredRecords();
            }, 30000); // 每30秒同步一次
        },
                // 新增: 停止定时同步
        stopSyncTimer() {
            if (this.syncInterval) {
                clearInterval(this.syncInterval);
                this.syncInterval = null;
            }
        },
          // 新增: 同步未存储的文章
        async syncUnstoredRecords() {
            if (this.unstoredRecords.length === 0 || typeof this.user === 'string' || !this.user?.id) return;

            try {
                // 复制当前未存储记录（避免同步过程中修改）
                const recordsToSync = [...this.unstoredRecords];
                const userId = (this.user as IuserInfo)!.id;
                
                // 批量上传到服务器
                const response: any = await fetch.post('/api/record/batchAddViewedArticles', {
                    userId,
                    records: recordsToSync.map(record => ({
                        articleId: record?.articleId,
                        time: record?.time,
                    }))
                });
                
                if (response.code === 0) {
                    // 从 unstoredRecords 中移除已上传的
                    this.unstoredRecords = this.unstoredRecords.filter(
                        record => !recordsToSync.some(r => r?.id === record?.id)
                    );
                    // 更新本地存储的未存储记录
                    localStorage.setItem(this.unstoredName, JSON.stringify(this.unstoredRecords));
                }
            } catch (error) {
                console.error("同步浏览记录失败:", error);
                // 失败处理：保留记录下次重试
            }
        },
        // 新增: 设置页面卸载监听器
        setupUnloadListener() {
            if (typeof window === "undefined" || typeof this.user === 'string') return;
            
            let ifUnloading = false;
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "hidden" && !ifUnloading) {
                    this.syncUnstoredRecords();
                    this.stopSyncTimer();
                }
                if (document.visibilityState === "visible" && !ifUnloading) {
                    this.syncUnstoredRecords();
                    this.startSyncTimer();
                }
            });
            
            // 页面关闭前强制同步
            window.addEventListener("beforeunload", () => {
                ifUnloading = true;
                this.forceSyncOnUnload();
                this.stopSyncTimer();
            });
        },
        // 新增: 页面关闭时强制同步
        forceSyncOnUnload() {
            if (this.unstoredRecords.length === 0 || typeof this.user === 'string') return;
            
            // 使用 sendBeacon 确保在页面关闭后继续发送
            const userId = (this.user as IuserInfo)!.id;
            const blob = new Blob(
                [JSON.stringify({
                    userId,
                    records: this.unstoredRecords.map(record => ({
                        articleId: record?.id,
                        title: record?.title,
                    }))
                })],
                { type: 'application/json' }
            );
            
            navigator.sendBeacon('/api/record/batchAddViewedArticles', blob);
            
            // 清空本地未存储记录（即使发送失败也清空，避免重复）
            this.unstoredRecords = [];
        }
    };
}