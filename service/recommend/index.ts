import fetch from "../fetch";

export const getRecommendedArticles = async (tags: string[]) => {
    let recommends = [];
    if(tags.length === 0) {
        const res = await fetch.get(`/api/recommend/getRecommends`);
        recommends = res.data.articles;
    }else if(tags.length === 1) {
        const res = await fetch.get(`/api/recommend/getRecommendsByTag?tag=${tags[0]}`);
        recommends = res.data.data.articles;
    }else{
        const resFirst = await fetch.get(`/api/recommend/getRecommendsByTag?tag=${tags[0]}`);
        recommends = resFirst.data.data.articles;
        const resSecond = await fetch.get(`/api/recommend/getRecommendsByTag?tag=${tags[1]}`);
        recommends = recommends.concat(resSecond.data.data.articles);
    }
    return recommends;
};

