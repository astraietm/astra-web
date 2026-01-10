export const getOptimizedImageUrl = (url, type = 'grid') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Split at /upload/ to inject params
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  let params = 'f_auto,q_auto'; // Base optimizations
  
  if (type === 'grid') {
      params += ',w_600,c_fill'; // Grid: smaller, fixed aspect ratio
  } else if (type === 'modal') {
      params += ',w_1600,c_limit'; // Modal: high quality, no upscaling
  } else if (type === 'thumb') {
      params += ',w_200,c_fill'; // Tiny thumbnail
  }

  return `${parts[0]}/upload/${params}/${parts[1]}`;
};
