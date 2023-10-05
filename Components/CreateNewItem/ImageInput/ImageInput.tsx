import { useRef } from 'react'

import { useItemsStore } from '@/store/ItemsStore'

export const ImageInput: React.FC = () => {
	const [setFile] = useItemsStore((state) => [state.setFile])

	const imagePickerRef = useRef<HTMLInputElement>(null)

	return (
		<div className="w-fit">
			<p className=" text-2xl font-bold">Image</p>

			<button
				type="button"
				onClick={() => {
					imagePickerRef.current?.click()
				}}
				className="my-3 flex w-fit flex-row items-center rounded-full border border-gray-300 px-5 py-2 font-medium hover:bg-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
			>
				upload image
			</button>

			<input
				ref={imagePickerRef}
				type="file"
				hidden
				onChange={(e) => {
					if (!e.target.files![0].type.startsWith('image/')) return
					setFile(e.target.files![0])
				}}
			/>
		</div>
	)
}
