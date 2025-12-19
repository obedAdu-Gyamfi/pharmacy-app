import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../Login/axiosClient";




export const SearchBar = ({ endpoint, onSelect }: { endpoint: string; onSelect: (item: any) => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get(endpoint, {
          params: { query: debouncedQuery },
        });
        setResults(res.data.data);
        setOpen(true);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, endpoint]);

  return (
    <div className="relative">
      <div className="flex items-center bg-stone-200 rounded px-2 py-1.5">
        <FiSearch className="mr-2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="bg-transparent w-full focus:outline-none"
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && (
        <div className="absolute z-50 bg-white shadow rounded w-full mt-1 max-h-64 overflow-y-auto">
          {loading && (
            <div className="p-2 text-sm text-stone-500">Searching...</div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-2 text-sm text-stone-500">No results</div>
          )}

          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelect(item);
                setQuery("");
                setOpen(false);
              }}
              className="p-2 hover:bg-stone-100 cursor-pointer text-sm"
            >
              <div className="font-medium">{item.name || item.username}</div>
              <div className="text-xs text-stone-500">
                {item.generic_name || item.email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};




export function useDebounce(value: string, delay: number = 300): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}