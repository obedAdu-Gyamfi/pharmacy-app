import React from 'react'
import { Outlet } from 'react-router-dom';
import { SalesTopBar } from '../Sales/SalesTopBar';
import { SearchBar } from '../Sidebar/SearchBar';

export const SupplierPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SalesTopBar />
      <SearchBar
              endpoint="/search-supplier/"
              onSelect={(supplier) => console.log(supplier)}
            />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
