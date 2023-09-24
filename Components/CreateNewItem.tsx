"use client";

import { ADD_NEW_ITEM } from "@/graphql/queries";
import { client } from "@/graphql/apollo-client";
import { useMutation } from "@apollo/client";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useItemsStore } from "@/store/ItemsStore";

export function CreateNewItem() {
  const [
    title,
    setTitle,
    price,
    setPrice,
    file,
    setFile,
    allergies,
    setAllergies,
    allergyInput,
    setAllergyInput,
    setImageFile,
  ] = useItemsStore((state) => [
    state.title,
    state.setTitle,
    state.price,
    state.setPrice,
    state.file,
    state.setFile,
    state.allergies,
    state.setAllergies,
    state.allergyInput,
    state.setAllergyInput,
    state.setImageFile,
  ]);
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [addNewItem, { error }] = useMutation(ADD_NEW_ITEM, {
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
    e.preventDefault();
    const id = Number(e.currentTarget.value);
    const updateAllergy = [...allergies];
    updateAllergy.splice(id, 1);
    setAllergies(updateAllergy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (file) {
        const imageURL = await setImageFile(file);
        await addNewItem({
          variables: {
            id: uuidv4(),
            title: title,
            price: price,
            allergies: allergies,
            image: imageURL,
          },
        });
      }

      setLoading(false);
      window.location.replace("/admin/dashboard");
    } catch (error) {
      console.log("There is something wrong in addNewItem >> ", error);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div>
        <div className="text-2xl font-bold">loading...</div>
        <div className="bg-white opacity-10" />
      </div>
    );

  if (error) return <div>{`${error.message}`}</div>;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-fit h-auto justify-between"
      >
        {/* top container */}
        <div>
          <div className=" w-52 h-auto bg-slate-500">
            {file ? (
              <Image
                alt="item-image"
                className="hover:grayscale cursor-not-allowed"
                width={600}
                height={600}
                src={URL.createObjectURL(file)}
                onClick={() => {
                  setFile(null);
                }}
              />
            ) : (
              <div>No image..</div>
            )}
          </div>

          {/* image */}
          <div className="w-fit">
            <p className=" text-2xl font-bold">Image</p>

            <button
              type="button"
              onClick={() => {
                imagePickerRef.current?.click();
              }}
              className="border rounded-lg border-orange-200  w-fit"
            >
              upload image
            </button>

            <input
              ref={imagePickerRef}
              type="file"
              hidden
              onChange={(e) => {
                if (!e.target.files![0].type.startsWith("image/")) return;
                setFile(e.target.files![0]);
              }}
            />
          </div>

          {/* title */}
          <div>
            <p className=" text-2xl font-bold">Title</p>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Price */}
          <div>
            <p className=" text-2xl font-bold">Price</p>

            <input
              type="text"
              placeholder={price}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>
        {/* Top container end */}

        <div>
          {allergies?.map((allergy: string, idx: number) => (
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
        </div>
        <button type="submit"> Update</button>
      </form>
      <button
        type="button"
        onClick={() => {
          window.location.replace("/admin/dashboard");
        }}
      >
        Cancel
      </button>
    </div>
  );
}
