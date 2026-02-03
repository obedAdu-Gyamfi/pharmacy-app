import { SearchBar } from '../Sidebar/SearchBar';

export const Suppliers = () => {
  return (
    <div className="w-full">
      <div className="rounded-xl border border-stone-300 bg-white/70 p-6 shadow-sm backdrop-blur">
        <h2 className="text-lg font-semibold text-gray-800">Find Suppliers</h2>
        <p className="mt-1 text-sm text-gray-600">
          Use the search bar above to find a supplier and view details here.
        </p>
      </div>
    </div>
  );
}
