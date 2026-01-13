import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
}
interface StarCardsProps{
  selectedPeriod: string;
}

export const StartCards = ({selectedPeriod}: StarCardsProps) => {
  //const [selectedPeriod, setSelectedPeriod] = useState("last one week");
  const [salesData, setSalesData] = useState<any>(null);


  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/get-sale-period/${selectedPeriod}`
         );
        setSalesData(res.data);
        console.log(salesData)
       } catch (err) {
        console.error("Failed to fetch sale:", err);
       }
     };

    fetchSales();
   }, [selectedPeriod]);
  return (
    <>
      <Card
        title="Gross Revenue"
        value={`₵${salesData?.total_revenue || 0}`}
        pillText={`${salesData?.pilltext_gross || 0}%`}
        trend={salesData?.pilltext_gross < 0 ? "down" : "up"}
        period={selectedPeriod}
      />

      <Card
        title="Avg Sale"
        value={`₵${salesData?.average_sale || 0}`}
        pillText={`${salesData?.pilltext_avg || 0}%`}
        trend={salesData?.pilltext_avg < 0 ? "down" : "up"}
        period={selectedPeriod}
      />

      <Card
        title="Trailing Year"
        value={`₵${salesData?.trailing_year || 0}`}
        pillText={`${salesData?.pilltext_trailing || 0}%`}
        trend={salesData?.pilltext_trailing < 0 ? "down" : "up"}
        period="Previous 365 days"
      />
    </>
  );
};

const Card = ({ title, value, pillText, trend, period }: Props) => {
  return (
    <div className="col-span-4 rounded border border-stone-300">
      <div className="flex mb-8 items-start justify-between">
        <div>
          <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
          <p className="text-3xl font-semibold">{value}</p>
        </div>
        <span className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
            trend === "up"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
            {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
            {pillText}

        </span>
      </div>
      <p className="text-xs text-stone-500">{period}</p>
    </div>
  );
};
