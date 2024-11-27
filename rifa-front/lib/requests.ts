import {getRequest} from './api';

export const getStrapiData = async (param: string) => {
  const result = await getRequest(param, {populate: 'deep'});
  if (!result.success) return null;
  return result.data;
};
