import { useState, useEffect } from "react";
import axios from "axios";
import api from "../Login/axiosClient";

import { useNavigate } from "react-router-dom";

interface Props {
  sale_item: string;
  barcode: string;
  quantity: string;
  unit_price: number;
  total: number;
}

interface IProps {
  sale_id: string;
  setSaleId: (value: string) => void;
  barcode: string;
  setBarcode: (value: string) => void;
  batch_id: string;
  setBatchId: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  unit_price: string;
  setUnitPrice: (value: string) => void;
  discount: string;
  setDiscount: (value: string) => void;
  saleItems: any[];
  setSaleItems: (value: any[]) => void;
}

export const SalesTransaction = ({
  sale_id,
  setSaleId,
  barcode,
  setBarcode,
  batch_id,
  setBatchId,
  quantity,
  setQuantity,
  unit_price,
  setUnitPrice,
  discount,
  setDiscount,
  saleItems,
  setSaleItems,
}: IProps) => {
  const navigate = useNavigate();


  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const payload = {
        sale_id,
        barcodes: saleItems.map((s) => s.barcode),
        batch_ids: saleItems.map((s) => s.batch_id),
        quantities: saleItems.map((s) => Number(s.quantity)), // ensure numbers
      };
      const res = await api.post("/add-sale-item/", payload);
      alert("New Sale Completed Successfully");
    } catch (err) {
      alert("Unable to Create Sale");
    }
  }

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">Sale Items</h3>
      </div>
      <table className="w-full table-auto">
        <TableHead />
        <tbody>
          {saleItems.map((s, i) => (
            <TableRow
              key={i}
              sale_item={s.product_name}
              barcode={s.barcode}
              quantity={s.quantity}
              unit_price={s.unit_price}
              total={s.total}
            />
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={saleItems.length === 0}
          className={`px-2 py-1.5 font-medium text-white rounded-full transition-colors
    ${
      saleItems.length === 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-stone-600 hover:bg-darkGreyishBlue"
    }`}
        >
          CheckOut
        </button>
      </div>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Item</th>
        <th className="text-start p-1.5">Barcode</th>
        <th className="text-start p-1.5">Quantity</th>
        <th className="text-start p-1.5">Unit Price</th>
        <th className="text-start p-1.5">Total</th>
        <th className="text-start p-1.5"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  sale_item,
  barcode,
  quantity,
  unit_price,
  total,
}: Props) => {
  return (
    <tr className={total > 100 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5"> {sale_item}</td>
      <td className="p-1.5">{barcode}</td>
      <td className="p-1.5">{quantity}</td>
      <td className="p-1.5">{unit_price}</td>
      <td className="p-1.5">{total}</td>
    </tr>
  );
};
