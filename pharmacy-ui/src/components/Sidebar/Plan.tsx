
import axios from "axios";

 
export const Plan = () => {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <div
      className="flex sticky top-[calc(100vh_-_48px_-_16px)]
    flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs
    "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Pharmacy App</p>
          <p className="text-stone-500">Good Health</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-2 py-1.5 font-medium text-white bg-stone-600 rounded-full baseline hover:bg-darkGreyishBlue transition-colors"
          >
          Sign Out
        </button>
      </div>
    </div>
  );
}
