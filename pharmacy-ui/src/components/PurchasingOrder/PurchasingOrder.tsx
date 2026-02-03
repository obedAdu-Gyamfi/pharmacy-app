import { SalesTopBar } from "../Sales/SalesTopBar";

export const PurchasingOrder = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <SalesTopBar />
      <main className="flex-1 p-6">
        <div className="rounded border border-stone-300 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            Purchasing Order
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage purchase orders here.
          </p>
        </div>
      </main>
    </div>
  );
};
