'use client'

import { useQuery } from '@apollo/client'
import { useEffect } from 'react'

import { Cart } from '@/app/Components/Cart/Cart'
import { client } from '@/app/graphql/apollo-client'
import { GET_ALL_ITEMS_USER } from '@/app/graphql/queries'
import { useItemsStore } from '@/app/admin/store/ItemsStore'
import { useModalStore } from '@/app/admin/store/ModalStore'

import { UserItem } from './UserItem/UserItem'

export function UserItems() {
	const { loading, error, data } = useQuery(GET_ALL_ITEMS_USER, {
		client
	})
	const [itemsList, setItemsList] = useItemsStore((state) => [
		state.itemsList,
		state.setItemsList
	])

	const [cartVisible] = useModalStore((state) => [state.cartVisible])

	const getItem = () => {
		setItemsList(data)
	}

	useEffect(() => {
		getItem()
	}, [data])

	if (loading) <p>Loading...</p>
	if (error) <p>Error: {error.message}</p>

	return (
		<>
			{cartVisible && <Cart />}
			<div className="no-scrollbar h-full w-full overflow-y-scroll pt-20 md:px-20">
				<div className="rounded-xl bg-white px-5 py-10 shadow-lg md:px-16">
					<div className="grid grid-cols-2 gap-5  md:grid-cols-3 lg:grid-cols-4 ">
						{itemsList?.items?.map((data: ItemsType, id: number) => (
							<UserItem key={id} item={data} />
						))}
					</div>
				</div>
			</div>
		</>
	)
}
