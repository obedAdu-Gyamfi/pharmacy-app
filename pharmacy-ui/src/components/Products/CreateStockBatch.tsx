import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Login/axiosClient";
import { SalesTopBar } from "../Sales/SalesTopBar";

export const CreateStockBatch = () => {
  const navigate = useNavigate();
  const [product_id, setProductID] = useState("");
  const [batch_number, setBatchNumber] = useState("");
  const [lot_number, setLotNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [manufacturing_date, setManufacturingDate] = useState("");
  const [expiry, setExpiryDate] = useState("");
  const [supplier_id, setSupplierID] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const data = new URLSearchParams();
      // Backend expects Form fields: product_id, batch_number, lot_number, quantity, manufacturing_date, expiry_date, supplier_id
      data.append("product_id", String(product_id));
      data.append("batch_number", batch_number);
      data.append("lot_number", lot_number);
      data.append("quantity", String(quantity));
      data.append("manufacturing_date", manufacturing_date); // YYYY-MM-DD
      data.append("expiry_date", expiry); // YYYY-MM-DD
      data.append("supplier_id", String(supplier_id));

      const res = await api.post("/add-stock-batch/", data);
      alert("Stock batch created successfully");
      setProductID("");
      setBatchNumber("");
      setLotNumber("");
      setQuantity("");
      setManufacturingDate("");
      setExpiryDate("");
      setSupplierID("");
    } catch (err) {
      const message =
        (err as any)?.response?.data?.detail || "Unable to create stock batch";
      alert(message);
    }
  }
  return (
    <>
      <div>
        <section
          id="create user"
          className="flex justify-center items-center max-h-screen bg-transparent"
        >
          <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Add New Stock Batch
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="product_id"
                >
                  Product ID
                </label>
                <input
                  type="text"
                  id="product_id"
                  name="product_id"
                  placeholder="Enter product_id"
                  value={product_id}
                  onChange={(e) => setProductID(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="batch_number"
                >
                  Batch Number
                </label>
                <input
                  type="text"
                  id="batch_number"
                  name="batch_number"
                  placeholder="Enter batch number"
                  value={batch_number}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="lot_number"
                >
                  Lot Number
                </label>
                <input
                  type="text"
                  id="lot_number"
                  name="lot_number"
                  placeholder="Enter lot number"
                  value={lot_number}
                  onChange={(e) => setLotNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="manufacturing_date"
                >
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  id="manufacturing_date"
                  name="manufacturing_date"
                  placeholder="Enter product manufacturing_date"
                  value={manufacturing_date}
                  onChange={(e) => setManufacturingDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="expiry_date"
                >
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiry_date"
                  name="expiry_date"
                  placeholder="Enter expiry date"
                  value={expiry}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="supplier_id"
                >
                  Supplier ID
                </label>
                <input
                  type="number"
                  id="supplier_id"
                  name="supplier_id"
                  placeholder="Enter supplier ID"
                  value={supplier_id}
                  onChange={(e) => setSupplierID(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};
