import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";


export class CreateDepartmentDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name!: string;

    @IsUUID()
    @IsNotEmpty()
    directionId!: string;

    @IsUUID()
    @IsOptional()
    managerId?: string;

}
