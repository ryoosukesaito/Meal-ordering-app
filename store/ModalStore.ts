import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  isOpenUserModal: boolean
  openUserModal: () => void
  closeUserModal: () => void
  cartVisible: boolean
  openCart: () => void
  closeCart: () => void
}

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  isOpenUserModal: false,
  openUserModal: () => set({ isOpenUserModal: true }),
  closeUserModal: () => set({ isOpenUserModal: false }),
  cartVisible: false,
  openCart: () => set({ cartVisible: true }),
  closeCart: () => set({ cartVisible: false })
}))
