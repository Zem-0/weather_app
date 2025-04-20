'use client';

import { motion } from 'framer-motion';
import { WeatherData } from '@/types/weather';
import { FaUmbrellaBeach, FaSnowman, FaPalette, FaShare, FaHiking, FaSwimmingPool, FaCoffee, FaUmbrella, FaWind, FaGamepad, FaSun, FaCloud } from 'react-icons/fa';

const getActivitySuggestions = (weatherData: WeatherData) => {
  const temperature = weatherData.temperature;
  const description = weatherData.description.toLowerCase();
  const windSpeed = weatherData.windSpeed;

  // Check for severe weather conditions first
  if (description.includes('thunderstorm') || description.includes('storm')) {
    return {
      icon: <FaGamepad className="w-12 h-12 text-purple-500" />,
      title: 'Indoor Safety',
      description: 'Stay safe indoors during the storm!',
      activities: ['Video games', 'Board games', 'Movie marathon', 'Indoor exercises']
    };
  }

  if (description.includes('rain') || description.includes('drizzle')) {
    return {
      icon: <FaUmbrella className="w-12 h-12 text-blue-500" />,
      title: 'Rainy Day Activities',
      description: 'Enjoy these cozy indoor activities while it rains!',
      activities: ['Read a book', 'Watch movies', 'Cook comfort food', 'Visit a museum']
    };
  }

  if (description.includes('snow') || description.includes('blizzard')) {
    return {
      icon: <FaSnowman className="w-12 h-12 text-blue-300" />,
      title: 'Winter Wonderland',
      description: 'Make the most of the snowy weather!',
      activities: ['Build a snowman', 'Sledding', 'Hot chocolate', 'Snow photography']
    };
  }

  // Temperature-based suggestions
  if (temperature >= 35) {
    return {
      icon: <FaSwimmingPool className="w-12 h-12 text-blue-400" />,
      title: 'Beat the Extreme Heat',
      description: 'Stay cool and hydrated!',
      activities: ['Indoor pool', 'Visit mall', 'Ice cream break', 'Water park']
    };
  }

  if (temperature >= 28 && temperature < 35) {
    if (description.includes('clear') || description.includes('sun')) {
      return {
        icon: <FaUmbrellaBeach className="w-12 h-12 text-yellow-500" />,
        title: 'Beach & Water Fun',
        description: 'Perfect weather for water activities!',
        activities: ['Beach visit', 'Swimming', 'Water sports', 'Ice cream']
      };
    }
  }

  if (temperature >= 20 && temperature < 28) {
    if (description.includes('clear') || description.includes('sun')) {
      return {
        icon: <FaHiking className="w-12 h-12 text-green-500" />,
        title: 'Outdoor Adventure',
        description: 'Ideal weather for outdoor activities!',
        activities: ['Hiking', 'Cycling', 'Picnic', 'Sports']
      };
    }
  }

  if (temperature >= 15 && temperature < 20) {
    return {
      icon: <FaSun className="w-12 h-12 text-orange-500" />,
      title: 'Mild Weather Fun',
      description: 'Great temperature for various activities!',
      activities: ['City walk', 'Photography', 'Café visit', 'Shopping']
    };
  }

  if (temperature < 15 && temperature >= 5) {
    return {
      icon: <FaCoffee className="w-12 h-12 text-brown-500" />,
      title: 'Cool Weather Activities',
      description: 'Enjoy these comfortable indoor/outdoor activities!',
      activities: ['Coffee shop', 'Museum visit', 'Shopping', 'Indoor sports']
    };
  }

  if (temperature < 5) {
    return {
      icon: <FaSnowman className="w-12 h-12 text-blue-300" />,
      title: 'Cold Weather Activities',
      description: 'Stay warm with these activities!',
      activities: ['Indoor sports', 'Hot drinks', 'Movie theater', 'Indoor games']
    };
  }

  // Special conditions
  if (windSpeed > 20) {
    return {
      icon: <FaWind className="w-12 h-12 text-gray-400" />,
      title: 'Windy Day Activities',
      description: 'Choose sheltered activities on this windy day!',
      activities: ['Indoor café', 'Shopping mall', 'Museum visit', 'Cinema']
    };
  }

  if (description.includes('cloud') || description.includes('overcast')) {
    return {
      icon: <FaCloud className="w-12 h-12 text-gray-500" />,
      title: 'Cloudy Day Activities',
      description: 'Perfect for these engaging activities!',
      activities: ['Art gallery', 'Indoor market', 'Café hopping', 'Shopping']
    };
  }

  // Default suggestion for other conditions
  return {
    icon: <FaPalette className="w-12 h-12 text-indigo-500" />,
    title: 'General Activities',
    description: 'Enjoy these versatile activities!',
    activities: ['City exploration', 'Photography', 'Café visit', 'Shopping']
  };
};

export default function ActivitySuggestions({ weatherData }: { weatherData: WeatherData }) {
  const suggestion = getActivitySuggestions(weatherData);

  const handleShare = () => {
    const text = `Current weather in ${weatherData.location}: ${weatherData.temperature}°C, ${weatherData.description}. Suggested activity: ${suggestion.title} - ${suggestion.description}`;
    if (navigator.share) {
      navigator.share({
        title: 'Weather Activity Suggestion',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Activity suggestion copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8 flex-none">
        <h3 className="text-2xl font-bold text-gray-800">Suggested Activity</h3>
        <button
          onClick={handleShare}
          className="p-3 rounded-full hover:bg-blue-500/10 transition-colors"
          title="Share activity suggestion"
        >
          <FaShare className="w-5 h-5 text-blue-500" />
        </button>
      </div>

      <div className="flex flex-col items-center text-center mb-8 flex-none">
        <div className="mb-6 bg-blue-500/10 p-6 rounded-full">
          {suggestion.icon}
        </div>
        <h4 className="text-2xl font-semibold text-gray-800 mb-3">{suggestion.title}</h4>
        <p className="text-gray-600 text-lg mb-6">{suggestion.description}</p>
      </div>

      <div className="flex-1">
        <h5 className="font-medium text-gray-800 text-xl mb-4">Suggested Activities:</h5>
        <div className="grid grid-cols-2 gap-3">
          {suggestion.activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-blue-500/10 text-blue-800 px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-500/15 transition-colors cursor-default"
            >
              {activity}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 