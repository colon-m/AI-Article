// components/EditerPluginAI.jsx
import { PluginComponent } from 'react-markdown-editor-lite';
import { Modal, Button, Input, message } from 'antd';
import React from 'react';
import {fetchAISuggestion} from 'service/aiService';
import styles from './index.module.scss';

const { TextArea } = Input;

class AITogglePlugin extends PluginComponent {
    static pluginName = 'ai-toggle';
    static align = 'right';

    state = {
    visible: false,
    inputText: '',
    aiResponse: '',
    isLoading: false
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        // 绑定方法到编辑器实例
        this.getCursorPosition = this.getCursorPosition.bind(this);
        this.insertText = this.insertText.bind(this);
        }

    handleClick() {
        if (!this.editor) {
            console.error('Editor instance not available');
            return;
        }
        
        // 获取当前上下文
        const context = this.getCursorContext();
        
        this.setState({
            visible: true,
            inputText: context,
            aiResponse: ''
        });
    }

    // 获取光标周围的上下文
    getCursorContext() {
        const cursorInfo = this.getCursorPosition();
        if (!cursorInfo) {
            console.error('无法获取光标位置');
            return '';
        }

        const { value, start } = cursorInfo;

        // 获取光标前后300个字符作为上下文
        const contextStart = Math.max(0, start - 300);
        const contextEnd = Math.min(value.length, start + 300);

        return value.substring(contextStart, contextEnd);
    }

    handleCancel() {
        this.setState({ visible: false });
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

    handleSendToAI = async () => {
        const { inputText } = this.state;
        
        if (!inputText.trim()) {
            message.warning('请输入内容');
            return;
        }
        
        this.setState({ isLoading: true });
        
        try {
            const response = await fetchAISuggestion(inputText);
            const { code, msg, data } = response;
            if (code !== 0) {
                message.error(msg || 'AI服务请求失败');
                this.setState({ isLoading: false });
                return;
            }
            this.setState({
            aiResponse: data.message.content || 'AI未返回内容',
            isLoading: false 
            });
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
    insertToEditor = () => {
        const { aiResponse } = this.state;
        if (aiResponse) {
            this.insertText(`\n${aiResponse}\n`);
            this.setState({ visible: false });
        }
    };

    replaceSelection = () => {
        const { aiResponse } = this.state;
        if (aiResponse) {
            this.insertText(aiResponse);
            this.setState({ visible: false });
        }
    };
    

  render() {
    const { visible, inputText, aiResponse, isLoading } = this.state;

    return (
      <>
        <button 
          className="button" 
          title="AI辅助模式" 
          onClick={this.handleClick}
        >
          <span>🤖 AI</span>
        </button>
        
        <Modal
          title="AI 写作辅助"
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          width={700}
          className={styles.aiModal}
        >
          <div className={styles.container}>
            <div className={styles.inputSection}>
              <TextArea
                rows={4}
                placeholder="输入您想改进的内容或写作要求..."
                value={inputText}
                onChange={this.handleInputChange}
              />
              <div className={styles.buttonGroup}>
                <Button 
                  type="primary" 
                  onClick={this.handleSendToAI}
                  loading={isLoading}
                >
                  获取建议
                </Button>
              </div>
            </div>
            
            {aiResponse && (
              <div className={styles.responseSection}>
                <h4>AI建议：</h4>
                <div className={styles.aiResponse}>{aiResponse}</div>
                <div className={styles.actionButtons}>
                  <Button onClick={this.insertToEditor}>插入到编辑器</Button>
                  <Button onClick={this.replaceSelection} type="primary">
                    替换选中内容
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </>
    );
  }
}

export default AITogglePlugin;