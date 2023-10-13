'use client'

import { useQuery } from '@apollo/client'
import { Dialog, Transition } from '@headlessui/react'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { CldImage } from 'next-cloudinary'
import { Fragment, useEffect, useState } from 'react'

import { client } from '@/graphql/apollo-client'
import { GET_ALLERGIES_BY_ID_USER } from '@/graphql/queries'
import { useCartStore } from '@/store/CartStore'
import { useItemsStore } from '@/store/ItemsStore'
import { useModalStore } from '@/store/ModalStore'

export function UserModal() {
	const [item] = useItemsStore((state) => [state.item])
	const [isOpenUserModal, closeUserModal] = useModalStore((state) => [
		state.isOpenUserModal,
		state.closeUserModal
	])
	const [cartItems, setCartItems, addOrder] = useCartStore((state) => [
		state.cartItems,
		state.setCartItems,
		state.addOrder
	])

	const { loading, error, data } = useQuery(GET_ALLERGIES_BY_ID_USER, {
		client,
		variables: { id: item.id }
	})

	const [count, setCount] = useState(0)
	const [allergies, setAllergies] = useState([])

	const setAllergiesByID = () => {
		if (!data) return
		setAllergies(data.getAllergiesById.allergies)
	}

	const handleClose = () => {
		setCount(0)
		closeUserModal()
	}

	const handleCounter = (e: React.MouseEvent<HTMLButtonElement>) => {
		const Operations = e.currentTarget.value
		if (Operations === 'minus' && count > 0) {
			setCount((prev) => prev - 1)
		} else if (Operations === 'plus') {
			setCount((prev) => prev + 1)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		addOrder(item, cartItems.items, count)
		handleClose()
	}

	useEffect(() => {
		setAllergiesByID()
	}, [data])

	return (
		<Transition appear show={isOpenUserModal} as={Fragment}>
			<Dialog
				as="form"
				className="relative z-10"
				onSubmit={handleSubmit}
				onClose={handleClose}
			>
				`
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-white bg-opacity-25" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-hidden">
					<div className="flex min-h-full items-center justify-center text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Panel className="w-3/5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all md:w-1/3">
								{loading ? (
									<div>
										Loading...
										<div className="bg-white bg-opacity-25" />
									</div>
								) : (
									<>
										<div className="flex flex-col items-center">
											{/* Image size */}
											<div className="h-44 w-full md:h-52 lg:h-80 lg:w-96 ">
												<CldImage
													alt="item-image"
													className="h-full w-full rounded-2xl object-cover"
													src={item.image}
													width={600}
													height={600}
												/>
											</div>

											<div className="my-3 flex w-fit flex-col items-center px-5 md:mt-5">
												<p className="text-xl font-bold leading-6 text-gray-900">{`${item.title}`}</p>
												<p className="text-lg">${`${item.price}`}</p>
											</div>

											<section className="flex w-full flex-col ">
												<div className="my-4 flex w-full max-w-lg flex-row flex-wrap justify-start px-4">
													{allergies?.map((allergy: string, idx: number) => (
														<div
															key={idx}
															className="mr-2 flex w-fit flex-row items-center rounded-full border border-[#FF7474] bg-white px-4 py-1 text-sm text-[#FF7474]"
														>
															{allergy}
														</div>
													))}
												</div>
											</section>
											<div className="my-2 flex max-w-sm flex-row">
												<button
													type="button"
													value="minus"
													onClick={handleCounter}
													className="mx-3 text-green-500"
												>
													<MinusCircleIcon className="h-6 w-6" />
												</button>

												<div>{`${count}`}</div>

												<button
													type="button"
													value="plus"
													onClick={handleCounter}
													className="mx-3 text-green-500"
												>
													<PlusCircleIcon className="h-6 w-6" />
												</button>
											</div>

											<button
												type="submit"
												disabled={count === 0}
												className="flex justify-center rounded-full border bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
											>
												Add cart
											</button>
										</div>
									</>
								)}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
