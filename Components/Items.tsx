"use client";

import { Item } from "./Item";

import { useQuery } from "@apollo/client";
import { GET_ALL_ITEMS } from "@/graphql/queries";
import { client } from "@/graphql/apollo-client";

export function Items() {
  const { loading, error, data } = useQuery(GET_ALL_ITEMS, {
    client,
  });

  if (loading) <p>Loading...</p>;
  if (error) <p>Error: {error.message}</p>;

  return (
    <div>
      <div>
        {data?.items?.map((data: ItemsType, id: number) => (
          <Item key={id} item={data} />
        ))}
      </div>
    </div>
  );
}
