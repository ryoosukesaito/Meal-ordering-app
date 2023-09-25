"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { CldImage } from "next-cloudinary";
import { useItemsStore } from "@/store/ItemsStore";
import { useModalStore } from "@/store/ModalStore";

type Props = {
  item: ItemsType;
};

export function Item({ item }: Props) {
  const [setTitle, setPrice, setImage, setAllergies, setItemAsProps] =
    useItemsStore((state) => [
      state.setTitle,
      state.setPrice,
      state.setImage,
      state.setAllergies,
      state.setItemAsProps,
    ]);
  const openModal = useModalStore((state) => state.openModal);

  const handleModalOpen = () => {
    openModal();
    setItemAsProps(item);
    setTitle(item.title);
    setPrice(item.price);
    setAllergies(item.allergies);
    setImage(item.image);
  };

  return (
    <>
      <CldImage alt="item-image" src={item.image} width={300} height={300} />

      <div>{item.title}</div>
      <div>$ {item.price}</div>
      <div>
        {item.allergies.map((allergy: string, idx: number) => (
          <>
            <div key={idx}>* {allergy}</div>
          </>
        ))}
        <button
          className="rounded-full p-1 hover:bg-[#cbcbcb] hover:text-white"
          onClick={handleModalOpen}
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
