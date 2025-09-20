const extractRecommendTags = (name: string) => {
    const records = JSON.parse(localStorage.getItem(name) || '[]');
    if(records.length === 0) return [];
    const map = new Map();
    records.forEach((record: any) => {
        if(!record.tags || record.tags.length === 0) return;
        record.tags.forEach((tag: string) => {
            if(map.has(tag)) {
                map.set(tag, map.get(tag) + record.duration);
            } else {
                map.set(tag, record.duration);
            }
        })
    })
    const sortedTags = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    console.log("sortedTags:",sortedTags);
    return sortedTags.map(item => item[0]);
};

export default extractRecommendTags;