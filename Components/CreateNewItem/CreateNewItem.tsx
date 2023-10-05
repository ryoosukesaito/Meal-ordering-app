'use client'

import { useMutation } from '@apollo/client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { client } from '@/graphql/apollo-client'
import { ADD_NEW_ITEM } from '@/graphql/queries'
import { useItemsStore } from '@/store/ItemsStore'

import { AllergiesInput } from './AllergiesInput/AllergiesInput'
import { ImageInput } from './ImageInput/ImageInput'
import { Input } from './Input/Input'

export function CreateNewItem() {
	const [title, price, file, setFile, allergies, setImageFile] = useItemsStore(
		(state) => [
			state.title,
			state.price,
			state.file,
			state.setFile,
			state.allergies,
			state.setImageFile
		]
	)
	const [loading, setLoading] = useState<boolean>(false)
	const [addNewItem, { error }] = useMutation(ADD_NEW_ITEM, {
		client
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		try {
			if (file) {
				const imageURL = await setImageFile(file)
				await addNewItem({
					variables: {
						id: uuidv4(),
						title: title,
						price: price,
						allergies: allergies,
						image: imageURL
					}
				})
			}

			setLoading(false)
			window.location.replace('/admin/dashboard')
		} catch (error) {
			console.log('There is something wrong in addNewItem >> ', error)
			setLoading(false)
		}
	}

	if (loading)
		return (
			<div>
				<div className="text-2xl font-bold">loading...</div>
				<div className="bg-white opacity-10" />
			</div>
		)

	if (error) return <div>{`${error.message}`}</div>

	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="mx-16 my-10 flex h-5/6 w-full flex-col items-center justify-center rounded-xl border border-gray-500 p-10 shadow-lg">
				<form
					onSubmit={handleSubmit}
					className="mb-3 flex h-full w-full flex-col items-center py-2"
				>
					{/* top container */}
					<div className="grid h-fit w-full grid-flow-row grid-cols-2 gap-5">
						<div className="flex flex-col justify-start">
							<div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-300">
								{file ? (
									<Image
										alt="item-image"
										className="cursor-not-allowed hover:grayscale"
										width={600}
										height={600}
										src={URL.createObjectURL(file)}
										onClick={() => {
											setFile(null)
										}}
									/>
								) : (
									<div className="text-gray-600">No image..</div>
								)}
							</div>
						</div>

						<div className="flex flex-col pl-6">
							{/* image */}
							<ImageInput />

							{/* title */}
							<Input id={0} />

							{/* Price */}
							<Input id={1} />
						</div>
					</div>
					{/* Top container end */}

					{/* Allergies Input */}
					<div className="ml-5 mt-8 flex h-auto w-full justify-start">
						<AllergiesInput />
					</div>
					<div className="pt-5">
						<button
							type="submit"
							className="cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D]"
						>
							Update
						</button>
					</div>
				</form>

				<Link href={'/admin/dashboard'}>
					<button type="button">Cancel</button>
				</Link>
			</div>
		</div>
	)
}
