"use client";

import Image from "next/image";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

import { UPDATE_ITEM } from "@/graphql/queries";
import { useMutation } from "@apollo/client";
import { client } from "@/graphql/apollo-client";
import { CldImage } from "next-cloudinary";

type Props = {
  item: ItemsType;
};

export function Item({ item }: Props) {
  const ItemId = item.id;
  const [title, setTitle] = useState<string>(item.title);
  const [price, setPrice] = useState<string>(item.price);
  const [image, setImage] = useState<string>(item.image);
  const [allergyInput, setAllergyInput] = useState<string>("");
  const [allergies, setAllergies] = useState<string[]>(item.allergies);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [updateItem, { loading, error }] = useMutation(UPDATE_ITEM, {
    client,
  });

  const handleAllergyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllergyInput(e.target.value);
  };

  const addAllergy = () => {
    if (allergyInput.trim() !== "") {
      setAllergies([...allergies, allergyInput]);
      setAllergyInput("");
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = Number(e.currentTarget.value);
    const updateAllergy = [...allergies];
    updateAllergy.splice(id, 1);
    setAllergies(updateAllergy);
  };

  const handleModalOpen = () => {
    isOpen === false ? setIsOpen(true) : setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateItem({
        variables: {
          id: ItemId,
          title: title,
          price: price,
          allergies: allergies,
          image: image,
        },
      });
    } catch (error) {
      console.log("There is something wrong in updateItem >> ", error);
    }
  };

  if (loading) return <>Loading...</>;

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

      <div className={isOpen ? "block" : "hidden"}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-fit h-auto justify-between"
        >
          <input
            type="text"
            placeholder={item.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder={item.price}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {allergies.map((allergy: string, idx: number) => (
            <>
              <div key={idx} className="flex flex-row w-full">
                {allergy}
                <button onClick={handleDelete} value={idx}>
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </>
          ))}
          <input
            type="text"
            placeholder="Add allergy"
            value={allergyInput}
            onChange={handleAllergyInputChange}
          />
          <button type="button" onClick={addAllergy}>
            <PlusCircleIcon className="h-5 w-5" />
          </button>

          <button type="submit"> Update</button>
        </form>
      </div>
    </>
  );
}
