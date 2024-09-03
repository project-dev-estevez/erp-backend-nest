import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CustomersService {

  private logger: Logger = new Logger('CustomersService');

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    
    const { name, rfc, email, phoneNumber } = createCustomerDto;

    try {
      
      const customer = this.customerRepository.create({
        name,
        rfc,
        email,
        phoneNumber
      });

      await this.customerRepository.save(customer);
      return customer;

    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const [ results, total ] = await this.customerRepository.findAndCount({
      take: limit,
      skip: offset
    });

    return { results, total };

  }

  async findOne(id: string) {
    
    const customer = await this.customerRepository.findOne({
      where: { id }
    });

    if(!customer)
      throw new NotFoundException(`Customer with ID:${id} not found.`);

    try {
      await this.customerRepository.save(customer);
      return customer;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    
    const customer = await this.customerRepository.preload({
      id,
      ...updateCustomerDto
    });

    if(!customer)
      throw new NotFoundException(`Customer with ID:${id} not found`);

    try {
      await this.customerRepository.save(customer);
      return customer;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async remove(id: string) {
    
    const deleteResponse = await this.customerRepository.softDelete(id);

    if(!deleteResponse.affected)
      throw new NotFoundException(`Customer with ID:${id} not found`);

  }
}
