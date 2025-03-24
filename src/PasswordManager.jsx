import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { encryptPassword, decryptPassword } from "./encryption";

const PasswordManager = ({ user }) => {
  const [passwords, setPasswords] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    const { data, error } = await supabase
      .from("passwords")
      .select("*")
      .eq("user_id", user.id);

    if (!error) {
      setPasswords(data.map((p) => ({ ...p, password: decryptPassword(p.password) })));
    }
  };

  const savePassword = async () => {
    const encryptedPassword = encryptPassword(password);
    await supabase.from("passwords").insert([{ name, password: encryptedPassword, user_id: user.id }]);
    setName("");
    setPassword("");
    fetchPasswords();
  };

  const deletePassword = async (id) => {
    await supabase.from("passwords").delete().match({ id });
    fetchPasswords();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold mb-6">🗝️ Passwort-Manager</h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="text"
          placeholder="Name (z. B. Gmail)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded-md"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded-md"
        />
        <button onClick={savePassword} className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md">
          Speichern
        </button>
      </div>

      <h3 className="text-xl font-bold mt-6">Gespeicherte Passwörter</h3>
      <ul className="mt-4 w-full max-w-md">
        {passwords.map((p) => (
          <li key={p.id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center mb-2">
            <span>
              <strong>{p.name}:</strong> {p.password}
            </span>
            <button onClick={() => deletePassword(p.id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md">
              Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordManager;