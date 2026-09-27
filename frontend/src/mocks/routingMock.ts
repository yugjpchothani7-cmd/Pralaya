export const getRoute = async (origin: string, destination: string, options: { fail?: boolean; timeout?: number } = {}) => {
  if (options.fail) {
    throw new Error('Routing API unavailable');
  }
  if (options.timeout) {
    await new Promise(res => setTimeout(res, options.timeout));
    throw new Error('Routing API timeout');
  }
  // deterministic mock route
  return { distanceKm: 50, durationMin: 45 };
};
