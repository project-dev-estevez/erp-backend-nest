import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateEnterpriseDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name!: string;

    @IsUUID()
    @IsNotEmpty()
    ceoId: string;
    
}
