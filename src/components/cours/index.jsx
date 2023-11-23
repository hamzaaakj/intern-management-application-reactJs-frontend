import { useEffect, useState } from "react";
import { MdDownload, MdKeyboardArrowRight } from "react-icons/md";
import AddNew from "./AddNew";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading, unsetLoading } from "../../store/slices/loadingSlice";

export default () => {
  const api = window.env.API_URI;
  const dispatch = useDispatch();

  const [firstLoad, setFirstLoad] = useState(true);
  const [addForm, setAddForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filtredCourses, setFiltredCourses] = useState([]);

  const [filieres, setFilieres] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState("Filiere");
  const [selectedModule, setSelectedModule] = useState("Module");

  const [filiereFilter, setFiliereFilter] = useState(false);
  const [moduleFilter, setModuleFilter] = useState(false);

  const fetchCourses = async () => {
    dispatch(setLoading());

    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await req.json();
    const filieresArr = res.cours.flatMap((item) => {
      return item.filieres.flatMap((filiere) => {
        return filiere.name;
      });
    });

    setFilieres([...new Set(filieresArr)]);
    const modulesArr = res.cours.map((item) => {
      return item.module.name;
    });
    setModules([...modulesArr]);

    setFiltredCourses(res.cours);
    setCourses(res.cours);
    return dispatch(unsetLoading());
  };

  const filterByFiliere = (keyword) => {
    dispatch(setLoading());
    if (keyword === "Filiere" && selectedModule === "Module") {
      setSelectedFiliere("Filiere");
      setFiliereFilter(false);
      setFiltredCourses(courses);
      return dispatch(unsetLoading());
    }

    let buffer = [...courses];
    let arr = [];
    buffer.map((item) => {
      return item.filieres.map((filiere) => {
        if (
          (selectedModule === "Module" && filiere.name === keyword) ||
          (item.module.name === selectedModule && filiere.name === keyword) ||
          (item.module.name === selectedModule && keyword === "Filiere")
        ) {
          return arr.push(item);
        }
      });
    });

    setSelectedFiliere(keyword);
    setFiliereFilter(false);
    setFiltredCourses(arr);
    return dispatch(unsetLoading());
  };

  const filterByModule = (keyword) => {
    if (keyword === "Module" && selectedFiliere === "Filiere") {
      setSelectedModule("Module");
      setModuleFilter(false);
      return setFiltredCourses(courses);
    }

    let buffer = [...courses];
    let arr = [];
    buffer.map((item) => {
      return item.filieres.map((filiere) => {
        if (
          (selectedFiliere === "Filiere" && item.module.name === keyword) ||
          (filiere.name === selectedFiliere && item.module.name === keyword) ||
          (filiere.name === selectedFiliere && keyword === "Module")
        ) {
          return arr.push(item);
        }
      });
    });
    setModuleFilter(false);
    setSelectedModule(keyword);
    setFiltredCourses(arr);
  };

  useEffect(() => {
    if (firstLoad) {
      fetchCourses();
      setFirstLoad(false);
    }
  }, [filtredCourses]);

  return (
    <>
      <AddNew addForm={addForm} setAddForm={setAddForm} />
      <section class="bg-gray-50 w-screen p-3 ">
        <div className="wrapper h-full mx-auto max-w-screen-lg px-4 lg:px-12 translate-y-[5vh]">
          <section class="bg-gray-50 py-3 w-full self-start">
            <div class="mx-auto w-full">
              <div class="bg-white relative shadow-md sm:rounded-lg">
                <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div class="w-full md:w-1/2 justify-self-start">
                    {courses[0]?.user.role !== "stagiaire" && (
                      <div className="mycoursesLink w-full flex justify-start items-center px-4 text-blue-700 font-medium">
                        <Link
                          className=" flex items-center justify-center"
                          to="/mescours">
                          <p>Mes cours</p>
                          <MdKeyboardArrowRight className="flex justify-center items-center mt-[4%] text-lg" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto z-20">
                    {/* Filiere filter */}
                    <div className="relative group w-full h-full">
                      <button
                        onClick={() => {
                          setFiliereFilter(!filiereFilter);
                          setModuleFilter(false);
                        }}
                        id="actionsDropdownButton"
                        data-dropdown-toggle="actionsDropdown"
                        className="relative w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700     whitespace-nowrap"
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
                        {selectedFiliere}
                      </button>
                      {filiereFilter && (
                        <div
                          id="actionsDropdown"
                          className="z-20 w-44 bg-white rounded divide-y divide-gray-100 shadow absolute left-0 top-[100%]">
                          <ul
                            className="text-sm text-gray-700"
                            aria-labelledby="actionsDropdownButton">
                            <li
                              className="py-2 px-2 cursor-pointer hover:bg-slate-400 border-b border-gray-200 last:border-none"
                              onClick={() => filterByFiliere("Filiere")}>
                              All
                            </li>
                            {filieres.map((filiere, index) => {
                              return (
                                <>
                                  <li
                                    className="py-2 px-2 cursor-pointer hover:bg-slate-400 border-b border-gray-200 last:border-none"
                                    onClick={() => filterByFiliere(filiere)}>
                                    {filiere}
                                  </li>
                                </>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Module filter */}
                    <div className="group relative w-full h-full">
                      <button
                        onClick={() => {
                          setModuleFilter(!moduleFilter);
                          setFiliereFilter(false);
                        }}
                        id="actionsDropdownButton"
                        data-dropdown-toggle="actionsDropdown"
                        className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700     "
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
                        Module
                      </button>
                      {moduleFilter && (
                        <div
                          id="actionsDropdown"
                          className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow absolute left-0 top-[100%]">
                          <ul
                            className="py-1 text-sm text-gray-700"
                            aria-labelledby="actionsDropdownButton">
                            <li
                              className="py-2 px-2 cursor-pointer hover:bg-slate-400 border-b border-gray-200 last:border-none"
                              onClick={() => filterByModule("Module")}>
                              All
                            </li>
                            {modules.map((module, index) => {
                              return (
                                <li
                                  onClick={() => filterByModule(module)}
                                  key={index}
                                  className="block py-2 px-2 cursor-pointer hover:bg-slate-400 border-b border-gray-200 last:border-none">
                                  {module}
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
            </div>
          </section>

          <div className="justify-between w-full min-h-[10vh] relative">
            {filtredCourses?.length === 0 && (
              <p className="text-lg font-medium text-gray-600 text-center w-full absolute bottom-0 left-[-50%] translate-x-[50%] translate-y-[0%] whitespace-nowrap">
                Aucun cours trouver!
              </p>
            )}
            {filtredCourses?.length > 0 &&
              filtredCourses?.map((course, index) => {
                const { fichierSource } = course;
                const {
                  titre,
                  module: { name: subjectName },
                } = course;
                return (
                  <div class="py-2 px-4 mb-2 flex items-center gap-16 w-fit h-fit rounded shadow-md bg-white">
                    <dl className="w-fit">
                      <p class="text-xl mb-1 font-semibold leading-none text-gray-900 ">
                        {titre}
                      </p>
                      <p class="font-light mb-1 text-sm text-gray-500  whitespace-nowrap">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Ea, aliquid?
                      </p>
                      <dd class=" text-white rounded text-sm font-normal px-1.5 flex items-center justify-center bg-gray-500 w-fit">
                        {subjectName}
                      </dd>
                    </dl>

                    <a
                      href={`${api}/${fichierSource}`}
                      class="text-white gap-1 h-fit justify-center items-center inline-flex bg-teal-400 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                      <MdDownload className="" />

                      <p>Download</p>
                    </a>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
};
