import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import PasswordManager from "./PasswordManager";
import Auth from "./Auth";
import "./i18n";
import { useTranslation } from "react-i18next";

const App = () => {
  const [user, setUser] = useState(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => changeLanguage("en")}
          className="bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        rounded
        sm:self-center"
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => changeLanguage("de")}
          className="bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        rounded
        sm:self-center"
        >
          🇩🇪 Deutsch
        </button>
      </div>
      {user ? (
        <>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-6 py-2 mt-4 rounded-md sm:self-center"
          >
            {t("logout")}
          </button>
          <PasswordManager user={user} traslation={t} />
        </>
      ) : (
        <Auth setUser={setUser} traslation={t} />
      )}
    </div>
  );
};

export default App;
