import { Sidebar } from "flowbite-react";
import { useEffect } from "react";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import {
  MdPerson,
  MdGrade,
  MdFilePresent,
  MdGroups2,
  MdPerson4,
  MdHub,
  MdLibraryBooks,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setLoading } from "../../store/slices/loadingSlice";

const SideBar = () => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(true);
  const [user, setUser] = useState();
  const [selected, setSelected] = useState("/stagiaires");

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    {
      res.payload?.role !== "surveillant" && setSelected("/profile");
    }
    setUser(res.payload);
  };

  const handleLogout = async () => {
    dispatch(setLoading());
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    if (res.status === "ok") {
      localStorage.removeItem("token");

      return window.location.replace("http://localhost:3000");
    }
  };

  useEffect(() => {
    if (firstLoad) {
      fetchUser();
      setFirstLoad(false);

      if (user?.role !== "surveillant") {
        return setSelected(
          window.location.pathname !== "/"
            ? window.location.pathname
            : "/profile"
        );
      }
      return setSelected(
        window.location.pathname !== "/"
          ? window.location.pathname
          : "/stagiaires"
      );
    }
  }, [selected]);

  return (
    <>
      {user && (
        <Sidebar className="h-full border-r border-gray-300">
          <Sidebar.Items className="h-full flex flex-col justify-between">
            <Sidebar.ItemGroup>
              <Sidebar.Logo
                className="flex items-center"
                href="#"
                img="/ofppt.png"
                imgAlt="Flowbite logo">
                <p className="text-lg ">E-OFPPT</p>
              </Sidebar.Logo>
              <div className="flex flex-col gap-4">
                {user?.role !== "surveillant" && (
                  <Sidebar.Item
                    icon={MdPerson}
                    className={selected === "/profile" && "bg-zinc-300"}
                    onClick={() => setSelected("/profile")}>
                    <Link to={`/profile`} className="font-medium">
                      Profile
                    </Link>
                  </Sidebar.Item>
                )}
                {user?.role === "surveillant" && (
                  <>
                    <Sidebar.Item
                      icon={MdGroups2}
                      className={selected === "/stagiaires" && "bg-zinc-300"}
                      onClick={() => setSelected("/stagiaires")}>
                      <Link to={`/stagiaires`} className="font-medium">
                        Stagiaires
                      </Link>
                    </Sidebar.Item>
                    <Sidebar.Item
                      icon={MdPerson4}
                      className={selected === "/formateurs" && "bg-zinc-300"}
                      onClick={() => setSelected("/formateurs")}>
                      <Link to={`/formateurs`} className="font-medium">
                        Formateurs
                      </Link>
                    </Sidebar.Item>
                    <Sidebar.Item
                      icon={MdHub}
                      className={selected === "/filieres" && "bg-zinc-300"}
                      onClick={() => setSelected("/filieres")}>
                      <Link to={`/filieres`} className="font-medium">
                        Filieres/Groupes
                      </Link>
                    </Sidebar.Item>
                    <Sidebar.Item
                      icon={MdLibraryBooks}
                      className={selected === "/modules" && "bg-zinc-300"}
                      onClick={() => setSelected("/modules")}>
                      <Link to={`/modules`} className="font-medium">
                        Modules
                      </Link>
                    </Sidebar.Item>
                  </>
                )}
                <Sidebar.Item
                  icon={MdGrade}
                  className={selected === "/notes" && "bg-zinc-300"}
                  onClick={() => setSelected("/notes")}>
                  <Link to={`/notes`} className="font-medium">
                    Notes
                  </Link>
                </Sidebar.Item>
                <Sidebar.Item
                  icon={MdFilePresent}
                  className={
                    (selected === "/cours" || selected === "/mescours") &&
                    "bg-zinc-300"
                  }
                  onClick={() => setSelected("/cours")}>
                  <Link to={`/cours`} className="font-medium">
                    Cours
                  </Link>
                </Sidebar.Item>
              </div>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item icon={AiOutlineUser}>
                <p className="cursor-pointer" onClick={handleLogout}>
                  Déconnecter
                </p>
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      )}
    </>
  );
};

export default SideBar;
