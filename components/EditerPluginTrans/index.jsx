// components/EditerPluginAI.jsx
import { PluginComponent } from 'react-markdown-editor-lite';
import { message } from 'antd';
import React from 'react';
import {fetchHTMLTranslation} from 'service/aiService';


class AITransPlugin extends PluginComponent {
    static pluginName = 'ai-trans';
    static align = 'right';

    state = {
    inputText: '',
    aiResponse: '',
    isLoading: false
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        // 绑定方法到编辑器实例
        this.getCursorPosition = this.getCursorPosition.bind(this);
        this.insertText = this.insertText.bind(this);
        }

    handleClick() {
        if (!this.editor) {
            console.error('Editor instance not available');
            return;
        }
        
        const context = this.getCursorContext();
        this.setState({
            inputText: context,
            aiResponse: ''
        });
        console.log('Selected text for translation:', context);
        this.handleSendToAI(context);
    }

    // 获取光标周围的上下文
    getCursorContext() {
        const cursorInfo = this.getCursorPosition();
        if (!cursorInfo) {
            console.error('无法获取光标位置');
            return '';
        }

        const { value, start, end } = cursorInfo;
        return value.substring(start, end);
    }

    handleInputChange = (e) => {
        this.setState({ inputText: e.target.value });
    };
  // 获取光标周围的上下文
    getCursorPosition() {
        if (!this.editor || !this.editor.nodeMdText || !this.editor.nodeMdText.current) {
            return null;
        }
    
        const textarea = this.editor.nodeMdText.current;
        return {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
        value: textarea.value
        };
    }

    handleSendToAI = async (context) => {
        console.log('Input text for AI translation:', context);
        if (!context.trim()) {
            message.warning('请选择内容');
            return;
        }
        
        this.setState({ isLoading: true });
        
        try {
            const response = await fetchHTMLTranslation(context);
            console.log('AI Response:', response);
            if(response.code!==0){
                message.error(response.message || 'AI服务请求失败');
                this.setState({ isLoading: false });
                return;
            }
            this.setState({
              aiResponse:response.data,
              isLoading: false 
            });
            this.insertToEditor(response.data);
        } catch (error) {
            message.error('AI服务请求失败');
            this.setState({ isLoading: false });
        }
    };

      // 插入文本
    insertText(text) {
        if (!this.editor || !this.editor.nodeMdText || !this.editor.nodeMdText.current) {
        return;
        }
        
        const textarea = this.editor.nodeMdText.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // 插入文本
        const newValue = textarea.value.substring(0, start) + 
                        text + 
                        textarea.value.substring(end);
        
        // 更新文本区域的值
        textarea.value = newValue;
        
        // 更新编辑器状态
        if (this.editor.props.onChange) {
        this.editor.props.onChange({ text: newValue });
        }
        
        // 设置新的光标位置
        const newCursorPos = start + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
      // 插入到编辑器
    insertToEditor = (response) => {
        if (response) {
            this.insertText(`${response}`);
        }
    };


  render() {
    return (
      <>
        <button 
          className="button" 
          title="HTML翻译(url或标签)" 
          onClick={this.handleClick}
        >
          <span>MarKDown转换</span>
        </button>
      </>
    );
  }
}

export default AITransPlugin;