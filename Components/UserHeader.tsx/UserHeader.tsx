'use client'

import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

import { useCartStore } from '@/store/CartStore'
import { useModalStore } from '@/store/ModalStore'

export const UserHeader = () => {
	const [openCart] = useModalStore((state) => [state.openCart])
	const [cartItems] = useCartStore((state) => [state.cartItems])

	return (
		<div className="fixed z-20 w-full bg-white text-black shadow-2xl">
			<div className="flex h-14 items-center justify-between px-5">
				<Link
					href={'/user'}
					className="inline-flex items-center text-lg font-semibold hover:text-gray-300"
				>
					<Image
						alt="Logo"
						src={'/order-meal-logo.png'}
						width={100}
						height={100}
						className="mr-3 h-9 w-9"
					/>
					<p>Order meal app</p>
				</Link>
				<div className="mr-3">
					<button onClick={openCart} title="Open order list">
						<ClipboardDocumentCheckIcon className="h-8 w-8" />
					</button>
					{useMemo(
						() => (
							<div>
								{cartItems.items.length > 0 && (
									<span className="fixed right-3 top-1 rounded-full bg-red-600 px-2  py-1 text-xs text-white">
										{`${cartItems.items.length}`}
									</span>
								)}
							</div>
						),
						[cartItems]
					)}
				</div>
			</div>
		</div>
	)
}
