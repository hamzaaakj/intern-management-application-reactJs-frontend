import React, { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { setLoading, unsetLoading } from "../../store/slices/loadingSlice";

const Login = () => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    dispatch(setLoading());
    let formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await fetch("http://localhost:8000/sanctum/csrf-cookie");

    const req = await fetch(`${api}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const res = await req.json();

    localStorage.setItem("token", res.token);
    dispatch(unsetLoading());
    return window.location.replace("http://localhost:3000");
  };

  return (
    <>
      <section className="bg-gray-50 w-full">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Connectez-vous
              </h1>
              <form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    for="email"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Votre email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    placeholder="name@company.com"
                    required=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    for="password"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Mot de pass
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    required=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <button
                  type="button"
                  className="w-full shadow-md text-black bg-gray-100 hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                  onClick={handleLogin}>
                  Se connecter
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
