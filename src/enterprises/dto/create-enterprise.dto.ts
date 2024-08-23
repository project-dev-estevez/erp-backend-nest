import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateEnterpriseDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name!: string;

    @IsUUID()
    @IsNotEmpty()
    ceoId: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(150)
    address: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    rfc: string;
    
}
