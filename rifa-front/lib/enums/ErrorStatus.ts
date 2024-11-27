export const ErrorStatus: {[key: string]: any} = {
  NOT_FOUND: {
    type: 404,
    title: 'El recurso no fue encontrado',
    message: 'Intentalo de nuevo mas tarde',
  },
  PAGE_NOT_FOUND: {
    type: 404,
    title: 'El recurso no fue encontrado',
    message: 'El recurso no fue encontrado',
  },
  INTERNAL_SERVER_ERROR: {
    type: 500,
    title: 'Error interno del servidor',
    message: 'Intentalo de nuevo mas tarde',
  },
  BAD_REQUEST: {
    type: 400,
    message: 'Solicitud incorrecta',
  },
  UNAUTHORIZED: {
    type: 401,
    title: 'No autorizado',
  },
  FORBIDDEN: {
    type: 403,
    title: 'Acceso denegado',
  },
  EMAIL_EXIST: {
    type: 409,
    title: '¡El email ya existe!',
    message: 'Debe ingresar un email que no se encuentre registrado',
    context: 'authCardSignup',
  },
  CONFLICT: {
    type: 409,
    title: 'Conflicto en la solicitud',
  },
  RECAPTCHA_FAILED: {
    type: 406,
    title: 'ReCaptcha fallido',
    message: 'Por favor, inténtalo de nuevo',
    context: 'recaptcha',
  },
  INCOMPLETE_DATA: {
    type: 409,
    title: 'Debes rellenar tu info',
    context: 'authCardSignin',
  },
};
