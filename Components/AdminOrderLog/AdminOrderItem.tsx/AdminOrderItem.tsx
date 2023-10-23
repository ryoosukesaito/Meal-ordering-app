import { doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from '@/firebase'

interface OrderData {
  idx: number
  order: OrderType
  checkedState: Map<string, boolean[]>
  setCheckedState: (state: Map<string, boolean[]>) => void
  handleRemoveOrder: (index: number, id: string) => void
}

export const AdminOrderItem: React.FC<OrderData> = ({
  idx,
  order,
  checkedState,
  setCheckedState,
  handleRemoveOrder
}) => {
  const [itemStatus, setItemStatus] = useState<boolean[]>()
  const handleOnChange = (position: number) => {
    const tempArr = checkedState.get(order.id)
    if (tempArr) {
      const updateArr = tempArr.map((value, i) =>
        i === position ? !value : value
      )
      setItemStatus(updateArr)
      setCheckedState(checkedState.set(order.id, updateArr))
    }
  }

  const handleToDeleteOrderFromDB = async (propsId: string) => {
    const itemId = propsId
    try {
      await updateDoc(doc(db, 'orders', itemId), {
        checked: true
      })
      handleRemoveOrder(idx, itemId)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const status = checkedState.get(order.id)
    if (status) setItemStatus(status)
  }, [checkedState, handleToDeleteOrderFromDB])

  // The below code is set to avoid undefined behavior
  if (!itemStatus) return <></>

  // the item should be hidden after serving it
  if (order.checked) return <></>

  return (
    <div className="m-3 inline-flex w-72 flex-col  rounded-xl shadow-xl ">
      <div className="rounded-t-xl border-b border-gray-500/50 bg-gray-200 px-5 py-2">
        <p>Table: {order.tableName}</p>
        <p>Time: {order.time}</p>
      </div>
      <div className="flex flex-col px-5 py-2">
        <table className="table-auto border-collapse border border-slate-500 ">
          <thead>
            <tr className=" text-sm">
              <th className="border-b border-slate-500 px-2">check</th>
              <th className="border-b border-slate-500 px-2">Order</th>
              <th className="border-b border-slate-500 px-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {order.order.map((item, i) => (
              <tr
                key={i}
                className={`${
                  itemStatus[i] === true && 'text-gray-400'
                } odd:bg-white even:bg-slate-100`}
              >
                <td className="flex h-full items-center justify-center">
                  <label
                    className="block cursor-pointer px-5 py-2"
                    htmlFor={`${order.id}${i}`}
                  >
                    <input
                      id={`${order.id}${i}`}
                      type="checkbox"
                      checked={itemStatus[i]}
                      onChange={() => handleOnChange(i)}
                    />
                  </label>
                </td>
                <td className="border-r border-dotted border-slate-500 text-sm">
                  <label
                    className="block cursor-pointer px-1 py-2"
                    htmlFor={`${order.id}${i}`}
                  >
                    {item.title}
                  </label>
                </td>
                <td className="flex items-center justify-center pt-2">
                  <p>{item.count}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mb-12 mt-5 cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          value="Serve"
          disabled={itemStatus.includes(false)}
          onClick={() => handleToDeleteOrderFromDB(order.id)}
        >
          {itemStatus.includes(false) ? 'Not ready yet' : 'Ready to Serve!!'}
        </button>
      </div>
    </div>
  )
}
