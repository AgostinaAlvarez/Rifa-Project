import {Colors} from '@/lib/enums/Colors';

export const Icons = {
  CHECKMARK: (
    <svg
      width="133"
      height="130"
      viewBox="0 0 211 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M175.833 52.75L79.1251 148.542L35.1667 105"
        stroke={Colors.PRINCIPAL_COLOR}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ERROR: (
    <svg
      width="133"
      height="139"
      viewBox="0 0 211 209"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M158.25 52.25L52.75 156.75M52.75 52.25L158.25 156.75"
        stroke={Colors.RED}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
