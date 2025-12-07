import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from 'react-icons/fi'

export const RecentTransactions = () => {
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
          <TableRow
            cusId="#12342"
            date="Jan 21, 2025"
            sale={1000}
            sale_id="#12"
            loyalty_points={7}
          />
          <TableRow
            cusId="#12343"
            date="Jan 22, 2025"
            sale={100}
            sale_id="#234"
            loyalty_points={1}
          />
          <TableRow
            cusId="#123434343"
            date="Mar 09, 2025"
            sale={1000}
            sale_id="#12"
            loyalty_points={14}
          />
          <TableRow
            cusId="#12342"
            date="Jan 21, 2025"
            sale={1000}
            sale_id="#12"
            loyalty_points={7}
          />
          <TableRow
            cusId="#12343"
            date="Jan 22, 2025"
            sale={100}
            sale_id="#234"
            loyalty_points={2}
          />
          <TableRow
            cusId="#123434343"
            date="Mar 09, 2025"
            sale={1000}
            sale_id="#12"
            loyalty_points={3}
          />
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
          <th className="text-start p-1.5">Price</th>
          <th className="text-start p-1.5">Loyalty Points</th>
          <th className="text-start p-1.5"></th>
        </tr>
      </thead>
    );
}

interface Props{
    cusId: string;
    date: string;
    sale: number;
    sale_id: string;
    loyalty_points: number;
}; 
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