import { SearchBar } from '../Sidebar/SearchBar';

export const Suppliers = () => {
  return (
    <div>
      <SearchBar
        endpoint="/search-supplier/"
        onSelect={(supplier) => console.log(supplier)}
      />
    </div>
  );
}
