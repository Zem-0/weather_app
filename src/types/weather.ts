export type WeatherData = {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  icon: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
  forecast?: {
    date: string;
    temperature: number;
    condition: string;
    icon: string;
  }[];
};

export interface ActivitySuggestion {
  title: string;
  description: string;
  icon: string;
  weatherCondition: string;
} 