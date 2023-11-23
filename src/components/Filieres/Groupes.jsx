import React, { useState } from "react";
import { Groupe } from "./Groupe";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/slices/loadingSlice";
import UpdateGroupe from "./updateGroupe";

export const Groupes = ({ groupes, handleGroupeEdit, fetchFilieres }) => {
  const api = window.env.API_URI;

  const dispatch = useDispatch();

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 relative border min-h-fit">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50  sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3 text-center">
              Nom
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Nombre de stagiaires
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {groupes?.map((groupe, index) => {
            return (
              <Groupe groupe={groupe} handleGroupeEdit={handleGroupeEdit} />
            );
          })}
        </tbody>
      </table>
    </>
  );
};
