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
				{id === 1 && <p className="font-bold mr-2">$</p>}
				<input
					type="text"
					placeholder={`${id === 0 ? 'Title' : 'Price'}`}
					className="border border-gray-300 rounded-md outline-none py-2 px-4 w-full my-3"
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
