import {apiPost} from './api';
import {auth_header, url_back} from './backConfigs';
import {Routes_Back} from './enums/Routes';

export const validateToken = async (token: string | null) => {
  if (!token) return false;
  const {data} = await apiPost(
    `${url_back}${Routes_Back.AUTH.INDEX}${Routes_Back.AUTH.VALIDATE_TOKEN}`,
    null,
    auth_header({aut_token: token})
  );
  if (data) {
    return true;
  } else {
    return false;
  }
};
