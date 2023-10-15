'use client'

import { Menu, Transition } from '@headlessui/react'
import {
	ChevronDownIcon,
	ClipboardDocumentCheckIcon,
	ShoppingCartIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useMemo } from 'react'

import { useCartStore } from '@/store/CartStore'
import { useModalStore } from '@/store/ModalStore'

export const UserHeader = () => {
	const [openCart] = useModalStore((state) => [state.openCart])
	const [cartItems] = useCartStore((state) => [state.cartItems])

	const handleOpenHistory = () => {
		window.location.replace('/user/history')
	}

	return (
		<div className="fixed z-20 w-full bg-white text-black shadow-2xl">
			<div className="flex h-14 items-center justify-between px-5">
				<Link
					href={'/user'}
					className="inline-flex items-center text-lg font-semibold hover:text-gray-300"
				>
					{/* <div></div> */}
					<Image
						alt="Logo"
						src={'/assets/order-meal-logo.png'}
						width={100}
						height={100}
						className="mr-3 h-9 w-9"
					/>
					<p>Order meal app</p>
				</Link>
				<div className="mr-3 inline-flex">
					<button
						onClick={openCart}
						className="relative"
						title="Open order list"
					>
						<ShoppingCartIcon className="mr-5 h-6 w-6" />
						{useMemo(
							() => (
								<div>
									{cartItems.items.length > 0 && (
										<span className="absolute right-0 top-0 rounded-full bg-red-600 px-2  py-1 text-xs text-white">
											{`${cartItems.items.length}`}
										</span>
									)}
								</div>
							),
							[cartItems]
						)}
					</button>

					<section>
						<Menu
							as="div"
							className="relative inline-block text-left"
							title="Open the menu"
						>
							<div>
								<Menu.Button className="group inline-flex w-full items-center justify-center rounded-md bg-opacity-20 px-2 py-1 text-sm font-medium text-black hover:bg-gray-100">
									<ClipboardDocumentCheckIcon className="h-8 w-8" />
									<ChevronDownIcon
										className="-mr-1 ml-2 h-5 w-5 text-gray-300 group-hover:text-gray-500"
										aria-hidden="true"
									/>
								</Menu.Button>
							</div>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div className="px-1 py-1 ">
										<Menu.Item>
											{({ active }) => (
												<button
													onClick={handleOpenHistory}
													className={`${
														active ? 'bg-gray-200 text-black' : 'text-gray-500'
													} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
												>
													History
												</button>
											)}
										</Menu.Item>
									</div>
								</Menu.Items>
							</Transition>
						</Menu>
					</section>
				</div>
			</div>
		</div>
	)
}
