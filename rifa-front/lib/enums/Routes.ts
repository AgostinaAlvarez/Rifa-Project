export const Routes = {
  PROFILE: {
    INDEX: '/profile',
    EDIT: '/edit',
    UPDATE_PASSWORD: '/update-password',
  },
  DASHBOARD: {
    INDEX: '/dashboard',
  },
  COMPLETE_PROFILE: {
    INDEX: '/complete-profile',
  },
  FORGOT_PASSWORD: {
    INDEX: '/forgot-password',
  },
  PASSWORD_RESET: {
    INDEX: '/password-reset',
  },
  PLANS: {
    INDEX: '/plans',
  },
  PRE_SIGNUP: {
    INDEX: '/pre-signup',
  },
  SIGN_IN: {
    INDEX: '/signin',
  },
};

export const Routes_Back = {
  EMAILS: {
    INDEX: '/emails',
  },
  AUTH: {
    INDEX: '/auth',
    SIGNIN: '/signin',
    LOGOUT: '/logout',
    VALIDATE_TOKEN: '/validate-token',
  },
  USERS: {
    INDEX: '/user',
    PRE_SIGNUP: '/pre-signup',
    CONFIRM_EMAIL: '/confirm-email',
    SIGNUP: '/signup',
    PASSWORD_RECOVERY: '/password-recovery',
    PASSWORD_RESET: '/password-reset',
    EVENTS_MERCADOPAGO: '/events_mercadopago',
    CANCEL_SUBSCRIPTION: '/cancel-subscription',
    PAUSE_SUBSCRIPTION: '/pause-subscription',
    PROFILE_PICTURE: '/profile-picture',
    PASSWORD_CHANGE: '/password-change',
    EDIT_PROFILE: '/profile',
  },
  PLANS: {
    INDEX: '/plans',
    CREATE_SUSCRIPTION: '/create-suscription',
  },
};
