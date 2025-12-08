
import { AccountToggle } from "./AccountToggle"
import { Search } from "./Search"
import { RouteSelect } from "./RouteSelect"
import { Plan } from "./Plan"
const Sidebar = () => {
  return (
    <div className="h-screen pt-4">
      <div className="fixed overflow-y-scroll top-4 h-[calc(100vh-32px-48px)]">
        <AccountToggle />
        <Search />
        <RouteSelect />

        <div className="px-2 pb-4">
          <Plan />
        </div>
      </div>
    </div>
  );
}

export default Sidebar