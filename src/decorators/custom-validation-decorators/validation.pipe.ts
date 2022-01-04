import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSpecificTypeArray(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSpecificTypeArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: [], args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.reduce(
              (acc, ele) => acc && ele && typeof ele === relatedPropertyName,
              true,
            )
          );
        },
        defaultMessage(args) {
          const [relatedPropertyName] = args.constraints;
          if (!Array.isArray(args.value)) {
            return `${propertyName} should be an array`;
          } else if (args.value.length === 0) {
            return `${propertyName} should not be empty`;
          } else {
            return `${propertyName} should be a valid ${relatedPropertyName}`;
          }
        },
      },
    });
  };
}
