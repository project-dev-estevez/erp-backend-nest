import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateProjectDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name: string;

    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @IsUUID()
    @IsNotEmpty()
    enterpriseId: string;

}
