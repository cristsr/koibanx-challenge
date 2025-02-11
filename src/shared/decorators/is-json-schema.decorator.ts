import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import Ajv from "ajv";

@ValidatorConstraint({ async: false })
class IsJsonSchemaConstraint implements ValidatorConstraintInterface {
    private ajv = new Ajv();

    validate(value: any): any {
        if (typeof value !== "object" || value === null) {
            return false;
        }

        return this.ajv.validateSchema(value);
    }

    defaultMessage() {
        return "The value must be a JSON schema";
    }
}

export function IsJsonSchema(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsJsonSchemaConstraint
        });
    };
}
