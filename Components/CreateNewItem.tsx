"use client";

import { ADD_NEW_ITEM } from "@/graphql/queries";
import { client } from "@/graphql/apollo-client";
import uploadImage from "@/lib/uploadImage";
import { useMutation } from "@apollo/client";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export function CreateNewItem() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const [allergyInput, setAllergyInput] = useState<string>("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [url, setUrl] = useState<string>("");

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
      console.log(allergies);
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

  const setImageFile = async () => {
    let url: string;
    if (image) {
      const imageData = await uploadImage(image);
      url = imageData;
      return url;
    }
  };

  const getImageUrl = () => {
    setUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setImageFile();
      await addNewItem({
        variables: {
          id: uuidv4(),
          title: title,
          price: price,
          allergies: allergies,
          image: url,
        },
      });
      setLoading(false);
      router.replace("/admin/dashboard");
    } catch (error) {
      console.log("There is something wrong in addNewItem >> ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading && url === "") getImageUrl();
  }, []);

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
          <div className=" w-20 h-auto bg-slate-500">
            {!image ? (
              <div>No image..</div>
            ) : (
              <Image
                alt="item-image"
                className="hover:grayscale cursor-not-allowed"
                width={600}
                height={600}
                src={URL.createObjectURL(image)}
                onClick={() => {
                  setImage(null);
                }}
              />
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
                setImage(e.target.files![0]);
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
    </div>
  );
}
