import React from "react";

const Buscador = ({ valor, setValor, placeholder }) => {
  return (
    <input
      type="text"
      value={valor}
      onChange={(e) => setValor(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default Buscador;
