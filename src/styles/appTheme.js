// Theme esteso con più utility
export const theme = {
  colors: {
    background: '#E6E6E6',
    text: '#1D1D1D',
    textSecondary: '#5E5E5E',
    primary: '#1D1D1D',
    error: '#DC2626',
    success: '#059669',
    white: '#FFFFFF',
    border: '#gray-300',
  },
  spacing: {
    standard: 'p-4',
    rounded: 'rounded-lg'
  },
  flexLayout: {
    center: 'flex items-center justify-center',
    between: 'flex justify-between items-center',
    column: 'flex flex-col',
    gap2: 'gap-2',
    gap4: 'gap-4'
  },
  typography: {
    title: 'text-4xl font-bold',
    subtitle: 'text-2xl font-medium',
    body: 'text-base',
    small: 'text-sm'
  }
};

// Utility styles riutilizzabili
export const utilities = {
  container: {
    fullScreen: `min-h-screen bg-[${theme.colors.background}]`,
    maxWidth: 'w-full max-w-xl',
    maxWidthMd: 'w-full max-w-md'
  },
  input: {
    base: `w-full bg-[${theme.colors.white}] text-[${theme.colors.text}] rounded-lg p-4 focus:outline-none focus:border-gray-500`
  },
  button: {
    primary: `w-full bg-[${theme.colors.primary}] text-white rounded-lg p-4 hover:bg-opacity-90 transition-colors`
  }
};

// Stili comuni per l'applicazione
export const customStyles = {
  // Layout containers (esistenti per retrocompatibilità)
  pageContainer: `min-h-screen bg-[${theme.colors.background}] text-[${theme.colors.text}] flex justify-center`,

  // Headers
  header: {
    base: `sticky top-0 bg-[${theme.colors.background}] z-50 px-4 py-3`,
    wrapper: `${theme.flexLayout.between}`,
    date: `text-2xl font-medium text-[${theme.colors.text}]`,
    actions: `${theme.flexLayout.center}`
  },

  // Auth pages
  auth: {
    container: `${utilities.container.fullScreen} ${theme.flexLayout.center} ${theme.flexLayout.column} p-4`,

    form: "space-y-4",

    link: "text-blue-600 hover:text-blue-500"
  },

  // Post styles
  post: {
    container: "mb-6 pb-6",
    divider: `w-full h-[1px] bg-[${theme.colors.text}] mb-4`,
    header: {
      wrapper: `${theme.flexLayout.between} px-4 py-2`,
      userInfo: `${theme.flexLayout.center} gap-2`,
      username: `text-2xl uppercase font-medium text-[${theme.colors.text}]`,
      counter: `text-2xl font-medium text-[${theme.colors.text}]`
    },
    image: {
      wrapper: "relative px-4",
      img: "w-full aspect-square object-cover"
    },
    actions: {
      wrapper: "px-4 pt-3",
      container: `${theme.flexLayout.between}`,
      buttons: `flex ${theme.flexLayout.gap4}`,
      button: "w-6 h-6",
      info: `flex flex-col text-base items-end justify-center text-[${theme.colors.textSecondary}] leading-tight`
    },
    description: `text-sm font-normal mb-2 text-[${theme.colors.text}] text-base`
  },

  // Modal styles
  modal: {
    overlay: `fixed inset-0 bg-[${theme.colors.text}] bg-opacity-50 ${theme.flexLayout.center} p-4 z-[100] overflow-y-auto`,
    container: `bg-[${theme.colors.background}] ${theme.spacing.rounded} w-full max-w-md ${theme.spacing.standard} relative max-h-[90vh] overflow-y-auto`,
    header: `${theme.flexLayout.between} mb-6`,
    title: `text-xl text-[${theme.colors.text}] font-bold`,
    closeButton: `text-[${theme.colors.text}]`,
    imageUpload: {
      container: "border-2 border-dashed border-gray-400 rounded-lg p-4 mb-4 min-h-[200px]",
      preview: "grid grid-cols-2 gap-2 w-full",
      previewItem: "relative w-full h-32 object-cover rounded"
    },
    input: "w-full bg-white text-[#1D1D1D] p-3 rounded mb-4",
    textarea: "w-full bg-white text-[#1D1D1D] p-3 rounded mb-4 min-h-[100px]"
  },

  // Images
  profileImage: "w-7 h-7 rounded-full object-cover",
  logo: "w-full max-w-xl py-2",

  // Buttons
  iconButton: `text-3xl ml-2 font-bold text-[${theme.colors.text}] cursor-pointer hover:opacity-80`,

  // Loading states
  loadingSpinner: `inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[${theme.colors.text}]`,
  loadingContainer: "text-center p-4",

  // Error states
  errorContainer: `min-h-screen bg-[${theme.colors.background}] text-[${theme.colors.text}] ${theme.flexLayout.center}`,

  // Main content
  mainContent: "pb-24"
};
