import { useEffect, useState } from "react";
import api from "../Login/axiosClient";
import { UserInformation } from "../Login/UserInformation";

export const ProfileWindow = () => {
  const user = UserInformation();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullname(user.fullname || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    if (!user) return;
    try {
      setIsSaving(true);
      const data = new URLSearchParams();
      data.append("fullname", fullname);
      data.append("email", email);
      data.append("phone", phone);
      await api.put(`/update-user/${user.id}`, data);
      setStatusMessage("Profile updated successfully.");
    } catch (err) {
      setErrorMessage("Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-stone-300 bg-white/70 p-6 shadow-sm backdrop-blur">
        <p className="text-sm text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-300 bg-white/70 p-6 shadow-sm backdrop-blur">
      <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
      <p className="mt-1 text-sm text-gray-600">
        Update your contact details below.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-sm text-gray-600" htmlFor="profile_fullname">
            Full Name
          </label>
          <input
            id="profile_fullname"
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600" htmlFor="profile_email">
            Email
          </label>
          <input
            id="profile_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600" htmlFor="profile_phone">
            Phone
          </label>
          <input
            id="profile_phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        {statusMessage && (
          <p className="text-sm text-green-600">{statusMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-full bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
