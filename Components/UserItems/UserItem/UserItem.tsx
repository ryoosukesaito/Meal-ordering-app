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

	const handleModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		const id = e.currentTarget.value
		setId(id)
		setItemAsProps(item)
		openUserModal()
	}

	return (
		<>
			<button onClick={handleModalOpen} value={item.id}>
				<div className="h-full rounded-lg border border-zinc-400  shadow-lg hover:cursor-pointer">
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
					</section>
				</div>
			</button>
		</>
	)
}