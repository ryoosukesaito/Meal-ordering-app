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
	setQuantity: (input: number) => set({ quantity: input })
}))
