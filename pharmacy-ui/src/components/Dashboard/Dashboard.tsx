import { Grid } from "./Grid";
import { TopBar } from "./TopBar";

const Dashboard = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[220px]">
      <TopBar 
      />
      <Grid />
    </div>
  );
};
export default Dashboard;
