import React from "react";

export default function FormTextarea({ name, label, value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        className="form-control"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
