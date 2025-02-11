import {IsNotEmpty, IsObject, IsString} from "class-validator";
import {IsJsonSchema} from "../../shared/decorators";

export class TaskFormat {
    @IsString()
    @IsNotEmpty()
    formatName!: string;

    @IsObject()
    @IsNotEmpty()
    @IsJsonSchema()
    schema!: Record<string, any>;
}
