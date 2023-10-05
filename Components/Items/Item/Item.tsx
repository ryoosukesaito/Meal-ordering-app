'use client'

import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { CldImage } from 'next-cloudinary'
import { useItemsStore } from '@/store/ItemsStore'
import { useModalStore } from '@/store/ModalStore'

type Props = {
	item: ItemsType
}

export function Item({ item }: Props) {
	const [setTitle, setPrice, setImage, setAllergies, setItemAsProps] =
		useItemsStore((state) => [
			state.setTitle,
			state.setPrice,
			state.setImage,
			state.setAllergies,
			state.setItemAsProps
		])
	const openModal = useModalStore((state) => state.openModal)

	const handleModalOpen = () => {
		openModal()
		setItemAsProps(item)
		setTitle(item.title)
		setPrice(item.price)
		setAllergies(item.allergies)
		setImage(item.image)
	}

	return (
		<div className="rounded-lg shadow-lg border border-zinc-400  h-full ">
			<section className="h-52">
				<CldImage
					className="w-full rounded-md h-full object-cover"
					alt="item-image"
					src={item.image}
					width={300}
					height={300}
				/>
			</section>
			<section className="p-5 flex flex-col justify-between ">
				<div>
					<div className="text-md px-3">{item.title}</div>
					<div className="text-md px-3">$ {item.price}</div>
				</div>
				<div className="flex justify-between flex-col">
					<div className="flex flex-row ">
						{item.allergies.map((allergy: string, idx: number) => (
							<div
								key={idx}
								className="rounded-full bg-[#FF7474] text-white px-5 py-1 text-sm mx-1 flex items-center justify-center"
							>
								{allergy}
							</div>
						))}
					</div>
					<button
						className="rounded-full p-1 w-fit hover:bg-[#cbcbcb] hover:text-white"
						onClick={handleModalOpen}
					>
						<PencilSquareIcon className="h-5 w-5" />
					</button>
				</div>
			</section>
		</div>
	)
}
