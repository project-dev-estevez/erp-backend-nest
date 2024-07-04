import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateDirectionDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name: string;

    @IsOptional()
    @IsBoolean()
    isGeneralDirection?: boolean;

    @IsUUID()
    @IsNotEmpty()
    enterpriseId: string;

    @IsUUID()
    @IsNotEmpty()
    directorId: string;

}
