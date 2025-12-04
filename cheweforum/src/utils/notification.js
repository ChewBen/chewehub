/**
 * 纯 Tailwind CSS 通知提示工具
 */

// 创建通知容器
function getNotificationContainer() {
  let container = document.getElementById('notification-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'notification-container'
    container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2'
    document.body.appendChild(container)
  }
  return container
}

// 创建通知元素
function createNotification(title, message, type = 'info') {
  const container = getNotificationContainer()
  const notification = document.createElement('div')
  
  const typeStyles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }
  
  const titleColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  
  notification.className = `min-w-[300px] max-w-[400px] px-4 py-3 rounded-lg border shadow-lg ${typeStyles[type]} animate-slide-in`
  notification.style.animation = 'slideIn 0.3s ease-out'
  
  const titleDiv = document.createElement('div')
  titleDiv.className = `font-semibold mb-1 ${titleColors[type]}`
  titleDiv.textContent = title
  
  const messageDiv = document.createElement('div')
  messageDiv.className = 'text-sm text-gray-600'
  messageDiv.textContent = message
  
  notification.appendChild(titleDiv)
  notification.appendChild(messageDiv)
  container.appendChild(notification)
  
  // 自动移除
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4500)
  
  return notification
}

export default {
  success(title, message) {
    return createNotification(title, message, 'success')
  },
  error(title, message) {
    return createNotification(title, message, 'error')
  },
  warning(title, message) {
    return createNotification(title, message, 'warning')
  },
  info(title, message) {
    return createNotification(title, message, 'info')
  }
}

