import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading, unsetLoading } from "../../store/slices/loadingSlice";
import Update from "./update";
import { MdAddBox } from "react-icons/md";
import AddNew from "./AddNew";

const Notes = () => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(true);
  const [data, setData] = useState([]);
  const [filtredData, setFiltredData] = useState([]);

  const [updateForm, setUpdateForm] = useState();
  const [addForm, setAddForm] = useState();
  const [itemToEdit, setItemToEdit] = useState();

  const [filiereFilter, setFiliereFilter] = useState(false);
  const [groupeFilter, setGroupeFilter] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState("Filiere");
  const [selectedGroupe, setSelectedGroupe] = useState("Groupe");
  const [filieres, setFilieres] = useState([]);
  const [groupes, setGroupes] = useState([]);

  const fetchFormateurs = async () => {
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/formateurs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    const filieres = res.payload.map((item) => {
      return item.filieres;
    });
    const groupes = filieres.map((item) => {
      return item.groupes;
    });
    // setFilieres(filieres);
    // setGroupes(groupes);
    setFiltredData(res.payload);
    setData(res.payload);
    return dispatch(unsetLoading());
  };

  const fetchFilieres = async () => {
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/filieres`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await req.json();
    const groupes = res.payload.flatMap((filiere) => {
      return filiere.groupes;
    });
    setGroupes(groupes);
    setFilieres(res.payload);
    return dispatch(unsetLoading());
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setUpdateForm(true);
  };

  const handleUpdate = async (
    id,
    nomInput,
    cinInput,
    emailInput,
    filiereInput,
    groupeInput
  ) => {
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("name", nomInput);
    formData.append("cin", cinInput);
    formData.append("email", emailInput);
    for (let i = 0; i < filiereInput.length; i++) {
      formData.append(`filieres_ids[${i}]`, filiereInput[i]);
    }
    for (let i = 0; i < groupeInput.length; i++) {
      formData.append(`groupes_ids[${i}]`, groupeInput[i]);
    }

    const req = await fetch(`${api}/formateurs/${id}`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const res = await req.json();
    fetchFormateurs();
    fetchFilieres();
    return setUpdateForm(false);
  };

  const handleAdd = async (
    nomInput,
    cinInput,
    emailInput,
    filiereInput,
    groupeInput
  ) => {
    console.log(groupeInput);
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("name", nomInput);
    formData.append("cin", cinInput);
    formData.append("email", emailInput);
    formData.append("role", 'formateur');
    for (let i = 0; i < filiereInput.length; i++) {
      formData.append(`filieres_ids[${i}]`, filiereInput[i]);
    }
    for (let i = 0; i < groupeInput.length; i++) {
      formData.append(`groupes_ids[${i}]`, groupeInput[i]);
    }

    const req = await fetch(`${api}/formateurs/`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const res = await req.json();
    console.log(res);
    setAddForm(false);
    return fetchFormateurs();
  };

  const handleDelete = async (id) => {
    dispatch(setLoading());

    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/formateurs/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    console.log(res);
    setUpdateForm(false);
    fetchFilieres();
    return fetchFormateurs();
  };

  useEffect(() => {
    if (firstLoad) {
      fetchFormateurs();
      fetchFilieres();
      setFirstLoad(false);
    }
  }, [filtredData, filieres]);

  return (
    <>
      {addForm && (
        <AddNew
          filieres={filieres}
          groupes={groupes}
          addForm={addForm}
          setAddForm={setAddForm}
          handleAdd={handleAdd}
        />
      )}
      {updateForm && (
        <Update
          itemToEdit={itemToEdit}
          filieres={filieres}
          groupes={groupes}
          updateForm={updateForm}
          setUpdateForm={setUpdateForm}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      )}
      <section className="bg-gray-50  p-3 w-full h-full">
        <div className="mx-auto translate-y-[5vh] max-w-screen-lg px-4 lg:px-12">
          <div className="bg-white relative shadow-md sm:rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              {filtredData && (
                <div className="w-full flex justify-between items-center">
                  <p className=" whitespace-nowrap text-lg font-medium italic">
                    Gérer Les Formateurs
                  </p>
                  <div class="w-full md:w-auto flex justify-end">
                    <button
                      class="text-white gap-1 h-fit justify-center items-center inline-flex bg-green-500 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      onClick={() => setAddForm(true)}>
                      <MdAddBox className="" />

                      <p>Nouveau formateur</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="max-h-[75vh] overflow-auto">
              {/*Table-----------------------------*/}
              <table className="w-full text-sm text-left text-gray-500 relative border min-h-fit">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50  sticky top-0">
                  <tr>
                    <>
                      <th scope="col" className="px-4 py-3">
                        Formateur
                      </th>
                      <th scope="col" className="px-4 py-3">
                        E-MAIL
                      </th>
                    </>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtredData?.map((item) => {
                    const { name, email } = item;
                    return (
                      <>
                        <tr className="border-b w-full">
                          <td className="px-4 py-3">{name}</td>
                          <td className="px-4 py-3">{email}</td>
                          <td className="px-4 py-3 w-full flex items-center justify-end self-end col-span-4 relative">
                            <button
                              onClick={() => handleEdit(item)}
                              id="apple-imac-27-dropdown-button"
                              filtredData-dropdown-toggle="apple-imac-27-dropdown"
                              className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg hover:first:visible  group"
                              type="button">
                              <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                              <span class="tooltiptext text-sm font-normal hidden group-hover:block fixed left-[95%] z-20 text-center px-2 py-1 bg-gray-300 w-fit whitespace-nowrap rounded after:content-[' '] after:absolute after:right-[100%] after:top-[50%] after:translate-y-[-50%] after:border-[5px] after:border-transparent after:border-r-gray-300  ">
                                Modifier
                              </span>
                            </button>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Notes;
