import { MdKeyboardArrowRight } from "react-icons/md";
import { Groupes } from "./Groupes";

export const Groupe = ({ groupe, handleGroupeEdit }) => {
  console.log(groupe?.stagiaires.length);
  return (
    <tr className="border-b w-full">
      <td className="px-4 py-3 font-medium">
        <div className="flex items-center justify-center">{groupe.name}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center text-center">
          {groupe?.stagiaires.length}
        </div>
      </td>
      <td className="px-4 py-3 w-full flex items-center justify-end self-end col-span-4">
        <button
          onClick={() => handleGroupeEdit(groupe)}
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
          <span class="tooltiptext text-sm font-normal hidden group-hover:block absolute left-[100%] z-20 text-center px-2 py-1 bg-gray-300 w-fit whitespace-nowrap rounded after:content-[' '] after:absolute after:right-[100%] after:top-[50%] after:translate-y-[-50%] after:border-[5px] after:border-transparent after:border-r-gray-300  ">
            Modifier
          </span>
        </button>
      </td>
    </tr>
  );
};
