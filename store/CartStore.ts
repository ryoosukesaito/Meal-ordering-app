import { create } from 'zustand'

interface CartState {
  cartItems: {
    items: CartItem[]
  }
  price: string
  quantity: number
  setCartItems: (item: CartItem[]) => void
  setPrice: (input: string) => void
  setQuantity: (input: number) => void
  addOrder: (addItem: ItemsType, items: CartItem[], count: number) => void
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: {
    items: [],
    count: 0
  },

  price: '',
  quantity: 0,

  setCartItems: (data: CartItem[]) => set({ cartItems: { items: data } }),

  setPrice: (input: string) => set({ price: input }),
  setQuantity: (input: number) => set({ quantity: input }),

  addOrder: (addItem: ItemsType, items: CartItem[], count: number) => {
    const { id, title, price, image } = addItem
    const tempItems = items

    const newItemData: CartItem = {
      id: id,
      title: title,
      price: price,
      image: image,
      count: count
    }
    const foundIndex = tempItems.findIndex((item) => item.id === id)

    if (foundIndex !== -1) {
      const targetItem = tempItems[foundIndex]

      targetItem.count += count
      tempItems.splice(foundIndex, 1, targetItem)
      set({ cartItems: { items: tempItems } })
    } else {
      const updatedItemData = [...tempItems, newItemData]
      set({ cartItems: { items: updatedItemData } })
    }
  }
}))
