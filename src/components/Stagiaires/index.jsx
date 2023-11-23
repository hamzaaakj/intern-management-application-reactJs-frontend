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

  const fetchStagiaires = async () => {
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/stagiaires`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    const filieres = res.payload.map((item) => {
      return item.filiere;
    });
    const groupes = res.payload.map((item) => {
      return item.groupe;
    });
    setFilieres(filieres);
    setGroupes(groupes);
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
    filiere_idInput,
    group_idInput
  ) => {
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/stagiaires/${id}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nomInput,
        cin: cinInput,
        email: emailInput,
        filiere_id: filiere_idInput,
        groupe_id: group_idInput,
      }),
    });

    const res = await req.json();
    setUpdateForm(false);
    return fetchStagiaires();
  };

  const handleAdd = async (
    nomInput,
    cinInput,
    emailInput,
    filiere_idInput,
    group_idInput
  ) => {
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/stagiaires/`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nomInput,
        cin: cinInput,
        email: emailInput,
        filiere_id: filiere_idInput,
        groupe_id: group_idInput,
      }),
    });

    const res = await req.json();
    setAddForm(false);
    return fetchStagiaires();
  };

  const handleDelete = async (id) => {
    dispatch(setLoading());

    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/stagiaires/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    setUpdateForm(false);
    fetchFilieres();
    return fetchStagiaires();
  };

  const filterByFiliere = (obj) => {
    if (obj === "All") {
      const groupes = data.map((item) => {
        return item.groupe;
      });
      setGroupes(groupes);
      setSelectedGroupe("Groupe");
      setSelectedFiliere("Filiere");
      setFiliereFilter(false);
      setGroupeFilter(false);
      setFiltredData(data);
      return data;
    }
    let newData = [...data];

    newData = newData.filter((item) => {
      return item.filiere.name === obj.name;
    });

    const groupes = newData.map((item) => {
      return item.groupe;
    });
    setGroupes(groupes);
    setSelectedGroupe("Groupe");
    setFiliereFilter(false);
    setGroupeFilter(false);
    setSelectedFiliere(obj);
    setFiltredData(newData);
    dispatch(unsetLoading());
    return newData;
  };

  const filterByGroupe = (obj) => {
    let newData = [...data];

    newData = newData.filter((item) => {
      return item.groupe.name === obj.name;
    });

    setSelectedGroupe(obj);
    setFiliereFilter(false);
    setGroupeFilter(false);
    setFiltredData(newData);
    dispatch(unsetLoading());
    return newData;
  };

  useEffect(() => {
    if (firstLoad) {
      fetchStagiaires();
      fetchFilieres();
      setFirstLoad(false);
    }
  }, [filtredData]);

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
                    Gérer Les Stagiaires
                  </p>
                  <div className="w-full flex gap-4 items-center justify-end ">
                    {/*filter&search*/}

                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                      <div className="flex items-center space-x-3 w-full md:w-auto">
                        {/* Filiere filter */}
                        <div className="relative group h-full min-w-1/3">
                          <button
                            onClick={() => {
                              setFiliereFilter(!filiereFilter);
                              setGroupeFilter(false);
                            }}
                            id="actionsDropdownButton"
                            data-dropdown-toggle="actionsDropdown"
                            className="relative w-full flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 whitespace-nowrap"
                            type="button">
                            <svg
                              className="-ml-1 mr-1.5 w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true">
                              <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              />
                            </svg>
                            {selectedFiliere.name || "Filiere"}
                          </button>
                          {filiereFilter && (
                            <div
                              id="actionsDropdown"
                              className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow  absolute right-0 top-[100%]">
                              <ul
                                className="text-sm text-gray-700 "
                                aria-labelledby="actionsDropdownButton">
                                <li
                                  className="py-2 px-2 cursor-pointer hover:bg-slate-400 border-b border-gray-200 last:border-none"
                                  onClick={() => filterByFiliere("All")}>
                                  All
                                </li>
                                {filieres.map((filiere, index) => {
                                  return (
                                    <>
                                      <li
                                        className="py-2 px-2 cursor-pointer hover:bg-slate-400 border-b border-gray-200 last:border-none"
                                        onClick={() =>
                                          filterByFiliere(filiere)
                                        }>
                                        {filiere.name}
                                      </li>
                                    </>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Groupe filter */}
                        <div className="group relative w-full h-full">
                          <button
                            onClick={() => {
                              setGroupeFilter(!groupeFilter);
                              setFiliereFilter(false);
                            }}
                            id="actionsDropdownButton"
                            data-dropdown-toggle="actionsDropdown"
                            className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 "
                            type="button">
                            <svg
                              className="-ml-1 mr-1.5 w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true">
                              <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              />
                            </svg>
                            {selectedGroupe.name || "Groupe"}
                          </button>
                          {groupeFilter && (
                            <div
                              id="actionsDropdown"
                              className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow  absolute right-0 top-[100%]">
                              <ul
                                className="py-1 text-sm text-gray-700 "
                                aria-labelledby="actionsDropdownButton">
                                {groupes.map((groupe) => {
                                  return (
                                    <li
                                      onClick={() => filterByGroupe(groupe)}
                                      key={groupe.id}
                                      className="block py-2 px-2 cursor-pointer hover:bg-slate-400 border-b border-gray-200 last:border-none">
                                      {groupe.name}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div class="w-full md:w-auto flex justify-end">
                      <button
                        class="text-white gap-1 h-fit justify-center items-center inline-flex bg-green-500 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={() => setAddForm(true)}>
                        <MdAddBox className="" />

                        <p>Nouveau stagiaire</p>
                      </button>
                    </div>
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
                        Nom Etudiant
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Filiere
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Groupe
                      </th>
                    </>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtredData?.map((item) => {
                    const {
                      name,
                      filiere: { name: branchName },
                      groupe: { name: groupName },
                    } = item;
                    return (
                      <>
                        <tr className="border-b w-full">
                          <td className="px-4 py-3">{name}</td>
                          <td className="px-4 py-3">{branchName}</td>
                          <td className="px-4 py-3">{groupName}</td>
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
