import { create } from 'zustand'

import uploadImage from '@/app/lib/uploadImage'

interface ItemsState {
	itemsList: {
		items: ItemsType[]
	}
	item: ItemsType
	id: string
	title: string
	price: string
	image: string
	file: File | null
	allergies: string[]
	allergyInput: string
	setItemsList: (data: object) => void
	setItemAsProps: (props: ItemsType) => void
	setId: (id: string) => void
	setTitle: (title: string) => void
	setPrice: (price: string) => void
	setImage: (image: string) => void
	setFile: (file: File | null) => void
	setAllergies: (allergies: string[]) => void
	setAllergyInput: (allergyInput: string) => void

	getItems: () => void
	setImageFile: (image: File) => Promise<string>
}

export const useItemsStore = create<ItemsState>((set, get) => ({
	itemsList: {
		items: []
	},
	item: {
		id: '',
		title: '',
		price: '',
		allergies: [],
		image: ''
	},
	id: '',
	title: '',
	price: '',
	image: '',
	file: null,
	allergies: [],
	allergyInput: '',

	setItemsList: async (data: object) => {
		const itemsData = data
		if (data)
			for (const [key, items] of Object.entries(itemsData)) {
				set({ itemsList: { items: items } })
			}
	},
	setItemAsProps: (props: ItemsType) => set({ item: props }),
	setId: (str: string) => set({ id: str }),
	setTitle: (input: string) => set({ title: input }),
	setPrice: (input: string) => set({ price: input }),
	setImage: (input: string) => set({ image: input }),
	setFile: (file: File | null) => set({ file: file }),
	setAllergies: (arr: string[]) => set({ allergies: arr }),
	setAllergyInput: (input: string) => set({ allergyInput: input }),

	getItems: () => {},
	setImageFile: async (data: File) => {
		const imageData: string = await uploadImage(data)
		const url: string = imageData
		return url
	}
}))
