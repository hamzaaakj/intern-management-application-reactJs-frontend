import { useEffect } from "react";
import { useState } from "react";
import { MdFileUpload, MdAddBox } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setLoading, unsetLoading } from "../../store/slices/loadingSlice";
import UniqueArray from "../../utils/UniqueArray";

export default ({ addFiliereForm, setAddFiliereForm, fetchFilieres }) => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();

  const [firstLoad, setFirstLoad] = useState(true);
  const [filiereInput, setFiliereInput] = useState("");

  const handleAddFiliere = async (e) => {
    dispatch(setLoading());
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("name", filiereInput);

    const req = await fetch(`${api}/filieres`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const res = await req.json();
    setAddFiliereForm(false);

    return fetchFilieres();
  };

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, []);

  return (
    <>
      <div className="w-screen h-screen bg-gray-400 bg-opacity-50 absolute left-0 top-0 z-20 flex justify-center items-center overflow-hidden">
        <div class="flex justify-center w-fit h-fit mx-auto">
          <button
            id="defaultModalButton"
            data-modal-toggle="defaultModal"
            class="block text-white bg-primary-700 hover:bg-primary-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            type="button"></button>
        </div>

        <div
          id="defaultModal"
          tabindex="-1"
          aria-hidden="true"
          class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
          <div class="mx-auto translate-y-[30%] p-4 max-w-2xl h-fit">
            <div class="relative p-4 bg-white rounded-lg shadow sm:p-5">
              <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                <h3 class="text-lg font-semibold text-gray-900">
                  Ajouter une filiere
                </h3>
                <button
                  onClick={() => setAddFiliereForm(false)}
                  type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                  data-modal-toggle="defaultModal">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"></path>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <form action="#" enctype="multipart/form-data">
                <div class="flex gap-4 mb-4 ">
                  <div className="min-w-[70%]">
                    <label
                      for="name"
                      class="block mb-2 text-sm font-medium text-gray-900">
                      Nom de filiere
                    </label>
                    <input
                      onInput={(e) => setFiliereInput(e.target.value)}
                      type="text"
                      name="name"
                      id="name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5"
                      placeholder="Saisissez le nom de la filiere"
                      required=""
                    />
                  </div>

                  <button
                    type="button"
                    class="text-white self-end gap-1 h-fit justify-center items-center inline-flex bg-teal-400 hover:bg-primary-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={(e) => handleAddFiliere(e)}>
                    <MdAddBox className="" />

                    <p>Ajouter</p>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
