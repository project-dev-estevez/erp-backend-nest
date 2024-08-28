import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateAreaDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name!: string;

    @IsUUID()
    coordinatorId: string;

    @IsUUID()
    @IsOptional()
    leaderId?: string;

    @IsUUID()
    @IsNotEmpty()
    departmentId: string;

}
