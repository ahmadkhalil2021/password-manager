import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { encryptPassword, decryptPassword } from "./encryption";
import { Eye, EyeOff } from "lucide-react";

const PasswordManager = ({ user, traslation: t }) => {
  const [passwords, setPasswords] = useState([]);
  const [website, setWebsite] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    const { data, error } = await supabase
      .from("passwords")
      .select("*")
      .eq("user_id", user.id);

    if (!error) {
      setPasswords(
        data.map((p) => ({ ...p, password: decryptPassword(p.password) }))
      );
    }
  };

  const savePassword = async () => {
    const encryptedPassword = encryptPassword(password);
    await supabase
      .from("passwords")
      .insert([
        { name, password: encryptedPassword, user_id: user.id, website },
      ]);
    setName("");
    setPassword("");
    setWebsite("");
    fetchPasswords();
  };

  const deletePassword = async (id) => {
    await supabase.from("passwords").delete().match({ id });
    fetchPasswords();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🗝️ Passwort-Manager
      </h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded-md"
        />
        <input
          type="text"
          placeholder="Email (z. B. Gmail)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded-md"
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 mb-3 bg-gray-700 rounded-md"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button
          onClick={savePassword}
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md mt-2"
        >
          {t("save")}
        </button>
      </div>

      <h3 className="text-xl font-bold mt-6 text-center">
        {t("saved_passwords")}
      </h3>
      <ul className="mt-4 w-full max-w-md space-y-3">
        {passwords.map((p) => (
          <li
            key={p.id}
            className="bg-gray-800 p-3 rounded-lg flex justify-between items-center"
          >
            <span>
              <strong>{p.website}, </strong>
              <strong>{p.name}:</strong> {p.password}
            </span>
            <button
              onClick={() => deletePassword(p.id)}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
            >
              {t("delete")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordManager;
