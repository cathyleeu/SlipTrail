import { create } from 'zustand'

type ReceiptImageState = {
  imageUrl: string | null
  setImageUrl: (source: File | Blob | string | null) => void
  clearImageUrl: () => void
}

export const useReceiptImageStore = create<ReceiptImageState>((set, get) => ({
  imageUrl: null,

  setImageUrl: (source) => {
    // release previous ObjectURL memory
    const prev = get().imageUrl
    if (prev && prev.startsWith('blob:')) {
      URL.revokeObjectURL(prev)
    }

    // Convert File/Blob to ObjectURL
    if (source instanceof File || source instanceof Blob) {
      const objectUrl = URL.createObjectURL(source)
      set({ imageUrl: objectUrl })
    } else {
      set({ imageUrl: source })
    }
  },

  clearImageUrl: () => {
    const url = get().imageUrl
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
    set({ imageUrl: null })
  },
}))
