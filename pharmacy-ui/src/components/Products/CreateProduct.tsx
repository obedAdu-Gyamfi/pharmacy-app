import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Login/axiosClient';
import { SalesTopBar } from '../Sales/SalesTopBar';
import { CreateStockBatch } from './CreateStockBatch';


export const CreateProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const data = new URLSearchParams();
      data.append("name", name);
      data.append("generic_name", genericName);
      data.append("barcode", barcode);
      data.append("category", category);
      data.append("description", description);
      data.append("unit_price", unitPrice);
      data.append("selling_price", sellingPrice)
      const res = await api.post("/add-product/", data);
      alert("New Product Added Successfully");
      setName("");
      setGenericName("");
      setBarcode("");
      setCategory("");
      setDescription("");
      setUnitPrice("");
      setSellingPrice("");
    } catch (err) {
      alert("Unable to create user");
    };
  };
  return (
    <> 
    <div className="grid pb-4 gap-2 grid-cols-[650px_1fr] pt-4">
      <div>
        <section
          id="create user"
          className="flex justify-center items-center max-h-screen bg-gray-100"
        >
          <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Add New Product
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-gray-600" htmlFor="name">
                  Add Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter name of product"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="generic_name"
                >
                  Add Generic Name
                </label>
                <input
                  type="text"
                  id="generic_name"
                  name="generic_name"
                  placeholder="Enter generic name"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="barcode">
                  Barcode
                </label>
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  placeholder="Scan Product Barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role</option>
                  <option value="prescription">Prescription Drugs</option>
                  <option value="otc">Over The Couter - OTC</option>
                  <option value="anti_infective">Anti-Infectives</option>
                  <option value="pain_and_inflammation">
                    Pain & Inflammation
                  </option>
                  <option value="cardiovascular">Cardiovascular</option>
                  <option value="diabetes_and_endocrine">
                    Diabetes & Endocrine
                  </option>
                  <option value="respiratory">Respiratory</option>
                  <option value="gastrointestinal">Gastrointestinal</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="paediatric">Paediactric</option>
                  <option value="women_health">Women's Health</option>
                  <option value="vitamins_and_suppliment">
                    Vitamins and Supplements
                  </option>
                  <option value="herbal_product">Herbal Products</option>
                  <option value="medical_supply">Medical Supply</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="description"
                >
                  Product Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="unit_price"
                >
                  Unit Price
                </label>
                <input
                  type="number"
                  id="unit_price"
                  name="unit_price"
                  placeholder="Enter unit price"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-gray-600"
                  htmlFor="selling_price"
                >
                  Selling Price
                </label>
                <input
                  type="number"
                  id="selling_price"
                  name="selling_price"
                  placeholder="Set Selling price"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
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
      <div>
        <CreateStockBatch />
      </div>
    </div>
    </>
  );
}