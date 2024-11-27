import {errorsMessage} from './ErrorsMsg';
import {checkRut} from 'react-rut-formatter';

export const validationRules = {
  email: {
    required: errorsMessage.REQUIRED,
    pattern: {
      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      message: errorsMessage.INVALID_EMAIL,
    },
  },
  confirmEmail: (emailValue: any) => ({
    required: errorsMessage.REQUIRED,
    validate: (value: any) => value === emailValue || errorsMessage.EMAILS_DO_NOT_MATCH,
  }),
  fullName: {
    required: errorsMessage.REQUIRED,
    minLength: {
      value: 2,
      message: errorsMessage.INVALID_NAME,
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/,
      message: errorsMessage.ONLY_LETTERS,
    },
  },
  confirmField: (compareValue: any, type?: any) => ({
    required: errorsMessage.REQUIRED,
    validate: (value: any) =>
      value === compareValue ||
      (type === 'email' ? errorsMessage.EMAILS_DO_NOT_MATCH : errorsMessage.PASSWORD_DO_NOT_MATCH),
  }),
  rut: {
    required: errorsMessage.REQUIRED,
    validate: (value: string | null) => checkRut(value) || errorsMessage.INVALID_RUT,
  },
  birthday: {
    required: errorsMessage.REQUIRED,
  },
  phone: {
    required: errorsMessage.REQUIRED,
    pattern: {
      value: /^(?:\+56|56)?\s?(?:9)[\d\s-]{8}$/,
      message: errorsMessage.INVALID_PHONE,
    },
  },
  password: {
    required: errorsMessage.REQUIRED,
    validate: {
      minLength: (value: string | any[]) => value.length >= 8 || 'Al menos 8 caracteres',
      upperCase: (value: string) => /[A-Z]/.test(value) || 'Al menos una letra mayúscula',
      number: (value: string) => /\d/.test(value) || 'Al menos un número',
      specialChar: (value: string) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#()])[A-Za-z\d@$!%*?&.#()]{8,}$/.test(value) ||
        'Al menos un carácter especial',
    },
  },
};
