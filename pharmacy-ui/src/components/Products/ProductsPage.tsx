import { Outlet } from "react-router-dom";
import { SalesTopBar } from "../Sales/SalesTopBar";
import { SearchBar } from "../Sidebar/SearchBar";
import { useState } from "react";

export const ProductsPage = () => {
  const [product_id, setProductID] = useState("");
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [unit_price, setUnitPrice] = useState("");
  const [expiry_date, setExpiryDate] = useState("");
  const [batch_number, setBatchNumber] = useState("");
  const [reorder_level, setReorderLevel] = useState("");
  const [description, setDescription] = useState("");

  const handleProductSelect = (product: {
    product_id?: number | string;
    name?: string;
    supplier?: string;
    "Unit Price"?: number | string;
    expiry_date?: string;
    batch_number?: number | string;
    reorder_level?: number | string;
    description?: string;
  }) => {
    setProductID(product.product_id?.toString() || "");
    setName(product.name || "");
    setSupplier(product.supplier || "");
    setUnitPrice(product["Unit Price"]?.toString() || "");
    setExpiryDate(product.expiry_date || "");
    setBatchNumber(product.batch_number?.toString() || "");
    setReorderLevel(product.reorder_level?.toString() || "");
    setDescription(product.description || "");
  };
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <SalesTopBar />
      <SearchBar endpoint="/search-product/" onSelect={handleProductSelect} />

      <main className="flex p-4">
        {/**className="flex-1 p-4" */}
        <Outlet />
      </main>
      <div className="pt-4 rounded border border-stone-300 p-4">
        <form className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="product_id">
              Product ID
            </label>
            <input
              type="text"
              id="product_id"
              name="product_id"
              placeholder="product_id"
              value={product_id}
              onChange={(e) => setProductID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="name">
              Product Name
            </label>
            <input
              type="name"
              id="name"
              name="name"
              placeholder="product  name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="supplier">
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              placeholder="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="unit_price">
              Unit Price
            </label>
            <input
              type="number"
              id="unit_price"
              name="unit_price"
              value={unit_price}
              placeholder="unit price"
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="expiry_date">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiry_date"
              name="expiry_date"
              placeholder="expiry_date"
              value={expiry_date}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="batch_number">
              Batch Number
            </label>
            <input
              type="text"
              id="batch_number"
              name="batch_number"
              placeholder="batch_number"
              value={batch_number}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="reorder_level">
              Reorder Level
            </label>
            <input
              type="number"
              id="reorder_level"
              name="reorder_level"
              placeholder="reorder_level"
              value={reorder_level}
              onChange={(e) => setReorderLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="decription">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
