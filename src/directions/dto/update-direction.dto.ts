import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { IsUniqueGeneralDirection } from "../decorators/is-unique-general-direction.decorator";

export class UpdateDirectionDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name: string;

    @IsOptional()
    @IsBoolean()
    @IsUniqueGeneralDirection('update')
    isGeneralDirection?: boolean;

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    enterpriseId: string;

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    directorId: string;
}