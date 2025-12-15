import { FiEye } from "react-icons/fi";
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const data = [
  {
    subject: "Total Sales Revenue",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "OTC Sales", /*Over-the-counter product sales count or revenue*/
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "ATV", /*Average Transaction Value - Mean Spending by customer*/
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Prescription Volume", /* Number of prescription medication sold */
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "ITR", /* Inventory Turnover Rate*/
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "CRR", /**Customer Return Rate*/
    A: 65,
    B: 85,
    fullMark: 150,
  },
];  





export const UsageRader = () => {
  return (
    <div className="col-span-4 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font medium">
          <FiEye /> Usage
        </h3>
      </div>
      <div >
        <RadarChart
          style={{
            width: "100%",
            maxWidth: "500px",
            maxHeight: "80vh",
            aspectRatio: 1,
          }}
          responsive
          outerRadius="80%"
          data={data}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar
            name="Mike"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="Lily"
            dataKey="B"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </div>
    </div>
  );
};
