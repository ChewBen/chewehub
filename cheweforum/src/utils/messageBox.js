/**
 * 纯 Tailwind CSS 消息框工具
 */

// 创建遮罩层
function createOverlay() {
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'
  overlay.style.animation = 'fadeIn 0.2s ease-out'
  return overlay
}

// 创建消息框
function createMessageBox(options) {
  const {
    title = '系统提示',
    message = '',
    type = 'info',
    confirmButtonText = '确定',
    cancelButtonText = '取消',
    showCancelButton = true
  } = options
  
  return new Promise((resolve, reject) => {
    const overlay = createOverlay()
    const box = document.createElement('div')
    
    const typeStyles = {
      success: 'border-green-200',
      error: 'border-red-200',
      warning: 'border-yellow-200',
      info: 'border-blue-200'
    }
    
    const iconColors = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500'
    }
    
    box.className = `bg-white rounded-lg shadow-xl border-2 ${typeStyles[type]} min-w-[400px] max-w-[500px] p-6`
    box.style.animation = 'scaleIn 0.2s ease-out'
    
    // 标题
    const titleDiv = document.createElement('div')
    titleDiv.className = 'flex items-center gap-3 mb-4'
    
    const icon = document.createElement('div')
    icon.className = `text-2xl ${iconColors[type]}`
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    }
    icon.textContent = icons[type] || icons.info
    
    const titleText = document.createElement('div')
    titleText.className = 'text-lg font-semibold text-gray-800'
    titleText.textContent = title
    
    titleDiv.appendChild(icon)
    titleDiv.appendChild(titleText)
    
    // 消息内容
    const messageDiv = document.createElement('div')
    messageDiv.className = 'text-gray-600 mb-6'
    messageDiv.textContent = message
    
    // 按钮组
    const buttonGroup = document.createElement('div')
    buttonGroup.className = 'flex justify-end gap-3'
    
    if (showCancelButton) {
      const cancelBtn = document.createElement('button')
      cancelBtn.className = 'px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
      cancelBtn.textContent = cancelButtonText
      cancelBtn.onclick = () => {
        overlay.style.animation = 'fadeOut 0.2s ease-in'
        setTimeout(() => {
          document.body.removeChild(overlay)
        }, 200)
        reject('cancel')
      }
      buttonGroup.appendChild(cancelBtn)
    }
    
    const confirmBtn = document.createElement('button')
    const confirmStyles = {
      success: 'bg-green-500 hover:bg-green-600 text-white',
      error: 'bg-red-500 hover:bg-red-600 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      info: 'bg-blue-500 hover:bg-blue-600 text-white'
    }
    confirmBtn.className = `px-4 py-2 rounded-md transition-colors ${confirmStyles[type]}`
    confirmBtn.textContent = confirmButtonText
    confirmBtn.onclick = () => {
      overlay.style.animation = 'fadeOut 0.2s ease-in'
      setTimeout(() => {
        document.body.removeChild(overlay)
      }, 200)
      resolve('confirm')
    }
    buttonGroup.appendChild(confirmBtn)
    
    box.appendChild(titleDiv)
    box.appendChild(messageDiv)
    box.appendChild(buttonGroup)
    overlay.appendChild(box)
    
    // 添加动画样式
    if (!document.getElementById('messagebox-styles')) {
      const style = document.createElement('style')
      style.id = 'messagebox-styles'
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `
      document.head.appendChild(style)
    }
    
    document.body.appendChild(overlay)
    
    // 点击遮罩层关闭
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease-in'
        setTimeout(() => {
          document.body.removeChild(overlay)
        }, 200)
        reject('cancel')
      }
    }
  })
}

export default {
  confirm(message, title = '系统提示', options = {}) {
    return createMessageBox({
      title,
      message,
      type: 'warning',
      confirmButtonText: options.confirmButtonText || '确定',
      cancelButtonText: options.cancelButtonText || '取消',
      showCancelButton: true
    })
  },
  alert(message, title = '系统提示', options = {}) {
    return createMessageBox({
      title,
      message,
      type: options.type || 'info',
      confirmButtonText: options.confirmButtonText || '确定',
      showCancelButton: false
    })
  }
}

