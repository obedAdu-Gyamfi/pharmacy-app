import { Outlet } from "react-router-dom";
import { SalesTopBar } from "../Sales/SalesTopBar";
import { SearchBar } from "../Sidebar/SearchBar";
import { useState } from "react";

export const SupplierPage = () => {
  const [supplier_id, setSupplierID] = useState("");
  const [name, setName] = useState("");
  const [contact_person, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSupplierSelect = (supplier: {
    id?: number | string;
    name?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
  }) => {
    setSupplierID(supplier.id?.toString() || "");
    setName(supplier.name || "");
    setContactPerson(supplier.contact_person || "");
    setEmail(supplier.email || "");
    setPhone(supplier.phone || "");
  };
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <SalesTopBar />
      <div className="w-full px-6 pt-4">
        <SearchBar
          endpoint="/search-supplier/"
          onSelect={handleSupplierSelect}
        />
      </div>

      <main className="w-full px-6 pb-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded border border-stone-300 bg-white/70 p-4 shadow-sm backdrop-blur">
            <Outlet />
          </section>

          <aside className="rounded border border-stone-300 bg-white/70 p-4 shadow-sm backdrop-blur">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">
              Supplier Details
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-600" htmlFor="supplier_id">
                  Supplier ID
                </label>
                <input
                  type="text"
                  id="supplier_id"
                  name="supplier_id"
                  placeholder="supplier id"
                  value={supplier_id}
                  onChange={(e) => setSupplierID(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="name">
                  Name
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  placeholder="name"
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
                  placeholder="contact person"
                  value={contact_person}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={email}
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </aside>
        </div>
      </main>
    </div>
  );
};
