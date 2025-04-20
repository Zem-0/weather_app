'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { WeatherData } from '@/types/weather';
import { FaTemperatureHigh, FaWind, FaTint, FaCompass } from 'react-icons/fa';

export default function WeatherCard({ weatherData }: { weatherData: WeatherData }) {
  // Helper function to safely round numbers and handle undefined/null values
  const safeRound = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'N/A';
    }
    return Math.round(value).toString();
  };

  // Helper function to ensure URLs have https protocol
  const ensureHttps = (url: string): string => {
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 h-full flex flex-col"
    >
      <div className="flex-none">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{weatherData.location}</h2>
          <div className="flex items-center justify-center md:justify-start mt-4">
            <div className="relative">
              <Image
                src={ensureHttps(weatherData.icon)}
                alt={weatherData.condition}
                width={112}
                height={112}
                className="drop-shadow-lg"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                {weatherData.condition}
              </div>
            </div>
            <div className="ml-6">
              <p className="text-6xl font-bold text-gray-800 drop-shadow-sm flex items-baseline">
                <span>{safeRound(weatherData.temperature)}</span>
                <span className="ml-2">°C</span>
              </p>
              <p className="text-gray-600 capitalize mt-2 text-lg">{weatherData.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 flex-none">
          <div className="flex flex-col items-center bg-blue-500/10 p-4 rounded-xl hover:bg-blue-500/15 transition-colors">
            <FaTemperatureHigh className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Feels Like</p>
            <p className="font-semibold text-lg text-gray-800 flex items-baseline">
              <span>{safeRound(weatherData.feelsLike)}</span>
              <span className="ml-1">°C</span>
            </p>
          </div>
          <div className="flex flex-col items-center bg-blue-500/10 p-4 rounded-xl hover:bg-blue-500/15 transition-colors">
            <FaWind className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Wind</p>
            <p className="font-semibold text-lg text-gray-800 flex items-baseline">
              <span>{safeRound(weatherData.windSpeed)}</span>
              <span className="ml-1">km/h</span>
            </p>
          </div>
          <div className="flex flex-col items-center bg-blue-500/10 p-4 rounded-xl hover:bg-blue-500/15 transition-colors">
            <FaTint className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Humidity</p>
            <p className="font-semibold text-lg text-gray-800 flex items-baseline">
              <span>{safeRound(weatherData.humidity)}</span>
              <span className="ml-1">%</span>
            </p>
          </div>
          <div className="flex flex-col items-center bg-blue-500/10 p-4 rounded-xl hover:bg-blue-500/15 transition-colors">
            <FaCompass className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Pressure</p>
            <p className="font-semibold text-lg text-gray-800 flex items-baseline">
              <span>{safeRound(weatherData.pressure || 1013)}</span>
              <span className="ml-1">hPa</span>
            </p>
          </div>
        </div>
      </div>

      {weatherData.forecast && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">5-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-500/10 rounded-xl p-4 text-center hover:bg-blue-500/15 transition-colors flex flex-col items-center"
              >
                <p className="text-sm font-medium text-gray-600">{day.date}</p>
                <Image
                  src={ensureHttps(day.icon)}
                  alt={day.condition}
                  width={56}
                  height={56}
                  className="my-2 drop-shadow-md"
                />
                <p className="text-lg font-semibold text-gray-800">
                  {safeRound(day.temperature)}°C
                </p>
                <p className="text-sm text-gray-600">{day.condition}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
} 