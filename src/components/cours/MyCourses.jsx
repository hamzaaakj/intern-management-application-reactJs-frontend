import { useEffect, useState } from "react";
import {
  MdDownload,
  MdAddBox,
  MdDeleteForever,
  MdKeyboardArrowRight,
} from "react-icons/md";
import AddNew from "./AddNew";
import { Link, useNavigate } from "react-router-dom";
import { setLoading, unsetLoading } from "../../store/slices/loadingSlice";
import { useDispatch } from "react-redux";

export default () => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(true);
  const [addForm, setAddForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filtredCourses, setFiltredCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    dispatch(setLoading());

    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/mycourses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await req.json();
    setCourses(res.cours);
    setFiltredCourses(res.cours);
    if (res?.cours[0]?.user.role === "stagiaire") {
      return navigate(-1);
    }
    return dispatch(unsetLoading());
  };

  const handleDelete = async (key) => {
    dispatch(setLoading());

    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/mycourses/${key}`, {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await req.json();
    fetchCourses();
    return dispatch(unsetLoading());
  };

  useEffect(() => {
    if (firstLoad) {
      fetchCourses();
      setFirstLoad(false);
    }
  }, [filtredCourses, addForm]);

  return (
    <>
      {courses[0]?.user.role !== "stagiaire" && (
        <AddNew
          addForm={addForm}
          setAddForm={setAddForm}
          fetchCourses={fetchCourses}
        />
      )}
      <section class="bg-gray-50 w-screen h-screen p-3 overflow-hidden">
        <div className="wrapper h-full mx-auto max-w-screen-lg px-4 lg:px-12 translate-y-[5vh]">
          <section class="bg-gray-50 py-3 w-full self-start">
            <div class="mx-auto w-full">
              <div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div class="w-full md:w-1/2 justify-self-start">
                    {courses[0]?.user.role !== "stagiaire" && (
                      <div className="mycoursesLink w-full flex items-center px-4 text-blue-700 font-medium">
                        <Link
                          className=" flex items-center justify-center"
                          to="/cours">
                          <p>Tous les cours</p>
                          <MdKeyboardArrowRight className="flex justify-center items-center text-lg mt-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button
                      class="text-white gap-1 h-fit justify-center items-center inline-flex bg-green-500 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      onClick={() => setAddForm(true)}>
                      <MdAddBox className="" />

                      <p>Ajouter</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="wrap relative flex justify-between flex-wrap gap-6 min-h-[5vh]">
            {filtredCourses?.length === 0 && (
              <p className="text-lg font-medium text-gray-600 text-center w-full absolute bottom-0 left-[-50%] translate-x-[50%] translate-y-[0%] whitespace-nowrap">
                Aucun cours trouver!
              </p>
            )}
            {filtredCourses?.length > 0 &&
              filtredCourses.map((course, index) => {
                const { fichierSource } = course;

                const {
                  id,
                  titre,
                  module: { name: subjectName },
                } = course;
                return (
                  <div class="py-2 px-4 mb-2 flex items-center gap-12 w-fit h-fit rounded shadow-md bg-white">
                    <dl className="w-fit">
                      <p class="text-xl mb-1 font-semibold leading-none text-gray-900">
                        {titre}
                      </p>
                      <p class="font-light mb-1 text-sm text-gray-500 whitespace-nowrap">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Ea, aliquid?
                      </p>
                      <dd class=" text-white rounded text-sm font-normal px-1.5 flex items-center justify-center bg-gray-500 w-fit">
                        {subjectName}
                      </dd>
                    </dl>

                    <div className="wrap flex gap-3">
                      <button
                        class="text-white gap-1 h-fit justify-center items-center inline-flex bg-red-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                        onClick={() => handleDelete(id)}>
                        <MdDeleteForever className="" />
                        <p>Suprimer</p>
                      </button>
                      <a
                        class="text-white gap-1 h-fit justify-center items-center inline-flex bg-teal-400 hover:bg-primary-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                        href={`${api}/${fichierSource}`}>
                        <MdDownload className="" />
                        <p>Download</p>
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
};
