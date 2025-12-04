/**
 * 纯 Tailwind CSS 消息提示工具
 */

// 创建消息容器
function getMessageContainer() {
  let container = document.getElementById('message-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'message-container'
    container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2'
    document.body.appendChild(container)
  }
  return container
}

// 创建消息元素
function createMessage(content, type = 'info') {
  const container = getMessageContainer()
  const message = document.createElement('div')
  
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  
  message.className = `min-w-[300px] max-w-[500px] px-4 py-3 rounded-lg border shadow-lg ${typeStyles[type]} flex items-center gap-3 animate-slide-in`
  message.style.animation = 'slideIn 0.3s ease-out'
  
  const icon = document.createElement('div')
  icon.className = `flex-shrink-0 ${iconColors[type]}`
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  
  icon.textContent = icons[type] || icons.info
  icon.className += ' w-5 h-5 flex items-center justify-center font-bold'
  
  const contentDiv = document.createElement('div')
  contentDiv.className = 'flex-1'
  contentDiv.textContent = content
  
  message.appendChild(icon)
  message.appendChild(contentDiv)
  container.appendChild(message)
  
  // 自动移除
  setTimeout(() => {
    message.style.animation = 'slideOut 0.3s ease-in'
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message)
      }
    }, 300)
  }, 3000)
  
  return message
}

// 添加动画样式
if (!document.getElementById('message-styles')) {
  const style = document.createElement('style')
  style.id = 'message-styles'
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

export default {
  success(content, duration = 3000) {
    return createMessage(content, 'success')
  },
  error(content, duration = 3000) {
    return createMessage(content, 'error')
  },
  warning(content, duration = 3000) {
    return createMessage(content, 'warning')
  },
  info(content, duration = 3000) {
    return createMessage(content, 'info')
  }
}

