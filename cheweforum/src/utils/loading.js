/**
 * 纯 Tailwind CSS 加载提示工具
 */

let loadingInstance = null

function createLoading(text = '加载中...') {
  if (loadingInstance) {
    return loadingInstance
  }
  
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'
  overlay.id = 'loading-overlay'
  
  const spinner = document.createElement('div')
  spinner.className = 'bg-white rounded-lg shadow-xl p-6 flex flex-col items-center gap-4'
  
  const spinnerIcon = document.createElement('div')
  spinnerIcon.className = 'w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'
  
  const textDiv = document.createElement('div')
  textDiv.className = 'text-gray-700 font-medium'
  textDiv.textContent = text
  
  spinner.appendChild(spinnerIcon)
  spinner.appendChild(textDiv)
  overlay.appendChild(spinner)
  
  document.body.appendChild(overlay)
  loadingInstance = overlay
  
  return overlay
}

export default {
  service(options = {}) {
    const text = options.text || '加载中...'
    createLoading(text)
    return {
      close: () => {
        if (loadingInstance) {
          document.body.removeChild(loadingInstance)
          loadingInstance = null
        }
      }
    }
  },
  show(text = '加载中...') {
    return createLoading(text)
  },
  close() {
    if (loadingInstance) {
      document.body.removeChild(loadingInstance)
      loadingInstance = null
    }
  }
}

