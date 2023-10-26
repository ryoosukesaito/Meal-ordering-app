import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

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

  const deleteAllergy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const id = Number(e.currentTarget.value)
    const updateAllergy = [...allergies]
    updateAllergy.splice(id, 1)
    setAllergies(updateAllergy)
  }
  return (
    <>
      <section className="m-5 flex w-full flex-col ">
        <div className="my-4 flex w-full max-w-lg flex-row flex-wrap justify-start">
          {allergies?.map((allergy: string, idx: number) => (
            <div
              key={idx}
              className="group/btn flex w-fit flex-row items-center rounded-full border-[#FF7474] bg-[#FF7474] py-1 pl-6 pr-1 text-white hover:bg-[#ffe3e3] hover:text-[#8D8D8D]"
            >
              {allergy}
              <button
                onClick={deleteAllergy}
                value={idx}
                className="invisible pr-1 text-[#FF7474] group-hover/btn:visible"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex max-w-sm flex-row">
          <input
            type="text"
            placeholder="Add allergy"
            className="rounded-md border border-gray-300 px-4 py-2 outline-none"
            value={allergyInput}
            onChange={handleAllergyInputChange}
          />
          <button
            type="button"
            onClick={addAllergy}
            className="mx-3 text-green-500"
          >
            <PlusCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </section>
    </>
  )
}
