/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Typography 主题颜色
      colors: {
        'typography': {
          'bg': '#ffffff',           // 背景色
          'fg': '#2e405b',           // 前景色（文字颜色）
          'fg-dark': '#1a2d42',      // 深色前景（focus 状态，darken 30%）
          'fg-light': '#3d5670',     // 浅色前景（hover 状态，lighten 10%）
        },
        
        // shadcn/vue 颜色系统
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      
      fontFamily: {
        // Mulish 可变字体家族（仅使用 Mulish，无备用字体）
        'mulish': ['Mulish'],
        
        // Dream Han 字体家族（仅使用自定义字体，无备用字体）
        'dream-sans-w14': ['Dream Han Sans W14'],
        'dream-sans-w20': ['Dream Han Sans W20'],
        'dream-serif-w20': ['Dream Han Serif W20'],
        
        // 混合中英文字体家族（仅使用配置的字体）
        'mix-sans': [
          'Mulish',
          'Dream Han Sans W20'
        ],
        
        // 混合中英文衬线字体家族（仅使用配置的字体）
        'mix-serif': [
          'Dream Han Serif W20'
        ],
        
        // 覆盖默认字体，只使用自定义字体（无备用字体）
        'sans': ['Mulish', 'Dream Han Sans W20'],
        'serif': ['Dream Han Serif W20'],
        'mono': ['Mulish'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}

