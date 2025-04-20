'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import WeatherCard from '@/components/WeatherCard';
import SearchBar from '@/components/SearchBar';
import ActivitySuggestions from '@/components/ActivitySuggestions';
import FavoriteLocations from '@/components/FavoriteLocations';
import { WeatherData } from '@/types/weather';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }
      
      setWeatherData(data);
      toast.success('Weather data updated successfully!', {
        duration: 3000,
        position: 'top-center',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.error || 'Failed to fetch weather data');
            }
            
            setWeatherData(data);
            toast.success('Weather data updated successfully!', {
              duration: 3000,
              position: 'top-center',
            });
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            toast.error(errorMessage, {
              duration: 5000,
              position: 'top-center',
            });
          }
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please enable location services or search for a location manually.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try searching for a location manually.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again or search for a location manually.';
              break;
            default:
              errorMessage = 'An error occurred while getting your location. Please search for a location manually.';
          }
          
          toast.error(errorMessage, {
            duration: 5000,
            position: 'top-center',
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser. Please search for a location manually.', {
        duration: 5000,
        position: 'top-center',
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative min-h-screen backdrop-blur-sm py-8 px-4 md:px-8">
        <Toaster position="top-right" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Weather Activity Suggester
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow">
              Discover the perfect activities based on your local weather conditions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <SearchBar onSearch={handleSearch} loading={loading} />
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 max-w-2xl mx-auto shadow-lg"
            >
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {weatherData && (
            <div className="relative min-h-[800px]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 absolute inset-0">
                {/* Left Column - Favorites and Activities */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex-none"
                  >
                    <FavoriteLocations
                      currentLocation={weatherData?.location || null}
                      onLocationSelect={handleSearch}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex-1"
                  >
                    <ActivitySuggestions weatherData={weatherData} />
                  </motion.div>
                </div>

                {/* Right Column - Weather Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="lg:col-span-7 h-full"
                >
                  <div className="h-full">
                    <WeatherCard weatherData={weatherData} />
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {!weatherData && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">How to Get Started</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50/80 p-6 rounded-lg shadow-md">
                    <h3 className="font-medium text-blue-700 mb-3 text-lg">1. Allow Location Access</h3>
                    <p className="text-gray-600">We&apos;ll automatically detect your location to show local weather and activities.</p>
                  </div>
                  <div className="bg-purple-50/80 p-6 rounded-lg shadow-md">
                    <h3 className="font-medium text-purple-700 mb-3 text-lg">2. Or Search Manually</h3>
                    <p className="text-gray-600">Enter any city name or zip code to get weather and activity suggestions.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
