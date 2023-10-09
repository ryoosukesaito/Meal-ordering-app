import { create } from 'zustand'

interface CartState {
	cartItems: {
		items: CartItem[]
	}
	setCartItems: (item: CartItem[]) => void
}

export const useCartStore = create<CartState>((set, get) => ({
	cartItems: {
		items: [],
		count: 0
	},
	setCartItems: (data: CartItem[]) => set({ cartItems: { items: data } })
}))
