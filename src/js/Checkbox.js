import React from 'react'

function Checkbox({ field, type, checked }) {
  return (
      <input {...field} className="form-radio" type={type} checked={checked} />
  );
}

export default Checkbox