import { useState, useEffect } from "react";
import Update from "./update";
import { useDispatch } from "react-redux";
import { setLoading, unsetLoading } from "../../store/slices/loadingSlice";

const Notes = () => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(true);
  const [data, setData] = useState([]);
  const [filtredData, setFiltredData] = useState([]);

  const [updateForm, setUpdateForm] = useState();
  const [u, setU] = useState("");
  const [groupName, setGroupName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [efm, setEfm] = useState("");
  const [controle1, setControle1] = useState("");
  const [controle2, setControle2] = useState("");
  const [controle3, setControle3] = useState(false);

  const [filiereFilter, setFiliereFilter] = useState(false);
  const [groupeFilter, setGroupeFilter] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState("Filiere");
  const [selectedGroupe, setSelectedGroupe] = useState("Groupe");
  const [filieres, setFilieres] = useState([]);
  const [groupes, setGroupes] = useState([]);

  const filterByFiliere = (obj) => {
    dispatch(setLoading());

    if (obj === "All") {
      setGroupes(data[0].groupes);
      setSelectedGroupe("Groupe");
      setSelectedFiliere("Filiere");
      setFiliereFilter(false);
      setGroupeFilter(false);
      setFiltredData(data);
      dispatch(unsetLoading());
      return data;
    }
    let newData = [...data];

    newData = newData.map((item) => {
      return {
        ...item,
        groupes: item.groupes.map((group) => {
          return {
            ...group,
            stagiaires: group.stagiaires.filter(
              (stagiaire) => stagiaire.filiere_id === obj.id
            ),
          };
        }),
      };
    });

    const groupes = newData[0].groupes.filter(
      (groupe) => groupe.filiere_id === obj.id
    );

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
    dispatch(setLoading());
    let newData = [...data];

    newData = newData.map((item) => {
      return {
        ...item,
        groupes: item.groupes.filter((groupe) => groupe.id === obj.id),
      };
    });

    setFiliereFilter(false);
    setGroupeFilter(false);
    setSelectedGroupe(obj);
    setFiltredData(newData);
    return dispatch(unsetLoading());
  };

  const getGrades = async () => {
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/notes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    if (res.payload.role === "surveillant") {
      setFilieres(res.payload.filieres);
      setGroupes(res.payload.groupes);
      setFiltredData([res.payload]);
      setData([res.payload]);
      return dispatch(unsetLoading());
    }
    setFilieres(res.payload[0]?.filieres);
    setGroupes(res.payload[0]?.groupes);
    setFiltredData(res.payload);
    setData(res.payload);
    return dispatch(unsetLoading());
  };

  const handleEdit = (stagiaire, groupName, moduleName, evaluations) => {
    evaluations = evaluations.map((evaluation) => {
      return {
        ...evaluation,
        notes: evaluation.notes.filter((note) => note.user_id === stagiaire.id),
      };
    });

    setU(stagiaire);
    setGroupName(groupName);
    setModuleName(moduleName);
    setEfm(evaluations[0].notes[0]);
    setControle1(evaluations[1].notes[0]);
    setControle2(evaluations[2].notes[0]);
    if (evaluations[3]) {
      setControle3(evaluations[3].notes[0]);
    }

    return setUpdateForm(true);
  };

  const handleUpdate = async (
    efmInput,
    controle1Input,
    controle2Input,
    controle3Input
  ) => {
    dispatch(setLoading());
    setUpdateForm(false);

    const token = localStorage.getItem("token");

    const evaluations = [efm, controle1, controle2, controle3];
    const notes = [efmInput, controle1Input, controle2Input, controle3Input];

    evaluations.forEach(async (evaluation, index) => {
      const { id, valeur } = evaluation;
      let form = new FormData();
      form.append("valeur", notes[index]);

      const req = await fetch(`${api}/notes/${id}`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const res = await req.json();
      return getGrades();
    });
  };

  useEffect(() => {
    if (firstLoad) {
      getGrades();
      setFirstLoad(false);
    }
  }, [filtredData, updateForm, handleUpdate]);

  return (
    <>
      {updateForm && (
        <Update
          updateForm={updateForm}
          setUpdateForm={setUpdateForm}
          u={u}
          groupName={groupName}
          moduleName={moduleName}
          efm={efm}
          controle1={controle1}
          controle2={controle2}
          controle3={controle3}
          handleUpdate={handleUpdate}
        />
      )}
      <section className="bg-gray-50  p-3 w-full h-full">
        <div className="mx-auto translate-y-[5vh] max-w-screen-lg px-4 lg:px-12">
          <div className="bg-white relative shadow-md sm:rounded-lg">
            <div className="">
              {filtredData[0]?.role !== "stagiaire" && (
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  {/*filter&search*/}
                  <p className=" whitespace-nowrap text-lg font-medium italic">
                    Gérer Les Notes
                  </p>
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
                                      onClick={() => filterByFiliere(filiere)}>
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
                </div>
              )}
              {/*Table-----------------------------*/}
              <div className=" max-h-[75vh] overflow-y-auto overflow-x-hidden">
                <table className="w-full text-sm text-left text-gray-500 relative border min-h-fit">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50  sticky top-0">
                    <tr>
                      {filtredData[0]?.role !== "stagiaire" && (
                        <>
                          <th scope="col" className="px-4 py-3">
                            Nom Etudiant
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Groupe
                          </th>
                        </>
                      )}
                      <th scope="col" className="px-4 py-3 text-start">
                        Module
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        EFM
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        Controle 1
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        Controle 2
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        Controle 3
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        Moyenne
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  {data[0]?.role === "stagiaire" && (
                    <tbody>
                      {data[0]?.filiere?.modules?.map((module, index) => {
                        const { name: subjectName, evaluations } = module;

                        const evalsVals = evaluations.map((evaluation) => {
                          return evaluation.notes[0].valeur;
                        });
                        const crlsVals = evalsVals
                          .slice(1)
                          .reduce((total, crlVal) => {
                            return total + parseFloat(crlVal);
                          }, 0);

                        const avg =
                          parseFloat(evaluations[0]?.notes[0]?.valeur) * 0.5 +
                          (crlsVals / module.nrControles) * 0.5;
                        return (
                          <tr className="border-b w-full">
                            {/* {role !== 'stagiaire' && <td className="px-4 py-3">{studentName}</td>} */}

                            <td className="px-4 py-3">{subjectName}</td>
                            <td className="px-4 py-3 text-center">
                              {evaluations[0]?.notes[0]?.valeur}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {evaluations[1]?.notes[0]?.valeur}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {evaluations[2]?.notes[0]?.valeur}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {evaluations[3]
                                ? evaluations[3]?.notes[0]?.valeur
                                : "---"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {avg.toFixed(2)}
                            </td>

                            {filtredData[0]?.role === "formateur" && (
                              <td className="px-4 py-3 w-full flex items-center justify-end self-end col-span-4">
                                <button
                                  id="apple-imac-27-dropdown-button"
                                  filtredData-dropdown-toggle="apple-imac-27-dropdown"
                                  className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg"
                                  type="button">
                                  <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                  </svg>
                                </button>
                                <div
                                  id="apple-imac-27-dropdown"
                                  className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow ">
                                  <ul
                                    className="py-1 text-sm text-gray-700 "
                                    aria-labelledby="apple-imac-27-dropdown-button">
                                    <li>
                                      <a
                                        href="#"
                                        className="block py-2 px-4 hover:bg-gray-100 ">
                                        Edit
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
                  {filtredData[0]?.role !== "stagiaire" && (
                    <tbody className="overflow-auto">
                      <>
                        {filtredData[0]?.groupes.flatMap((groupe, index) => {
                          const { name: groupName } = groupe;
                          return (
                            <>
                              {groupe.stagiaires.flatMap((stagiaire, index) => {
                                const {
                                  id,
                                  name,
                                  filiere: { modules: studentModules },
                                } = stagiaire;

                                return (
                                  <>
                                    {studentModules.map((module) => {
                                      const { name: subjectName, evaluations } =
                                        module;

                                      const filterdEvals = evaluations.map(
                                        (evaluation) => {
                                          return {
                                            ...evaluation,
                                            notes: evaluation.notes.filter(
                                              (note) => note.user_id === id
                                            ),
                                          };
                                        }
                                      );
                                      const evalsVals = filterdEvals.map(
                                        (evaluation) => {
                                          return evaluation.notes[0].valeur;
                                        }
                                      );
                                      const crlsVals = evalsVals
                                        .slice(1)
                                        .reduce((total, crlVal) => {
                                          return total + parseFloat(crlVal);
                                        }, 0);

                                      const avg =
                                        parseFloat(evalsVals[0]) * 0.5 +
                                        (crlsVals / module.nrControles) * 0.5;
                                      return (
                                        <>
                                          <tr className="border-b w-full">
                                            <td className="px-4 py-3 font-medium">
                                              {name}
                                            </td>
                                            <td className="px-4 py-3">
                                              {groupName}
                                            </td>
                                            <td className="px-4 py-3">
                                              {module.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              {filterdEvals[0]
                                                ? filterdEvals[0]?.notes[0]
                                                    ?.valeur
                                                : "---"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              {filterdEvals[1]
                                                ? filterdEvals[1]?.notes[0]
                                                    ?.valeur
                                                : "---"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              {filterdEvals[2]
                                                ? filterdEvals[2]?.notes[0]
                                                    ?.valeur
                                                : "---"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              {filterdEvals[3]
                                                ? filterdEvals[3]?.notes[0]
                                                    ?.valeur
                                                : "---"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              {avg.toFixed(2)}
                                            </td>
                                            {filtredData[0]?.role !==
                                              "stagiaire" && (
                                              <td className="px-4 z py-3 w-full flex items-center justify-end self-end col-span-4 relative">
                                                <button
                                                  onClick={() =>
                                                    handleEdit(
                                                      stagiaire,
                                                      groupName,
                                                      module.name,
                                                      evaluations
                                                    )
                                                  }
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
                                                  <span class="tooltiptext text-sm font-normal hidden group-hover:block fixed left-[95%] z-30 text-center px-2 py-1 bg-gray-300 w-fit whitespace-nowrap rounded after:content-[' '] after:absolute after:right-[100%] after:top-[50%] after:translate-y-[-50%] after:border-[5px] after:border-transparent after:border-r-gray-300  ">
                                                    Modifier
                                                  </span>
                                                </button>
                                              </td>
                                            )}
                                          </tr>
                                        </>
                                      );
                                    })}
                                  </>
                                );
                              })}
                            </>
                          );
                        })}
                      </>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Notes;
