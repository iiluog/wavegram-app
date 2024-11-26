// Utility styles riutilizzabili
export const utilities = {
  flexLayout: {
    center: 'flex items-center justify-center',
    between: 'flex justify-between items-center',
    column: 'flex flex-col',
  },
  container: {
    fullScreen: `min-h-screen bg-background`,
    maxWidth: 'w-full max-w-xl',
    maxWidthMd: 'w-full max-w-md'
  }
};

// Stili comuni per l'applicazione
export const customStyles = {
  // Layout containers (esistenti per retrocompatibilità)
  pageContainer: `${utilities.container.fullScreen} text-textPrimary flex justify-center`,
  formContainer: `${utilities.container.fullScreen} ${utilities.flexLayout.center} ${utilities.flexLayout.column} wg-padding-standard`,
  // Headers
  header: {
    base: `sticky top-0 w-full bg-background z-header h-14 px-4 py-3`,
  },
  // Post styles
  post: {
    container: "mb-6 pb-6",
    header: {
      wrapper: `${utilities.flexLayout.between} px-4 py-2`,
      userInfo: `${utilities.flexLayout.center} gap-2`,
    },
    image: {
      wrapper: "relative overflow-hidden w-full aspect-[1/1.1]",
      carousel: "w-full flex h-full",
      img: "w-full h-full object-cover",
      dots: "absolute bottom-[10px] left-1/2 -translate-x-1/2 flex",
      dot: "w-2 h-2 rounded-full bg-white/50 mx-1 cursor-pointer",
      dotActive: "!bg-white",
    },
    actions: {
      wrapper: "px-4 pt-3",
      buttons: `flex gap-2`,
      button: "w-6 h-6",
      info: `flex flex-col items-end justify-center wg-txt-info`
    },
    tags: {
      badge: "flex items-center mx-0 border border-primary gap-1.5 pl-1 pr-2 py-1 bg-primary",
      badgeText: "text-background uppercase text-m",
      badgeImage: "wg-profile-image h-5 w-5",
      badgeAdd: "flex items-center gap-1.5 px-3 py-1 border border-primary cursor-pointer",
      badgeAddText: "text-primary text-m",
      badgeAddIcon: "w-4 h-4 text-primary"
    }
  },

  // Modal styles
  modal: {
    overlay: `fixed inset-0 bg-popover ${utilities.flexLayout.center} wg-padding-standard z-modal overflow-y-auto`,
    container: `bg-background wg-rounded w-full max-w-md wg-padding-standard relative max-h-[90vh] overflow-y-auto`,
    header: `${utilities.flexLayout.between} mb-6`,
    imageUpload: {
      container: "border-2 border-dashed border-gray-400 wg-rounded wg-padding-standard mb-4 min-h-[200px]",
      preview: "grid grid-cols-2 gap-2 w-full",
      previewItem: "relative w-full h-32 object-cover wg-rounded"
    },
    input: "w-full bg-white text-textPrimary p-3 wg-rounded mb-4",
    textarea: "w-full bg-white text-textPrimary p-3 wg-rounded mb-4 min-h-[100px]"
  },

  // Loading states
  loadingSpinner: `inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary`,
  loadingContainer: "text-center wg-padding-standard",

  // Error states
  errorContainer: `min-h-screen bg-background text-textPrimary ${utilities.flexLayout.center}`,

};
