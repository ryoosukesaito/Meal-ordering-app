'use client'

import { Dialog, Transition } from '@headlessui/react'
import {
	ArrowDownTrayIcon,
	PlusCircleIcon,
	XMarkIcon
} from '@heroicons/react/24/outline'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import { CldImage } from 'next-cloudinary'
import { Fragment, useRef, useState } from 'react'

import { db } from '@/firebase'
import { useItemsStore } from '@/app/admin/store/ItemsStore'
import { useModalStore } from '@/app/admin/store/ModalStore'

import deleteImage from '@/app/lib/deleteImage'

export function Modal() {
	const [
		item,
		title,
		setTitle,
		price,
		setPrice,
		setImage,
		file,
		setFile,
		allergies,
		setAllergies,
		allergyInput,
		setAllergyInput,
		setImageFile
	] = useItemsStore((state) => [
		state.item,
		state.title,
		state.setTitle,
		state.price,
		state.setPrice,
		state.setImage,
		state.file,
		state.setFile,
		state.allergies,
		state.setAllergies,
		state.allergyInput,
		state.setAllergyInput,
		state.setImageFile
	])

	const [isOpen, closeModal] = useModalStore((state) => [
		state.isOpen,
		state.closeModal
	])

	const [loading, setLoading] = useState(false)
	const imagePickerRef = useRef<HTMLInputElement>(null)

	const handleAllergyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAllergyInput(e.target.value)
	}

	const addAllergy = () => {
		if (allergyInput.trim() !== '') {
			setAllergies([...allergies, allergyInput])
			setAllergyInput('')
		}
	}

	const deleteAllergy = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		const id = Number(e.currentTarget.value)
		const updateAllergy = [...allergies]
		updateAllergy.splice(id, 1)
		setAllergies(updateAllergy)
	}

	const handleClose = () => {
		closeModal()
		setImage('')
		window.location.reload()
	}

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			let imageURL = item.image
			if (file) {
				const URL = await setImageFile(file)
				imageURL = URL
			}

			// update the item
			await updateDoc(doc(db, 'items', item.id), {
				title: title,
				price: price,
				allergies: allergies,
				image: imageURL
			})

			handleClose()
		} catch (error) {
			console.log('There is something wrong in updateItem >> ', error)
		}
	}

	const handleDelete = async () => {
		try {
			await deleteImage(item.image)

			// delete the item

			const response = await deleteDoc(doc(db, 'items', item.id))

			window.location.reload()
			handleClose()
		} catch (error) {
			console.error('something wrong in handleDelete', error)
		}
	}

	if (loading) return <div>Loading...</div>

	return (
		// Use the `Transition` component at the root level
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as="form"
				className="relative z-10"
				onSubmit={handleUpdate}
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
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-y-auto">
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
							<Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="flex items-center justify-between pb-2 text-xl font-bold leading-6 text-gray-900"
								>
									Edit Item
									<button
										type="button"
										className="mb-5 cursor-pointer rounded-lg bg-[#FF7474] px-6 py-2 text-sm text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
										onClick={() => {
											handleDelete()
										}}
									>
										DELETE
									</button>
								</Dialog.Title>
								<div className="flex flex-col items-center">
									<div className="grid w-full grid-cols-2 gap-4">
										{/* Image size */}
										<div className=" h-72 w-full ">
											{file ? (
												<Image
													alt="item-image"
													className="h-full w-full cursor-not-allowed rounded-2xl object-cover filter transition-all duration-150 hover:grayscale"
													width={600}
													height={600}
													src={URL.createObjectURL(file)}
													onClick={() => {
														setFile(null)
													}}
												/>
											) : (
												<CldImage
													alt="item-image"
													className="h-full w-full rounded-2xl object-cover"
													src={item.image}
													width={600}
													height={600}
												/>
											)}
										</div>

										<section className="mx-3 w-1/2 px-3">
											{/* image input*/}
											<div className="mb-3 w-fit">
												<p className=" text-2xl font-bold">Image</p>

												<button
													type="button"
													onClick={() => {
														imagePickerRef.current?.click()
													}}
													className="my-3 flex w-fit flex-row items-center rounded-full border border-gray-300 px-5 py-2 font-medium hover:bg-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												>
													upload image
													<div className="mx-3">
														<ArrowDownTrayIcon className="h-5 w-5" />
													</div>
												</button>

												<input
													ref={imagePickerRef}
													type="file"
													hidden
													onChange={(e) => {
														if (!e.target.files![0].type.startsWith('image/'))
															return
														setFile(e.target.files![0])
													}}
												/>
											</div>

											{/* title input */}
											<div className="my-3">
												<p className=" text-2xl font-bold">Title</p>
												<div className="max-w-md">
													<input
														type="text"
														className="my-3 w-full rounded-md border border-gray-300 px-4 py-2 outline-none"
														placeholder={item.title}
														value={title}
														onChange={(e) => setTitle(e.target.value)}
													/>
												</div>
											</div>

											{/* price input */}
											<div className="my-3">
												<p className=" text-2xl font-bold">Price</p>
												<div className="flex flex-row items-center ">
													<p className="mr-2 font-bold">$</p>
													<input
														type="text"
														className="my-3 w-full rounded-md border border-gray-300 px-4 py-2 outline-none"
														placeholder={item.price}
														value={price}
														onChange={(e) => setPrice(e.target.value)}
													/>
												</div>
											</div>
										</section>
									</div>

									<section className="m-5 flex w-full flex-col ">
										<div className="my-4 flex w-full max-w-lg flex-row flex-wrap justify-start">
											{allergies?.map((allergy: string, idx: number) => (
												<div
													key={idx}
													className="group/btn flex w-fit flex-row items-center rounded-full border-[#FF7474] bg-[#FF7474] py-1 pl-6 pr-1 text-white hover:bg-[#ffe3e3] hover:text-[#8D8D8D]"
												>
													{allergy}
													<button
														onClick={deleteAllergy}
														value={idx}
														className="invisible pr-1 text-[#FF7474] group-hover/btn:visible"
													>
														<XMarkIcon className="h-5 w-5" />
													</button>
												</div>
											))}
										</div>

										<div className="flex max-w-sm flex-row">
											<input
												type="text"
												placeholder="Add allergy"
												className="rounded-md border border-gray-300 px-4 py-2 outline-none"
												value={allergyInput}
												onChange={handleAllergyInputChange}
											/>
											<button
												type="button"
												onClick={addAllergy}
												className="mx-3 text-green-500"
											>
												<PlusCircleIcon className="h-6 w-6" />
											</button>
										</div>
									</section>

									<button
										type="submit"
										className="flex justify-center rounded-full border bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
									>
										Update
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
