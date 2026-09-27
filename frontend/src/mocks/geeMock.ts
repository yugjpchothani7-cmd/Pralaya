// Mock for GEE (Google Earth Engine) API
export const getGEEData = async (
  regionId: string,
  options: { fail?: boolean; timeout?: number } = {}
) => {
  if (options.fail) {
    throw new Error('GEE API unavailable');
  }
  if (options.timeout) {
    await new Promise(res => setTimeout(res, options.timeout));
    throw new Error('GEE API timeout');
  }
  // Deterministic mock data
  return {
    regionId,
    elevationMean: 150,
    landCover: 'urban',
  };
};
