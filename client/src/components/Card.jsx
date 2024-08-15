import React from "react";

const Card = ({ storeName, products }) => {
  return (
    <div>
      <h2>{storeName}</h2>
      <p>{products}</p>
    </div>
  );
};

export default Card;
