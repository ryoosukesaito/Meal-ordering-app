"use client";

import { Item } from "./Item";

import { useQuery } from "@apollo/client";
import { GET_ALL_ITEMS } from "@/graphql/queries";
import { client } from "@/graphql/apollo-client";
import { useItemsStore } from "@/store/ItemsStore";
import { useEffect } from "react";
export function Items() {
  const { loading, error, data } = useQuery(GET_ALL_ITEMS, {
    client,
  });

  const [itemsList, setItemsList] = useItemsStore((state) => [
    state.itemsList,
    state.setItemsList,
  ]);

  const handleMovingToAddingPage = () => {
    window.location.replace("/admin/create");
  };

  const getItem = () => {
    setItemsList(data);
  };

  useEffect(() => {
    getItem();
  }, [data]);

  if (loading) <p>Loading...</p>;
  if (error) <p>Error: {error.message}</p>;

  return (
    <div>
      <button
        className="rounded px-8 py-2 mb-12 cursor-pointer bg-[#FF7474] hover:bg-[#FFB9B9] text-white hover:text-[#8D8D8D]"
        onClick={handleMovingToAddingPage}
      >
        add
      </button>
      <div>
        {itemsList?.items?.map((data: ItemsType, id: number) => (
          <Item key={id} item={data} />
        ))}
      </div>
    </div>
  );
}
