export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const defaultTransforms = ['f_auto', 'q_auto'];
  if (options.width) defaultTransforms.push(`w_${options.width}`);
  if (options.crop) defaultTransforms.push(`c_${options.crop}`);
  
  const transformString = defaultTransforms.join(',');
  return url.replace('/upload/', `/upload/${transformString}/`);
};
