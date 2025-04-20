import { NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

interface WeatherApiError {
  code: number;
  message: string;
}

interface WeatherApiResponse {
  error?: WeatherApiError;
  location?: {
    name: string;
    country: string;
  };
  current?: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    feelslike_c: number;
    wind_kph: number;
    humidity: number;
    pressure_mb: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!WEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'Weather API key is not configured' },
      { status: 500 }
    );
  }

  try {
    let url;
    if (location) {
      url = `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=5&aqi=no&alerts=no`;
    } else if (lat && lon) {
      url = `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=5&aqi=no&alerts=no`;
    } else {
      return NextResponse.json(
        { error: 'Location or coordinates are required' },
        { status: 400 }
      );
    }

    const response = await fetch(url);
    const data: WeatherApiResponse = await response.json();

    if (!response.ok || data.error) {
      let errorMessage = 'Failed to fetch weather data';
      if (data.error?.code === 1006) {
        errorMessage = 'Location not found. Please check the city name or zip code.';
      } else if (data.error?.message) {
        errorMessage = data.error.message;
      }
      throw new Error(errorMessage);
    }

    if (!data.current || !data.location || !data.forecast) {
      return NextResponse.json({ error: 'Invalid response from weather API' }, { status: 500 });
    }

    // Process the weather data
    const current = data.current;
    const locationData = data.location;
    const forecastDays = data.forecast.forecastday;

    return NextResponse.json({
      location: locationData.name,
      temperature: current.temp_c,
      condition: current.condition.text,
      icon: current.condition.icon,
      humidity: current.humidity,
      windSpeed: current.wind_kph,
      description: current.condition.text,
      feelsLike: current.feelslike_c,
      pressure: current.pressure_mb,
      forecast: forecastDays.map((day) => ({
        date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        temperature: day.day.avgtemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
      })),
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}