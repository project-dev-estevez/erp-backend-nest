import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator"
import { Direction } from "../entities/direction.entity";
import { Repository } from "typeorm";
import { CreateDirectionDto } from "../dto/create-direction.dto";


export function IsUniqueGeneralDirection( option:string, validationOptions?: ValidationOptions ) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: 'Ya hay una dirección general registrada en la empresa.'
      },
      validator: CustomGeneralDirectionvalidation,
      constraints: [option]
    });
  }
}

@ValidatorConstraint({ name: 'isGeneralDirection', async: true })
@Injectable()
export class CustomGeneralDirectionvalidation implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Direction)
    private readonly directionRepository: Repository<Direction>
  ) {}

  async validate(value: boolean, args: ValidationArguments): Promise<boolean> {

    const [ option ] = args.constraints;

    const object = args.object as CreateDirectionDto;
    const enterpriseId = object.enterpriseId;

    if( !value )
      return true;

    if( option === 'create' ) {
      return this.validateCreate(enterpriseId);
    }

    if( option === 'update' ) {
      return this.validateUpdate();
    }
  }

  async validateCreate(enterpriseId: string): Promise<boolean> {
    const existingDirection = await this.directionRepository.findOne({
      where: {
        isGeneralDirection: true,
        enterprise: { id: enterpriseId }
      },
    });

    return !existingDirection;
  }

  async validateUpdate(): Promise<boolean> {
    return true;
  }
}