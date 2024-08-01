import React from "react";
import toyo from "../../src/assets/toyo.jfif";
import suka from "../../src/assets/suka.jpg";

const ItemsList = ({ products }) => {
  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <div className="mt-2">
        {products.map((product) => (
          <div key={product._id} className="mb-2">
            <div className="border-2 rounded-md flex gap-2 p-2">
              <div>
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-14 w-14 object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p>PHP {product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
