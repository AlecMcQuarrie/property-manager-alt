// Theme configuration for SuiteProp
export const theme = {
  colors: {
    // Background colors
    bg: {
      primary: '#0f1419',
      secondary: '#181c23',
      tertiary: '#22304a',
      hover: '#2d3a5a',
    },
    // Text colors
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
      muted: '#6b7280',
      accent: '#60a5fa',
    },
    // Border colors
    border: {
      primary: '#22304a',
      accent: '#60a5fa',
    },
    // Status colors
    status: {
      success: {
        bg: '#065f46',
        text: '#6ee7b7',
        icon: '#10b981',
      },
      warning: {
        bg: '#92400e',
        text: '#fcd34d',
        icon: '#f59e0b',
      },
      error: {
        bg: '#7f1d1d',
        text: '#fca5a5',
        icon: '#ef4444',
      },
      info: {
        bg: '#1e3a8a',
        text: '#93c5fd',
        icon: '#3b82f6',
      },
    },
    // Button colors
    button: {
      primary: {
        bg: '#2563eb',
        hover: '#1d4ed8',
        text: '#ffffff',
      },
      secondary: {
        bg: '#22304a',
        hover: '#2d3a5a',
        text: '#e5e7eb',
      },
      ghost: {
        bg: 'transparent',
        hover: '#22304a',
        text: '#e5e7eb',
      },
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
} as const;

// Utility functions for theme-aware styling
export const getStatusColor = (status: string) => {
  const statusMap: Record<string, keyof typeof theme.colors.status> = {
    active: 'success',
    inactive: 'error',
    pending: 'warning',
    completed: 'success',
    overdue: 'error',
    paid: 'success',
    unpaid: 'error',
    'in progress': 'info',
    low: 'success',
    medium: 'warning',
    high: 'error',
  };
  
  return theme.colors.status[statusMap[status.toLowerCase()] || 'info'];
};

// CSS class utilities
export const themeClasses = {
  card: 'bg-[#181c23] shadow rounded-lg border border-[#22304a]',
  cardHeader: 'px-4 py-5 sm:p-6',
  cardContent: 'px-4 py-5 sm:p-6',
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200',
    secondary: 'bg-[#22304a] hover:bg-[#2d3a5a] text-[#e5e7eb] font-medium py-2 px-4 rounded-lg border border-[#22304a] hover:border-blue-400 transition-colors duration-200',
    ghost: 'text-[#e5e7eb] hover:text-blue-400 hover:bg-[#22304a] font-medium py-2 px-4 rounded-lg transition-colors duration-200',
  },
  text: {
    heading: 'text-[#e5e7eb] font-medium',
    body: 'text-[#e5e7eb]',
    muted: 'text-gray-400',
    accent: 'text-blue-400',
  },
  badge: {
    success: 'bg-green-900 text-green-300',
    warning: 'bg-yellow-900 text-yellow-300',
    error: 'bg-red-900 text-red-300',
    info: 'bg-blue-900 text-blue-300',
  },
  input: 'bg-[#22304a] border border-[#22304a] text-[#e5e7eb] placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent',
  table: {
    container: 'bg-[#181c23] shadow rounded-lg border border-[#22304a] overflow-hidden',
    header: 'bg-[#22304a] px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider',
    cell: 'px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]',
    row: 'border-b border-[#22304a] hover:bg-[#22304a]',
  },
  nav: {
    link: 'text-gray-400 hover:text-[#e5e7eb] hover:bg-[#22304a] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
    active: 'text-blue-400 bg-[#22304a] px-3 py-2 rounded-md text-sm font-medium',
  },
  icon: {
    primary: 'text-blue-400',
    secondary: 'text-gray-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  },
} as const; 