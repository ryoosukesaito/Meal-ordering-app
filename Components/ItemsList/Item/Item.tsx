'use client'

import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { CldImage } from 'next-cloudinary'

import { useItemsStore } from '@/store/ItemsStore'
import { useModalStore } from '@/store/ModalStore'

type Props = {
	item: ItemsType
}

export function Item({ item }: Props) {
	const [title, setTitle, setPrice, setImage, setAllergies, setItemAsProps] =
		useItemsStore((state) => [
			state.title,
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
		<div className="h-full rounded-lg border border-zinc-400  shadow-lg ">
			<section className="h-52">
				<CldImage
					className="h-full w-full rounded-md object-cover"
					alt="item-image"
					src={item.image}
					width={300}
					height={300}
				/>
			</section>

			<section className="flex flex-col justify-between p-5 ">
				<div>
					<div className="text-md px-3">{item.title}</div>
					<div className="text-md px-3">$ {item.price}</div>
				</div>
				<div className="flex flex-col justify-between">
					<div className="flex flex-row flex-wrap ">
						{item.allergies.map((allergy: string, idx: number) => (
							<div
								key={idx}
								className="m-1 flex items-center justify-center rounded-full bg-[#FF7474] px-5 py-1 text-sm text-white"
							>
								{allergy}
							</div>
						))}
					</div>
					<button
						className="w-fit rounded-full p-1 hover:bg-[#cbcbcb] hover:text-white"
						onClick={handleModalOpen}
					>
						<PencilSquareIcon className="h-5 w-5" />
					</button>
				</div>
			</section>
		</div>
	)
}
