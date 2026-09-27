// Mock for Weather API
export const getWeather = async (
  location: string,
  options: { fail?: boolean; timeout?: number } = {}
) => {
  if (options.fail) {
    throw new Error('Weather API unavailable');
  }
  if (options.timeout) {
    await new Promise(res => setTimeout(res, options.timeout));
    throw new Error('Weather API timeout');
  }
  // Deterministic data for testing
  return {
    location,
    precipitation: 120, // mm
    windSpeed: 15, // m/s
    temperature: 28,
  };
};
