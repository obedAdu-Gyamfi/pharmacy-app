import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from 'react-icons/fi'
import { useState, useEffect } from 'react';
import axios from 'axios';


interface Props{
    cusId: string;
    date: string;
    sale: number;
    sale_id: string;
    loyalty_points: number;
}; 

export const RecentTransactions = () => {

  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
     const fetchSales = async () => {
       try {
         const res = await axios.get("http://127.0.0.1:8000/recent-sales");
         setSales(res.data);
       } catch (err) {
         console.error("Failed to fetch recent sales:", err);
       }
     };

     fetchSales();
   }, []);

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiDollarSign /> Recent Transaction
        </h3>
        <button className="text-sm text-violet-500 hover:undeline">
          see all
        </button>
      </div>
      <table className="w-full table-auto">
        <TableHead />
        <tbody>
          {sales.map((s, i) => (
            <TableRow
              key={i}
              cusId={s.cusId}
              date={s.date}
              sale={s.sale}
              sale_id={s.sale_id}
              loyalty_points={s.loyalty_points}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TableHead = () =>{
    return (
      <thead>
        <tr className="text-sm font-normal text-stone-500">
          <th className="text-start p-1.5">Customer ID</th>
          <th className="text-start p-1.5">Date</th>
          <th className="text-start p-1.5">Sale</th>
          <th className="text-start p-1.5">Sale Id</th>
          <th className="text-start p-1.5">Loyalty Points</th>
          <th className="text-start p-1.5"></th>
        </tr>
      </thead>
    );
}


const TableRow = ({cusId, date, sale, sale_id, loyalty_points}: Props) => {


    return (
      <tr className={loyalty_points > 5 ? "bg-stone-100 text-sm" : "text-sm"}>
        <td className="p-1.5">
          <a
            href="#"
            className="text-violet-600 underline
             flex items-center gap-1"
          >
            {cusId} <FiArrowUpRight />
          </a>
        </td>
        <td className="p-1.5">{date}</td>
        <td className="p-1.5">{sale}</td>
        <td className="p-1.5">{sale_id}</td>
        <td className="p-1.5">{loyalty_points}</td>
        <button className="hover:bg-stone-200 transition-colors grid place-content-center rounded text-sm size-8">
                    <FiMoreHorizontal />
        </button>
            
      </tr>
    );
}