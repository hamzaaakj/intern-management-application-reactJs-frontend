import { useEffect } from "react";
import { useState } from "react";
import { MdFileUpload, MdAddBox } from "react-icons/md";

export default ({
  u,
  groupName,
  moduleName,
  efm,
  controle1,
  controle2,
  controle3,
  updateForm,
  setUpdateForm,
  handleUpdate,
}) => {
  const api = window.env.API_URI;

  const [firstLoad, setFirstLoad] = useState(true);

  const [efmInput, setEfmInput] = useState(efm.valeur);
  const [controle1Input, setControle1Input] = useState(controle1.valeur);
  const [controle2Input, setControle2Input] = useState(controle2.valeur);
  const [controle3Input, setControle3Input] = useState(controle3.valeur);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, []);

  return (
    <>
      {updateForm && (
        <div className="w-screen h-screen bg-gray-400 bg-opacity-50 absolute left-0 top-0 z-20 flex justify-center items-center">
          <div class="flex justify-center w-fit h-fit mx-auto">
            <button
              id="defaultModalButton"
              data-modal-toggle="defaultModal"
              class="block text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                    Modifier Note
                  </h3>
                  <button
                    onClick={() => setUpdateForm(false)}
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
                  <div class="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label
                        for="name"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        NOM ETUDIANT
                      </label>
                      <input
                        value={u.name}
                        disabled
                        type="text"
                        name="name"
                        id="name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5  cursor-not-allowed"
                        placeholder="Type product name"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Groupe
                      </label>
                      <input
                        value={groupName}
                        disabled
                        type="text"
                        name="brand"
                        id="brand"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5  cursor-not-allowed"
                        placeholder="Product brand"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Module
                      </label>
                      <input
                        value={moduleName}
                        disabled
                        type="text"
                        name="brand"
                        id="brand"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5  cursor-not-allowed"
                        placeholder="Product brand"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        EFM
                      </label>
                      <input
                        onChange={(e) => setEfmInput(e.target.value)}
                        value={efmInput}
                        type="number"
                        step="0.01"
                        min="0"
                        max="40"
                        name="brand"
                        id="brand"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5 "
                        placeholder="Product brand"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Controle 1
                      </label>
                      <input
                        onChange={(e) => setControle1Input(e.target.value)}
                        value={controle1Input}
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        name="brand"
                        id="brand"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5 "
                        placeholder="Product brand"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Controle 2
                      </label>
                      <input
                        onChange={(e) => setControle2Input(e.target.value)}
                        value={controle2Input}
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        name="brand"
                        id="brand"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5 "
                        placeholder="Product brand"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Controle3
                      </label>
                      <input
                        disabled={controle3 === false}
                        onChange={(e) => setControle3Input(e.target.value)}
                        value={controle3Input}
                        type="number"
                        placeholder={controle3 === false && "---"}
                        class={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5`}
                      />
                    </div>
                    <button
                      type="button"
                      class="text-white self-end gap-1 h-fit justify-center items-center inline-flex bg-teal-400 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      onClick={() =>
                        handleUpdate(
                          efmInput,
                          controle1Input,
                          controle2Input,
                          controle3Input
                        )
                      }>
                      <MdAddBox className="" />

                      <p>Mettre à jour</p>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
