import OpenAI from "openai";
type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
// 统一的LLM响应格式
export interface LLMResponse {
  code: number;
  msg: string;
  data: {
    message: {
      role: string;
      content: string;
    };
    tokens?: {
      prompt: number;
      completion: number;
    };
  };
}

// 抽象基础LLM类
abstract class BaseLLM {
  protected messages: any[];
  protected provider: OpenAI;
  protected model: string;

  constructor(model: string = "deepseek-v3") {
    this.messages = [];
    this.model = model;
    this.provider = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || "",
      baseURL: process.env.BASE_URL || "https://api.deepseek.com/v1",
    });
  }

  // 重置对话历史
  clearHistory() {
    this.messages = [];
  }

  // 抽象聊天方法
  abstract chat(prompt: string, systemMessage?: string): Promise<LLMResponse | AsyncIterable<string>>;
}

export class GlobalAgent extends BaseLLM {
  async chat(
    prompt: string,
    systemMessage: string = "你是一个全领域的专业知识专家，请准确、详细地回答用户的各种问题"
  ): Promise<AsyncIterable<string>> {
    // 添加系统消息（仅在对话开始时）
    if (this.messages.length === 0 && systemMessage) {
      this.messages.push({ role: "system", content: systemMessage });
    }

    // 添加用户消息
    const userMessage = { role: "user", content: prompt };
    this.messages.push(userMessage);

    const stream = await this.provider.chat.completions.create({
      model: this.model,
      messages: this.messages,
      stream: true,
      stream_options: { include_usage: true }
    });

    // 返回异步生成器 - 关键修复
    return (async function* (this: GlobalAgent) {
      // 用于累积完整内容（仅用于历史记录）
      let fullContent = [];
      
      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
            const content = chunk.choices[0]?.delta?.content || "";
            fullContent.push(content);
            yield content;
        }
      }
      // 更新对话历史（完整回复）
      this.messages.push({ role: "assistant", content: fullContent.join("") });
    }).bind(this)();
  }
}

// 文章编辑Agent实现（非流式响应）
export class EditorAgent extends BaseLLM {
  async chat(
    prompt: string,
    systemMessage: string = "你是一位专业的写作助手，请根据用户提供的内容提供改进建议。"
  ): Promise<LLMResponse> {
    // 清空历史确保每次独立处理
    this.clearHistory();
    
    // 构建完整消息
    const messages: ChatMessage[] = [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ];

    // 获取完整响应
    const response = await this.provider.chat.completions.create({
      model: this.model,
      messages,
      stream: false,
    });

    // 提取使用情况
    const usage = response.usage || {
      prompt_tokens: 0,
      completion_tokens: 0
    };

    return {
      code: 0,
      msg: "success",
      data: {
        message: {
          role: "assistant",
          content: response.choices[0].message.content || ""
        },
        tokens: {
          prompt: usage.prompt_tokens,
          completion: usage.completion_tokens
        }
      }
    };
  }

  // 专用功能方法
  // async proofread(text: string): Promise<LLMResponse> {
  //   return this.chat(
  //     `请检查并修正以下文本的病句和语法错误（保持语言不变）：\n\n${text}`,
  //     "你是一位专业的文本校对专家，专注于识别和修正语法错误、病句和表达不清的问题"
  //   );
  // }

  // async polish(text: string): Promise<LLMResponse> {
  //   return this.chat(
  //     `请润色以下文本，使其更流畅优美但保持原意：\n\n${text}`,
  //     "你是一位专业的文本润色专家，擅长提升文本表达质量同时保持原意不变"
  //   );
  // }

  // async translate(text: string, targetLang: string = "英文"): Promise<LLMResponse> {
  //   return this.chat(
  //     `请将以下文本翻译成${targetLang}（保持专业术语准确）：\n\n${text}`,
  //     "你是一位专业的翻译专家，精通多语言之间的准确翻译"
  //   );
  // }
}

// 服务工厂（方便扩展）
export class LLMServiceFactory {
  static createAgent(type: "global" | "editor"): GlobalAgent | EditorAgent {
    switch (type) {
      case "global":
        return new GlobalAgent();
      case "editor":
        return new EditorAgent();
      default:
        throw new Error("Invalid agent type");
    }
  }
}