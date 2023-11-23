import React from "react";
import { useDispatch } from "react-redux";
import { unsetLoading } from "../../store/slices/loadingSlice";
import { useEffect } from "react";
import { useState } from "react";
import Capitalize from "../../utils/Capitalize";

export default () => {
  const api = window.env.API_URI;
  const dispatch = useDispatch();

  const [user, setUser] = useState([]);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    const user = res.payload;
    setUser(user);
    return dispatch(unsetLoading());
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <section className="bg-gray-50 p-2 w-full h-full">
      {user[0] && (
        <div className="mx-auto shadow-md translate-y-[5vh] max-w-screen-lg rounded overflow-hidden">
          <div class="relative mx-auto w-full shadow-lg h-full md:h-auto ">
            <div class="relative w-full h-full p-4 bg-white sm:p-5 mx-auto">
              <form action="#" className="w-full h-full">
                <div className="AVATAR border-50 w-full min-h-[10vh] flex justify-center pb-6">
                  <div className="AVATAR shadow-lg border-50 w-[12vh] h-[12vh] rounded-full overflow-hidden">
                    <img
                      src={
                        user[0]?.role === "stagiaire"
                          ? "/avatar.jpg"
                          : "/avatar2.jpg"
                      }
                      alt=""
                    />
                  </div>
                </div>
                <div class="flex mb-4">
                  <div className="left flex flex-col gap-4 pr-4 border-r border-gray-300 w-[50%]">
                    <div>
                      <label
                        for="name"
                        class="block mb-2 text-sm font-medium text-gray-900 border-none">
                        NOM
                      </label>
                      <input
                        disabled
                        value={Capitalize(user[0]?.name)}
                        type="text"
                        name="name"
                        id="name"
                        class="bg-gray-50 border-white shadow-md text-sm rounded-lg block w-full p-2.5 "
                        placeholder="Type product name"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        CIN
                      </label>
                      <input
                        disabled
                        value={Capitalize(user[0]?.cin)}
                        type="text"
                        name="brand"
                        id="brand"
                        class="bg-gray-50 border-white shadow-md text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                        placeholder="Product brand"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        E-MAIL
                      </label>
                      <input
                        disabled
                        value={Capitalize(user[0]?.email)}
                        type="text"
                        name="brand"
                        id="brand"
                        class="bg-gray-50 border-white shadow-md text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                        placeholder="Product brand"
                        required=""
                      />
                    </div>
                  </div>
                  <div className="right flex flex-col gap-4 pl-4 w-[50%]">
                    <div>
                      {user[0]?.filiere && (
                        <label
                          for="price"
                          class="block mb-2 text-sm font-medium text-gray-900">
                          FILIERE
                        </label>
                      )}
                      {user[0]?.filieres && (
                        <label
                          for="price"
                          class="block mb-2 text-sm font-medium text-gray-900">
                          FILIERES
                        </label>
                      )}
                      {user[0]?.filiere && (
                        <input
                          disabled
                          value={Capitalize(user[0]?.filiere.name)}
                          name="price"
                          id="price"
                          class="bg-gray-50 border-white shadow-md text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                          required=""
                        />
                      )}
                      {user[0]?.filieres && (
                        <ul class="bg-gray-50 border-white shadow-md text-gray-900 text-sm rounded-lg block w-full p-2.5 ">
                          {user[0]?.filieres.map((filiere) => {
                            return <li>{Capitalize(filiere.name)}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                    <div>
                      {user[0]?.groupe && (
                        <label
                          for="price"
                          class="block mb-2 text-sm font-medium text-gray-900">
                          GROUPE
                        </label>
                      )}
                      {user[0]?.groupes && (
                        <label
                          for="price"
                          class="block mb-2 text-sm font-medium text-gray-900">
                          GROUPES
                        </label>
                      )}
                      {user[0]?.groupe && (
                        <input
                          disabled
                          value={Capitalize(user[0]?.groupe.name)}
                          name="price"
                          id="price"
                          class="bg-gray-50 border-white shadow-md text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                          required=""
                        />
                      )}
                      {user[0]?.groupes && (
                        <ul class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ">
                          {user[0]?.groupes.map((groupe) => {
                            return <li>{Capitalize(groupe.name)}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                  <svg
                    class="mr-1 -ml-1 w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"></path>
                  </svg>
                  Add new product
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
