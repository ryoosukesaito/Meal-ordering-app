import Image from "next/image";
import React from "react";

interface ItemsType {
  title: string;
  price: number;
  allergies: string[];
  image: string;
}
export const Items = () => {
  return (
    <div>
      <div>
        {SAMPLE_DATA.map((data, id) => (
          <>
            <div key={id}>
              <Image
                alt="item-image"
                src={data.image}
                width={100}
                height={100}
              />

              <div>{data.title}</div>
              <div>$ {data.price}</div>
              <div>
                {data.allergies.map((allergy, idx) => (
                  <>
                    <div key={idx}>* {allergy}</div>
                  </>
                ))}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

const SAMPLE_DATA: ItemsType[] = [
  {
    title: "Spring Onion Udon",
    price: 10.99,
    allergies: ["Wheat"],
    image: "/image/negi-udon.jpg",
  },
  {
    title: "Prawn Sashimi Plate",
    price: 15.99,
    allergies: ["shellfish"],
    image: "/image/prawn-sashimi-plate.jpg",
  },
  {
    title: "Soy Sauce with Fried chicken Ramen",
    price: 12.99,
    allergies: ["Gluten", "Egg"],
    image: "/image/soy-source-chicken-ramen.jpg",
  },
  {
    title: "Tuna with Salmon Sashimi Rice Bowl",
    price: 14.99,
    allergies: ["Fish"],
    image: "/image/tuna-sashimi-bowl.jpg",
  },
  {
    title: "Veggie Dumpling",
    price: 9.45,
    allergies: ["None"],
    image: "/image/veggie-dumpling.jpg",
  },
];
