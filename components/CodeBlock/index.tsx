import { useState } from 'react';
import  {CheckCircleOutlined, CopyOutlined } from '@ant-design/icons'; 
import travelBlock from 'utils/travelBlock';
import styles from './index.module.scss'; 

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string; 
}

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  // 提取代码内容（children 通常是代码文本节点）
//   const codeContent = Array.isArray(children) ? children.join('') : String(children);

  // 复制到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(travelBlock(children)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后隐藏"已复制"状态
    });
  };

  return (
    <div>
      <pre className={styles.container} {...props}>
        <button
        className={styles.copyButton}
        onClick={handleCopy}
        aria-label="复制代码"
        >
            {copied ? <CheckCircleOutlined /> : <CopyOutlined />}
        </button>
       {children}
      </pre>
    </div>
  );
}