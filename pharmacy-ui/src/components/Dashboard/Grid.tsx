import { ActivityGraph } from "./ActivityGraph"
import { RecentTransactions } from "./RecentTransactions"
import { StartCards } from "./StartCards"
import { UsageRader } from "./UsageRader"
export const Grid = () => {
  return (
    <div
    className="px-4 grid gap-3 grid-cols-12"
    >
        <StartCards />
        <ActivityGraph />
        <UsageRader />
        <RecentTransactions />
    </div>
  )
}
