import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator";
import { IsUniqueGeneralDirection } from "../decorators/is-unique-general-direction.decorator";

export class CreateDirectionDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name: string;

    @IsOptional()
    @IsBoolean()
    @IsUniqueGeneralDirection('create')
    isGeneralDirection?: boolean;

    @IsUUID()
    @IsNotEmpty()
    enterpriseId: string;

    @IsUUID()
    @IsNotEmpty()
    directorId: string;

}
