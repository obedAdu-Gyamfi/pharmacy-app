import { Outlet } from "react-router-dom";
import { SalesTopBar } from "../Sales/SalesTopBar";
import { SearchBar } from "../Sidebar/SearchBar";

export const ProductsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SalesTopBar />
      <SearchBar
        endpoint="/search-product/"
        onSelect={(product) => console.log(product)}
      />

      <main className="flex-1 p-4">
        <Outlet /> {/* CreateProduct will render here */}
      </main>
    </div>
  );
};
