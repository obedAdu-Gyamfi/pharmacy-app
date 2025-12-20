import React from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../Login/axiosClient';
import { useState } from 'react';


export const CreateCustomers = () => {
  const navigate = useNavigate();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const  [address, setAddress] = useState("")

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const data = new URLSearchParams();
      data.append("first_name", first_name);
      data.append("last_name", last_name);
      data.append("phone", phone);
      data.append("email", email);
      data.append("date_of_birth", date_of_birth);
      data.append("address", address);

      const res = await api.post("/add-customer/", data);
      alert("New Customer Added Successfully");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setDateOfBirth("");
      setAddress("");
    } catch (err) {
      alert("Unable to Create New Customer");
    }
  }
  return (
    <>
      <div className="rounded border border-stone-300 p-4">
        <form className="gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="firstname">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Enter first name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="lastname">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Enter last name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="date_of_birth">
              Date Of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              placeholder="Enter Date of birth"
              value={date_of_birth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-2 py-1.5 font-medium text-white rounded-full bg-stone-600 baseline hover:bg-darkGreyishBlue transition-colors"
            >
              Add New Customer
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
