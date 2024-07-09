import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class CreateDepartmentDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name: string;

}
