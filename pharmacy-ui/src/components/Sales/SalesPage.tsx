import { SalesTopBar } from './SalesTopBar';
import { Outlet } from 'react-router-dom';


export const SalesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SalesTopBar />

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
