import { FormEvent, useEffect, useState } from "react";
import api from "../Login/axiosClient";
import { SalesTopBar } from "../Sales/SalesTopBar";

type PurchaseOrder = {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name?: string | null;
  user_id: number;
  order_date: string | null;
  expected_delivery_date: string | null;
  status: string;
  total_amount: number | string | null;
  notes?: string | null;
  created_at?: string | null;
};

export const PurchasingOrder = () => {
  const [supplierId, setSupplierId] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [totalAmount, setTotalAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.get("/purchase-orders/");
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setOrders(data);
    } catch (err) {
      setErrorMessage("Unable to load purchase orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const resetForm = () => {
    setSupplierId("");
    setExpectedDate("");
    setStatus("pending");
    setTotalAmount("");
    setNotes("");
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const data = new URLSearchParams();
      data.append("supplier_id", supplierId);
      data.append("expt_date", expectedDate);
      data.append("status", status);
      data.append("total_amount", totalAmount);
      data.append("notes", notes);

      await api.post("/add-po/", data);
      setSuccessMessage("Purchase order created successfully.");
      resetForm();
      fetchOrders();
    } catch (err) {
      setErrorMessage("Unable to create purchase order.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <SalesTopBar />
      <main className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded border border-stone-300 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">
              Create Purchasing Order
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Submit a purchase order to a supplier.
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-gray-600" htmlFor="supplier_id">
                  Supplier ID
                </label>
                <input
                  type="text"
                  id="supplier_id"
                  name="supplier_id"
                  placeholder="Supplier ID"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="expected_delivery_date">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  id="expected_delivery_date"
                  name="expected_delivery_date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">pending</option>
                  <option value="received">received</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="total_amount">
                  Total Amount
                </label>
                <input
                  type="number"
                  id="total_amount"
                  name="total_amount"
                  placeholder="0.00"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Optional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Purchase Order
              </button>
            </form>
          </section>

          <section className="rounded border border-stone-300 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Current Purchase Orders
              </h2>
              <button
                type="button"
                onClick={fetchOrders}
                className="rounded-full border border-blue-600 px-4 py-1 text-sm text-blue-600 hover:bg-blue-50"
              >
                Refresh
              </button>
            </div>

            {loading && (
              <p className="mt-4 text-sm text-gray-600">Loading orders...</p>
            )}
            {!loading && orders.length === 0 && (
              <p className="mt-4 text-sm text-gray-600">
                No purchase orders available.
              </p>
            )}

            {!loading && orders.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-600">
                      <th className="py-2 pr-4">PO Number</th>
                      <th className="py-2 pr-4">Supplier</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Order Date</th>
                      <th className="py-2 pr-4">Expected</th>
                      <th className="py-2 pr-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium text-gray-800">
                          {order.po_number}
                        </td>
                        <td className="py-2 pr-4 text-gray-700">
                          {order.supplier_name || `#${order.supplier_id}`}
                        </td>
                        <td className="py-2 pr-4 text-gray-700">
                          {order.status}
                        </td>
                        <td className="py-2 pr-4 text-gray-700">
                          {order.order_date || "-"}
                        </td>
                        <td className="py-2 pr-4 text-gray-700">
                          {order.expected_delivery_date || "-"}
                        </td>
                        <td className="py-2 pr-4 text-right text-gray-700">
                          {order.total_amount ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
