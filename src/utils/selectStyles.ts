export const getSelectStyles = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
      backgroundColor: isDark ? '#1f2937' : '#fff',
      color: isDark ? '#f3f4f6' : '#111827',
      '&:hover': {
        borderColor: isDark ? '#374151' : '#9ca3af',
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? '#1f2937' : '#fff',
      color: isDark ? '#f3f4f6' : '#111827',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused 
        ? (isDark ? '#374151' : '#f3f4f6')
        : 'transparent',
      color: isDark ? '#f3f4f6' : '#111827',
      '&:hover': {
        backgroundColor: isDark ? '#374151' : '#f3f4f6',
      },
    }),
    multiValue: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.data.color || '#6b7280',
      color: '#fff',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#fff',
      fontSize: '0.75rem',
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#fff',
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDark ? '#9ca3af' : '#6b7280',
    }),
  };
};