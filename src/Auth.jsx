/* eslint-disable no-unused-vars */
import { useState } from "react";
import { supabase } from "./supabase";

const Auth = ({ setUser, traslation: t }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setError(t("confirm_message"));
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else setUser(data.user);
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">😊 {t("login")}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 bg-gray-700 text-white rounded-md w-full mt-2"
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 bg-gray-700 text-white rounded-md w-full mt-2"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 mt-2 rounded-md w-full"
      >
        {t("login")}
      </button>
      <button
        onClick={handleSignUp}
        className="bg-green-500 hover:bg-green-600 px-4 py-2 mt-2 rounded-md w-full"
      >
        {t("sign_up")}
      </button>
    </div>
  );
};

export default Auth;
