import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateEmployeeDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    position: string;

    @IsUUID()
    @IsNotEmpty()
    areaId: string;

}
