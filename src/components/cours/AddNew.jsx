import { useEffect } from "react";
import { useState } from "react";
import { MdFileUpload, MdAddBox } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setLoading, unsetLoading } from "../../store/slices/loadingSlice";
import UniqueArray from "../../utils/UniqueArray";

export default ({ addForm, setAddForm, fetchCourses }) => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();

  const [firstLoad, setFirstLoad] = useState(true);
  const [filieres, setFilieres] = useState([]);
  const [modules, setModules] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [moduleInput, setModuleInput] = useState();
  const [filiereInput, setFiliereInput] = useState("");
  const [file, setFile] = useState("");

  const fetchFilieresModules = async () => {
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/filieres`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    const moduls = res.payload?.flatMap((filiere) => {
      return filiere.modules.flatMap((module) => module);
    });
    setModuleInput(moduls[0]?.id);

    const cleanSetModules = UniqueArray(moduls);
    setModules(cleanSetModules);
    setFilieres(res.payload);
    return dispatch(unsetLoading());
  };

  const handleFiliereChange = (keyword) => {
    const buffer = [...filieres];

    buffer.filter((filiere) => {
      return filiere.name === keyword;
    });
    setFilieres(buffer);

    const moduls = buffer.flatMap((buff) => {
      return buff.modules.map((module) => module);
    });
    const cleanSetModules = [...new Set(moduls)];
    setModules(cleanSetModules);
  };

  const handleFiliereSelection = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFiliereInput(values);
  };

  const handleUpload = async (e) => {
    dispatch(setLoading());
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("module_id", moduleInput);
    formData.append("fichierSource", file);
    for (let i = 0; i < filiereInput.length; i++) {
      formData.append(`filieres_ids[${i}]`, filiereInput[i]);
    }

    const req = await fetch(`${api}/mycourses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const res = await req.json();
    console.log(res);
    setAddForm(false);

    return fetchCourses();
  };

  useEffect(() => {
    if (firstLoad) {
      fetchFilieresModules();
      setFirstLoad(false);
    }
  }, [handleFiliereChange, handleUpload]);

  return (
    <>
      {addForm && (
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
                    Ajouter un cours
                  </h3>
                  <button
                    onClick={() => setAddForm(false)}
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
                        Titre
                      </label>
                      <input
                        onInput={(e) => setTitre(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5"
                        placeholder="Titre de cours"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="brand"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Description
                      </label>
                      <input
                        onInput={(e) => setDescription(e.target.value)}
                        type="text"
                        name="brand"
                        id="brand"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5"
                        placeholder="Description de cours"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        for="category"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Filiere
                      </label>
                      <select
                        multiple
                        onChange={(e) => handleFiliereSelection(e)}
                        id="category"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5">
                        {filieres.map((filiere, index) => {
                          return (
                            <option value={filiere.id} selected="">
                              {filiere.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label
                        for="category"
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Module
                      </label>
                      <select
                        onChange={(e) => setModuleInput(e.target.value)}
                        id="category"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5">
                        {modules.map((module, index) => {
                          return (
                            <option value={module.id} selected="">
                              {module.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="upload relative cursor-pointer mb-4 bg-gray-50 rounded py-4 w-full h-full flex justify-center items-center border border-dashed border-black">
                    <label
                      htmlFor="dropzone_file"
                      className="flex justify-center items-center flex-col cursor-pointer">
                      <MdFileUpload />
                      <p className=" cursor-pointer">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm cursor-pointer">
                        PDF. WORD (MAX. 16Mb)
                      </p>
                      <input
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full h-full absolute opacity-0 cursor-pointer"
                        type="file"
                        name="dropzone-file"
                        id="dropzone-file"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    class="text-white self-end gap-1 h-fit justify-center items-center inline-flex bg-blue-500 hover:bg-primary-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={(e) => handleUpload(e)}>
                    <MdAddBox className="" />

                    <p>Ajouter</p>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
