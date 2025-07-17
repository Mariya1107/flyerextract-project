import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FlyersByStore = () => {
  const { storeName } = useParams();
  const [flyers, setFlyers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/flyers/store/${storeName}/`)
      .then((res) => res.json())
      .then((data) => setFlyers(data))
      .catch((err) => console.error('Error fetching flyers:', err));
  }, [storeName]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Flyers from {storeName}</h1>
      {flyers.length === 0 ? (
        <p>No flyers found for this store.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {flyers.map((flyer, index) => (
            <li key={index} className="bg-gray-100 rounded-lg p-4 shadow-md">
              <p className="font-semibold">Flyer ID: {flyer.id}</p>
              <a
                href={flyer.flyer_file}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Flyer
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlyersByStore;
