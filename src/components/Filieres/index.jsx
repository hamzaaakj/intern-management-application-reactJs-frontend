import { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import UniqueArray from "../../utils/UniqueArray";
import { useDispatch } from "react-redux";
import { setLoading, unsetLoading } from "../../store/slices/loadingSlice";
import { Filiere } from "./Filiere";
import Update from "./update";
import UpdateGroupe from "./updateGroupe";
import AddNewFiliere from "./AddNewFiliere";
import AddNewGroupe from "./AddNewGroupe";

const Notes = () => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(true);

  const [filiereToEdit, setfiliereToEdit] = useState();
  const [updateForm, setUpdateForm] = useState();
  const [groupeToEdit, setGroupeToEdit] = useState();
  const [groupeUpdateForm, setGroupeUpdateForm] = useState(false);

  const [addFiliereForm, setAddFiliereForm] = useState(false);
  const [addGroupeForm, setAddGroupeForm] = useState(false);

  const [filiereFilter, setFiliereFilter] = useState(false);
  const [groupeFilter, setGroupeFilter] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState("Filiere");
  const [selectedGroupe, setSelectedGroupe] = useState("Groupe");
  const [filieres, setFilieres] = useState([]);
  const [groupes, setGroupes] = useState([]);

  const fetchFilieres = async () => {
    dispatch(setLoading());
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

  const handleEdit = (filiere) => {
    setfiliereToEdit(filiere);
    return setUpdateForm(true);
  };

  const handleUpdate = async (name) => {
    dispatch(setLoading());
    setUpdateForm(false);

    const token = localStorage.getItem("token");

    let form = new FormData();
    form.append("name", name);

    const req = await fetch(`${api}/filieres/${filiereToEdit.id}`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const res = await req.json();
    console.log(res);
    return fetchFilieres();
  };

  const handleDelete = async () => {
    dispatch(setLoading());
    setUpdateForm(false);

    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/filieres/${filiereToEdit.id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    setAddFiliereForm(false);
    return fetchFilieres();
  };

  // Groupe Functions ---------------------
  const handleGroupeEdit = (groupe) => {
    console.log(groupe);
    setGroupeToEdit(groupe);
    return setGroupeUpdateForm(true);
  };

  const handleGroupeUpdate = async (name) => {
    dispatch(setLoading());
    setGroupeUpdateForm(false);

    const token = localStorage.getItem("token");

    let form = new FormData();
    form.append("name", name);

    const req = await fetch(`${api}/groupes/${groupeToEdit.id}`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const res = await req.json();
    return fetchFilieres();
  };

  const handleGroupeDelete = async () => {
    dispatch(setLoading());
    setUpdateForm(false);

    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/groupes/${groupeToEdit.id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    setGroupeUpdateForm(false);
    return fetchFilieres();
  };

  useEffect(() => {
    if (firstLoad) {
      fetchFilieres();
      setFirstLoad(false);
    }
  }, []);

  return (
    <>
      {addFiliereForm && (
        <AddNewFiliere
          addFiliereForm={addFiliereForm}
          setAddFiliereForm={setAddFiliereForm}
          fetchFilieres={fetchFilieres}
        />
      )}
      {addGroupeForm && (
        <AddNewGroupe
          addGroupeForm={addGroupeForm}
          setAddGroupeForm={setAddGroupeForm}
          fetchFilieres={fetchFilieres}
        />
      )}
      {updateForm && (
        <Update
          filiereToEdit={filiereToEdit}
          updateForm={updateForm}
          setUpdateForm={setUpdateForm}
          handleEdit={handleEdit}
          handleUpdate={handleUpdate}
          setfiliereToEdit={setFiliereFilter}
          handleDelete={handleDelete}
        />
      )}
      {groupeUpdateForm && (
        <UpdateGroupe
          groupeToEdit={groupeToEdit}
          groupeUpdateForm={updateForm}
          setGroupeUpdateForm={setGroupeUpdateForm}
          handleGroupeEdit={handleGroupeEdit}
          handleGroupeUpdate={handleGroupeUpdate}
          handleGroupeDelete={handleGroupeDelete}
          setGroupeToEdit={setGroupeFilter}
        />
      )}
      <section className="bg-gray-50  p-3 w-full h-full">
        <div className="mx-auto translate-y-[5vh] max-w-screen-lg px-4 lg:px-12">
          <div className="bg-white relative shadow-md sm:rounded-lg">
            <div className="">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full flex justify-between items-center">
                  <p className=" whitespace-nowrap text-lg font-medium italic">
                    Gérer Les Filieres / Groupes
                  </p>
                  <div className="w-full flex gap-4 items-center justify-end ">
                    <div class="w-full md:w-auto flex justify-end">
                      <button
                        class="text-white gap-1 h-fit justify-center items-center inline-flex bg-green-500 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={() => setAddFiliereForm(true)}>
                        <MdAddBox className="" />

                        <p>Nouvelle filiere</p>
                      </button>
                    </div>
                    <div class="w-full md:w-auto flex justify-end">
                      <button
                        class="text-white gap-1 h-fit justify-center items-center inline-flex bg-green-500 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={() => setAddGroupeForm(true)}>
                        <MdAddBox className="" />

                        <p>Nouveau groupe</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/*Table-----------------------------*/}
              <div className="scroll w-full max-h-[75vh] overflow-y-auto overflow-x-hidden">
                <table className="w-full text-sm text-left text-gray-500 relative border min-h-fit">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50  sticky top-0">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-start">
                        Nom Filiere
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="w-full">
                    {filieres?.map((filiere, index) => {
                      return (
                        <>
                          <Filiere
                            updateForm={updateForm}
                            setUpdateForm={setUpdateForm}
                            key={index}
                            filiere={filiere}
                            fetchFilieres={fetchFilieres}
                            handleEdit={handleEdit}
                            handleGroupeEdit={handleGroupeEdit}
                            handleGroupeUpdate={handleGroupeUpdate}
                          />
                        </>
                      );
                    })}
                  </tbody>
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
