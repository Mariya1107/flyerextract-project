// src/pages/StoreFlyerList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const StoreFlyerList = () => {
  const { storeId } = useParams();
  const [flyers, setFlyers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/flyers/?store=${storeId}`)
      .then((res) => setFlyers(res.data))
      .catch((err) => console.error('Error fetching flyers for store:', err));
  }, [storeId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Flyers</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flyers.map(flyer => (
          <div
            key={flyer.id}
            className="border rounded-lg shadow hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/flyer/${flyer.id}`)}
          >
            <img
              src={flyer.image.startsWith('http') ? flyer.image : `${BASE_URL}${flyer.image}`}
              alt={flyer.name}
              className="w-full h-40 object-cover rounded-t"
            />
            <div className="p-2">
              <p className="font-semibold">{flyer.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreFlyerList;
