import React from 'react'
import { Outlet } from 'react-router-dom'
import { SalesTopBar } from '../Sales/SalesTopBar';

export const CustomersPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
          <SalesTopBar />
    
          <main className="flex-1 p-4">
            <Outlet />
          </main>
    </div>
      );
}
