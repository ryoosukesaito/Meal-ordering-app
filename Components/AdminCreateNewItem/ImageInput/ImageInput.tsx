import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'

interface PropsType {
  setFile: (file: File | null) => void
}

export const ImageInput: React.FC<PropsType> = ({ setFile }) => {
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
        <div className="mx-3">
          <ArrowDownTrayIcon className="h-5 w-5" />
        </div>
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