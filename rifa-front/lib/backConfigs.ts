export const url_back = `${process.env.NEXT_PUBLIC_BACK_URL}/${process.env.NEXT_PUBLIC_PATH_VERSION_BACK}`;

export const auth_header = ({aut_token}: any) => {
  return {
    accept: 'application/json',
    Authorization: `Bearer ${aut_token}`,
  };
};
export const general_header = {
  accept: 'application/json',
};
