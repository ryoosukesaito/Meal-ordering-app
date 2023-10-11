import { useItemsStore } from '@/store/ItemsStore'

interface InputValue {
	id: number
}

export const Input: React.FC<InputValue> = ({ id }) => {
	const [title, setTitle, price, setPrice] = useItemsStore((state) => [
		state.title,
		state.setTitle,
		state.price,
		state.setPrice
	])
	return (
		<div>
			<p className=" text-2xl font-bold">{`${id === 0 ? 'Title' : 'Price'}`}</p>
			<div className="flex flex-row items-center ">
				{id === 1 && <p className="mr-2 font-bold">$</p>}
				<input
					type="text"
					placeholder={`${id === 0 ? 'Title' : 'Price'}`}
					className="my-3 w-full rounded-md border border-gray-300 px-4 py-2 outline-none"
					value={`${id === 0 ? title : price}`}
					onChange={(e) =>
						`${id === 0 ? setTitle(e.target.value) : setPrice(e.target.value)}`
					}
					required
				/>
			</div>
		</div>
	)
}
