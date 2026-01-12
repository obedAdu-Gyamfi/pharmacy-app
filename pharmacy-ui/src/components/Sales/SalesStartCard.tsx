import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Login/axiosClient";
import { SalesTransaction } from "./SalesTransaction";

export const SalesStartCard = () => {
  const [saleItems, setSaleItems] = useState<any[]>([]);

  const [cusId, setCusId] = useState("");
  const [payment_method, setPaymentMethod] = useState("");
  const [payment_status, setPaymentStatus] = useState("");
  const [notes, setNotes] = useState("");

  const [barcode, setBarcode] = useState("");
  const [batch_id, setBatchId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit_price, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [sale_id, setSaleId] = useState("");
  const [product_name, setProductName] = useState("");

  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  return (
    <>
      <div className="space-y-5">
        <div className="grid grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            <Sales
              cusId={cusId}
              setCusId={setCusId}
              payment_method={payment_method}
              setPaymentMethod={setPaymentMethod}
              payment_status={payment_status}
              setPaymentStatus={setPaymentStatus}
              notes={notes}
              setNotes={setNotes}
              setSaleId={setSaleId}
            />

            <SalesTransaction
              sale_id={sale_id}
              setSaleId={setSaleId}
              barcode={barcode}
              setBarcode={setBarcode}
              batch_id={batch_id}
              setBatchId={setBatchId}
              quantity={quantity}
              setQuantity={setQuantity}
              unit_price={unit_price}
              setUnitPrice={setUnitPrice}
              discount={discount}
              setDiscount={setDiscount}
              saleItems={saleItems}
              setSaleItems={setSaleItems}
            />
          </div>

          <div className="space-y-4">
            <SalesItem
              sale_id={sale_id}
              setSaleID={setSaleId}
              product_name={product_name}
              setProductName={setProductName}
              barcode={barcode}
              setBarcode={setBarcode}
              batch_id={batch_id}
              setBatchID={setBatchId}
              quantity={quantity}
              setQuantity={setQuantity}
              unit_price={unit_price}
              setUnitPrice={setUnitPrice}
              discount={discount}
              setDiscount={setDiscount}
              saleItems={saleItems}
              setSaleItems={setSaleItems}
            />
            <AddCustomer
              first_name={first_name}
              setFirstName={setFirstName}
              last_name={last_name}
              setLastName={setLastName}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
              date_of_birth={date_of_birth}
              setDateOfBirth={setDateOfBirth}
              address={address}
              setAddress={setAddress}
            />
          </div>
        </div>
      </div>
    </>
  );
};

interface Props {
  cusId: string;
  setCusId: (value: string) => void;
  payment_method: string;
  setPaymentMethod: (value: string) => void;
  payment_status: string;
  setPaymentStatus: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  setSaleId: (value: string) => void;
}

const Sales = ({
  cusId,
  setCusId,
  payment_method,
  setPaymentMethod,
  payment_status,
  setPaymentStatus,
  notes,
  setNotes,
  setSaleId,
}: Props) => {
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const data = new URLSearchParams();
      data.append("customer_id", cusId);
      data.append("payment_method", payment_method);
      data.append("payment_status", payment_status);
      data.append("notes", notes);
      const res = await api.post("/add-sale/", data);

      setCusId("");
      setPaymentMethod("");
      setPaymentStatus("");
      setNotes("");

      if (res.data.status === "success") {
        const newSaleId = res.data.message;
        setSaleId(newSaleId);
        alert("New Sale Created Successfully");
      }
    } catch (err) {
      alert("Unable to Create Sale");
    }
  }
  return (
    <div className="rounded border border-stone-300 p-4">
      <form className="grid grid-cols-4 gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-gray-600" htmlFor="customer_id">
            Customer Id
          </label>
          <input
            type="number"
            id="cusId"
            name="cusId"
            placeholder="Enter Customer ID"
            value={cusId}
            onChange={(e) => setCusId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600" htmlFor="payment_method">
            Payment Method
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={payment_method}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select role</option>
            <option value="momo">MoMo</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-600" htmlFor="payment_status">
            Payment Status
          </label>
          <select
            id="payment_status"
            name="payment_status"
            value={payment_status}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-600" htmlFor="notes">
            Notes
          </label>
          <input
            type="text"
            id="notes"
            name="notes"
            placeholder="Enter comment or notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-2 py-1.5 font-medium text-white rounded-full bg-stone-600 baseline hover:bg-darkGreyishBlue transition-colors"
        >
          Create New Sale
        </button>
      </form>
    </div>
  );
};

