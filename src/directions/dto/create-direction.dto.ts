import { IsBoolean, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateDirectionDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name: string;

    @IsOptional()
    @IsBoolean()
    isGeneralDirection?: boolean;

}
