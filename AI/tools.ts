const tools = [
// 工具1 获取当前时刻的时间
{
    "type": "function",
    "function": {
        "name": "getCurrentTime",
        "description": "当你想知道现在的时间时非常有用。",
        // 因为获取当前时间无需输入参数，因此parameters为空
        "parameters": {}  
    }
},  
// 工具2 获取指定城市的天气
{
    "type": "function",
    "function": {
        "name": "getCurrentWeather",
        "description": "当你想查询指定城市的天气时非常有用。",
        "parameters": {  
            "type": "object",
            "properties": {
                // 查询天气时需要提供位置，因此参数设置为location
                "location": {
                    "type": "string",
                    "description": "城市或县区，比如北京市、杭州市、余杭区等。"
                }
            },
            "required": ["location"]
        }
    }
}
];