interface IProps {
  sale_id: string;
  setSaleID: React.Dispatch<React.SetStateAction<string>>;
  product_name: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  barcode: string;
  setBarcode: React.Dispatch<React.SetStateAction<string>>;
  batch_id: string;
  setBatchID: React.Dispatch<React.SetStateAction<string>>;
  quantity: string;
  setQuantity: React.Dispatch<React.SetStateAction<string>>;
  unit_price: string;
  setUnitPrice: React.Dispatch<React.SetStateAction<string>>;
  discount: string;
  setDiscount: React.Dispatch<React.SetStateAction<string>>;
  saleItems: any[];
  setSaleItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const SalesItem: React.FC<IProps> = ({
  sale_id,
  setSaleID,
  product_name,
  setProductName,
  barcode,
  setBarcode,
  batch_id,
  setBatchID,
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

  useEffect(() => {
    if (!barcode) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/get-product/${barcode}`);
        const productData = res.data.data;
        setBatchID(productData.batch_id?.toString() || "");
        setUnitPrice(productData["Unit Price"]?.toString() || "");
        setProductName(productData.name?.toString() || "");
      } catch (err) {
        console.error("Error getting product: ", err);
        setBatchID("");
        setUnitPrice("");
        setProductName("");
      }
    };
    fetchProduct();
  }, [barcode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const total = Number(quantity) * Number(unit_price);

    const newItem = {
      sale_id,
      product_name,
      barcode,
      batch_id,
      quantity,
      unit_price,
      discount,
      total: total,
    };

    setSaleItems([...saleItems, newItem]);

    setSaleID("");
    setProductName("");
    setBarcode("");
    setQuantity("");
    setDiscount("");
    setBatchID("");
    setUnitPrice("");
  };
  return (
    <>
      <div className="rounded border border-stone-300 p-4">
        <form className="gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="barcode">
              Barcode
            </label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              placeholder="Enter Barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="sale_id">
              Sale ID
            </label>
            <input
              type="number"
              id="sale_id"
              name="sale_id"
              placeholder="Enter Sale ID"
              value={sale_id}
              onChange={(e) => setSaleID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="product_name">
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              placeholder="Enter Product Name"
              value={product_name}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="batch_id">
              Batch ID
            </label>
            <input
              type="text"
              id="batch_id"
              name="batch_id"
              placeholder="Enter Batch ID"
              value={batch_id}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Fill quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600" htmlFor="unit_price">
              Unit Price
            </label>
            <input
              type="text"
              id="unit_price"
              name="unit_price"
              placeholder="unit price"
              value={unit_price}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="discount">
              Discount
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              placeholder="discount if any"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-2 py-1.5 font-medium text-white rounded-full bg-stone-600 baseline hover:bg-darkGreyishBlue transition-colors"
            >
              Add New Item
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

interface CProps {
  first_name: string;
  setFirstName: (value: string) => void;
  last_name: string;
  setLastName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  date_of_birth: string;
  setDateOfBirth: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
}

const AddCustomer = ({
  first_name,
  setFirstName,
  last_name,
  setLastName,
  phone,
  setPhone,
  email,
  setEmail,
  date_of_birth,
  setDateOfBirth,
  address,
  setAddress,
}: CProps) => {
  const navigate = useNavigate();

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
