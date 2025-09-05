import React from "react";

const Files = ({ files }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Files</h3>
      <ul className="space-y-2">
        {files.map((file, idx) => (
          <li key={idx} className="border-b pb-1">{file}</li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
