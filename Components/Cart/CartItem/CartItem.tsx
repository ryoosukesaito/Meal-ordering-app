import {
	MinusCircleIcon,
	PlusCircleIcon,
	XCircleIcon
} from '@heroicons/react/24/outline'
import { CldImage } from 'next-cloudinary'
import React, { useCallback, useMemo, useState } from 'react'

import { useCartStore } from '@/store/CartStore'

interface ItemData {
	item: CartItem
	idx: number
}

export const CartItem: React.FC<ItemData> = ({ item, idx }) => {
	const [cartItems, setCartItems] = useCartStore((state) => [
		state.cartItems,
		state.setCartItems
	])
	const [itemCount, setItemCount] = useState(item.count)
	const currItemsData: CartItem[] = cartItems.items

	const updateItemCount = useMemo(() => {
		currItemsData[idx].count = itemCount
		setCartItems(currItemsData)
	}, [itemCount])

	const handleCounter = (e: React.MouseEvent<HTMLButtonElement>) => {
		const Operations = e.currentTarget.value
		if (Operations === 'minus' && itemCount > 1) {
			setItemCount((prev) => prev - 1)
		} else if (Operations === 'plus') {
			setItemCount((prev) => prev + 1)
		}
	}

	const deleteItem = useCallback(() => {
		currItemsData.splice(idx, 1)
		setCartItems(currItemsData)
	}, [])

	return (
		<>
			{item && (
				<div className="flex items-center justify-between">
					<div className=" h-32 w-full ">
						<CldImage
							alt="item-image"
							className="h-full w-full rounded-2xl object-cover"
							src={item.image}
							width={300}
							height={300}
						/>
					</div>
					<div className="flex-1">
						<p className="font-semibold">{`${item.title}`}</p>
						<p className="text-sm text-gray-500">Price: $ {`${item.price}`}</p>
					</div>
					<div className="flex items-center space-x-2">
						<button
							value="minus"
							onClick={handleCounter}
							className="rounded-full bg-blue-500 p-1  text-white"
						>
							<MinusCircleIcon className="h-6 w-6" />
						</button>
						<span className="mx-3">{`${itemCount}`}</span>
						<button
							value="plus"
							onClick={handleCounter}
							className="rounded-full bg-blue-500 p-1  text-white"
						>
							<PlusCircleIcon className="h-6 w-6" />
						</button>
					</div>
				</div>
			)}
			<button onClick={deleteItem}>
				<XCircleIcon className="h-6 w-6 text-red-700" />
			</button>
		</>
	)
}
