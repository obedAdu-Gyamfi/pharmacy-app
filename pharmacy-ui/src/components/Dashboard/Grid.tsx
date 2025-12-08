import { ActivityGraph } from "./ActivityGraph"
import { RecentTransactions } from "./RecentTransactions"
import { StartCards } from "./StartCards"
import { UsageRader } from "./UsageRader"

interface Props {
  selectedPeriod: string;
}
export const Grid = ({selectedPeriod}: Props) => {
  return (
    <div
    className="px-4 grid gap-3 grid-cols-12"
    >
        <StartCards selectedPeriod={selectedPeriod}/>
        <ActivityGraph />
        <UsageRader />
        <RecentTransactions />
    </div>
  )
}
