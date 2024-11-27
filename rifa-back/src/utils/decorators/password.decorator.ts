import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class PasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#()])[A-Za-z\d@$!%*?&.#()]{8,}$/;
    return passwordRegex.test(password);
  }

  defaultMessage(): string {
    return 'Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordConstraint,
    });
  };
}
