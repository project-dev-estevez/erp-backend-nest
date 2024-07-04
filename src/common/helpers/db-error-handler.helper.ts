import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export function handleDBErrors(error: any, logger: any): never {
    if (error.code === '23505') {
        throw new BadRequestException(error.detail);
    }

    logger.error(error);
    throw new InternalServerErrorException('Please check server logs for more details');
}