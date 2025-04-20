'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';

interface FavoriteLocationsProps {
  currentLocation: string | null;
  onLocationSelect: (location: string) => void;
}

export default function FavoriteLocations({ currentLocation, onLocationSelect }: FavoriteLocationsProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on component mount
    const savedFavorites = localStorage.getItem('favoriteLocations');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addToFavorites = () => {
    if (!currentLocation || favorites.includes(currentLocation)) return;
    
    const newFavorites = [...favorites, currentLocation];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteLocations', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (location: string) => {
    const newFavorites = favorites.filter(fav => fav !== location);
    setFavorites(newFavorites);
    localStorage.setItem('favoriteLocations', JSON.stringify(newFavorites));
  };

  const isCurrentLocationFavorite = Boolean(currentLocation && favorites.includes(currentLocation));

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8">
      {currentLocation && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addToFavorites}
          disabled={isCurrentLocationFavorite}
          className={`flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isCurrentLocationFavorite
              ? 'bg-yellow-100 text-yellow-600 cursor-default shadow-sm'
              : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:shadow-md'
          }`}
        >
          <FaStar className={`w-4 h-4 ${isCurrentLocationFavorite ? 'text-yellow-500' : 'text-blue-500'} mr-2`} />
          {isCurrentLocationFavorite ? 'Location Saved' : 'Save Current Location'}
        </motion.button>
      )}

      {favorites.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Favorite Locations</h3>
            <span className="text-sm text-gray-500">{favorites.length} saved</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favorites.map((location) => (
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-lg p-3 group hover:shadow-md transition-all ${
                  location === currentLocation ? 'ring-2 ring-blue-400 bg-blue-50/50' : ''
                }`}
              >
                <button
                  onClick={() => onLocationSelect(location)}
                  className="flex items-center flex-1 text-left"
                >
                  <FaMapMarkerAlt className={`w-4 h-4 mr-2 ${
                    location === currentLocation ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    location === currentLocation ? 'text-blue-600' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}>
                    {location}
                  </span>
                </button>
                <button
                  onClick={() => removeFromFavorites(location)}
                  className="text-gray-400 hover:text-red-500 p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-full"
                  title="Remove from favorites"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 