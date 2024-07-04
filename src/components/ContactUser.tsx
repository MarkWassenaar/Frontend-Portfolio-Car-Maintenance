import React from "react";
import { Phone } from "lucide-react";

const ContactUser = ({ name, phone, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="flex flex-col bg-white p-6 rounded-lg w-1/2 justify-items-center">
        <h2 className="text-xl font-bold mb-4">Contact Owner</h2>
        <p>
          <strong>{name}</strong>
        </p>
        <p className="flex gap-3 pt-4">
          <Phone className=" text-green-500" /> {phone}
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUser;
