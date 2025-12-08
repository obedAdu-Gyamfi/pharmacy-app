import { Grid } from "./Grid";
import { TopBar } from "./TopBar";
import { useState } from "react";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last one week");
  const periods = [
    "last one week",
    "last one month",
    "last three months",
    "last six months",
    "last one year",
  ];

  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
      <TopBar
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
      periods={periods}
      />
      <Grid selectedPeriod={selectedPeriod} />
    </div>
  );
};
export default Dashboard;
