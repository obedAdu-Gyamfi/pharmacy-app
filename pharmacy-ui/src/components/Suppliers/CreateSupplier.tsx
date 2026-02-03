import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Login/axiosClient";

export const CreateSupplier = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
 

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const data = new URLSearchParams();
      data.append("name", name);
      data.append("contact_person", contactPerson);
      data.append("email", email);
      data.append("phone", phone);
      data.append("address", address);
     
      const res = await api.post("/add-supplier/", data);
      alert("New Product Added Successfully");
      setName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setAddress("");
    } catch (err) {
      alert("Unable to create user");
    }
  }
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-stone-300 bg-white/80 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Add New Supplier
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="name">
              Add Name of Supplier
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter name of supplier"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              className="block mb-1 text-gray-600"
              htmlFor="contact_person"
            >
              Contact Person
            </label>
            <input
              type="text"
              id="contact_person"
              name="contact_person"
              placeholder="Enter name of contact person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="e.g username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter the address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add New Supplier
          </button>
        </form>
      </div>
    </section>
  );
};
