import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

import { useItemsStore } from '@/store/ItemsStore'

export const AllergiesInput = () => {
	const [allergies, setAllergies, allergyInput, setAllergyInput] =
		useItemsStore((state) => [
			state.allergies,
			state.setAllergies,
			state.allergyInput,
			state.setAllergyInput
		])
	const handleAllergyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAllergyInput(e.target.value)
	}

	const addAllergy = () => {
		if (allergyInput.trim() !== '') {
			setAllergies([...allergies, allergyInput])
			setAllergyInput('')
		}
	}

	const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		const id = Number(e.currentTarget.value)
		const updateAllergy = [...allergies]
		updateAllergy.splice(id, 1)
		setAllergies(updateAllergy)
	}
	return (
		<div>
			<div className="my-3">
				<p className=" text-2xl font-bold">Allergy</p>
			</div>
			{allergies?.map((allergy: string, idx: number) => (
				<div key={idx} className="flex w-full flex-row">
					{allergy}
					<button onClick={handleDelete} value={idx}>
						<XCircleIcon className="h-5 w-5" />
					</button>
				</div>
			))}
			<div className="flex flex-row items-center">
				<input
					type="text"
					placeholder="Add allergy"
					value={allergyInput}
					onChange={handleAllergyInputChange}
				/>
				<button type="button" onClick={addAllergy}>
					<PlusCircleIcon className="h-5 w-5" />
				</button>
			</div>
		</div>
	)
}
