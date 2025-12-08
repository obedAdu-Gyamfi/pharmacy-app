import { FiCalendar } from "react-icons/fi";
import { UserInformation } from "../Login/UserInformation";

interface Props{
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  periods: string[]; 
};
export const TopBar = ({selectedPeriod, setSelectedPeriod, periods}: Props) => {

  const user = UserInformation()
  if (!user) return <div>Loading User info...</div>
  console.log(user);
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-bold block">
            Welcome, {user.username}
          </span>
          <span className="text-xs block text-stone-500">
            Tuesday, Aug 8th 2023
          </span>
        </div>
        <div>
          <label className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded">
            <FiCalendar />
            <select
              className="bg-stone-100 border-none text-sm"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
