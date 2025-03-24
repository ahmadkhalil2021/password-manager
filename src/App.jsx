import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import PasswordManager from "./PasswordManager";
import Auth from "./Auth";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {user ? (
        <>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 mt-4 rounded-md ml-[86rem]">Logout</button>
          <PasswordManager user={user} />
        </>
      ) : (
        <Auth setUser={setUser} />
      )}
    </div>
  );
};

export default App;