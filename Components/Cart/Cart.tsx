'use client'

import {
	ChevronLeftIcon,
	ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import { useMemo } from 'react'

import { useCartStore } from '@/store/CartStore'
import { useModalStore } from '@/store/ModalStore'

import { CartItem } from './CartItem/CartItem'

export const Cart = () => {
	const [cartItems, setCartItems, price, quantity, setPrice, setQuantity] =
		useCartStore((state) => [
			state.cartItems,
			state.setCartItems,
			state.price,
			state.quantity,
			state.setPrice,
			state.setQuantity
		])
	const [cartVisible, closeCart] = useModalStore((state) => [
		state.cartVisible,
		state.closeCart
	])

	const calculateTotalFunc = useMemo(() => {
		if (cartItems) {
			const total = cartItems.items.reduce(
				(sum, item) => {
					sum[0] += Number(item.price) * item.count
					sum[1] += item.count
					return sum
				},
				[0, 0]
			)
			setPrice(total[0].toFixed(2))
			setQuantity(total[1])
		}
	}, [cartItems])

	const handleSubmit = () => {
		setCartItems([])
	}

	return (
		<>
			{/* background layer */}
			<div className="fixed inset-0 z-40 w-full">
				{/* cart section */}
				<div
					className={`absolute h-full min-h-screen w-full bg-[#F1EEEE] px-2 py-5 shadow-2xl duration-500 ease-in-out sm:px-8 md:w-1/3 ${
						!cartVisible ? '-right-full' : 'right-0'
					}`}
				>
					<div className="flex h-full flex-col">
						<div>
							<button onClick={closeCart} className="my-3">
								<ChevronLeftIcon className="h-6 w-6" />
							</button>
						</div>
						{cartItems.items.length === 0 ? (
							<div className="flex h-full w-full flex-col items-center justify-center ">
								<ClipboardDocumentIcon className="h-20 w-20 text-gray-400" />
								<p className="text-lg text-gray-400">No order yet...</p>
							</div>
						) : (
							// {/* cart items */}
							<div className="no-scrollbar mb-1 h-full max-h-[550px]  overflow-y-scroll">
								{cartItems?.items.map((item: CartItem, idx: number) => (
									<div key={idx}>
										<CartItem item={item} idx={idx} />
									</div>
								))}
							</div>
						)}
						<div className="border-t-2 border-black">
							<div className="my-2 flex flex-row items-center justify-center">
								<p className="text-lg font-bold">Total</p>
								<p className="font-semibold">({`${quantity}`} items):</p>
								<p className="text-xl font-bold">$ {`${price}`}</p>
							</div>

							<div className="flex w-full items-center justify-center">
								<button
									disabled={quantity === 0}
									className="cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D]
									disabled:cursor-not-allowed
									disabled:bg-gray-200
									disabled:text-gray-400
									"
									onClick={handleSubmit}
								>
									Order
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="fixed inset-0 z-30 bg-white bg-opacity-40 " />
		</>
	)
}
