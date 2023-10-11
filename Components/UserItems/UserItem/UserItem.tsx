'use client'

import { CldImage } from 'next-cloudinary'

import { useItemsStore } from '@/store/ItemsStore'
import { useModalStore } from '@/store/ModalStore'
type Props = {
	item: ItemsType
}

export function UserItem({ item }: Props) {
	const [setItemAsProps, setId] = useItemsStore((state) => [
		state.setItemAsProps,
		state.setId
	])
	const openUserModal = useModalStore((state) => state.openUserModal)

	const handleModalOpen = () => {
		setItemAsProps(item)
		openUserModal()
	}

	return (
		<>
			<button onClick={handleModalOpen}>
				<div className="h-full rounded-lg shadow-lg hover:cursor-pointer ">
					<section className="h-64  rounded-t-md">
						<CldImage
							className="h-full w-full  rounded-t-md object-cover "
							alt="item-image"
							src={item.image}
							width={300}
							height={300}
						/>
					</section>
					<section className="flex h-28 flex-col justify-between p-5 ">
						<div className="flex h-full flex-col justify-between">
							<div className="text-md px-3">{item.title}</div>
							<div className="text-md px-3 text-xl font-bold text-gray-600">
								$ {item.price}
							</div>
						</div>
					</section>
				</div>
			</button>
		</>
	)
}
