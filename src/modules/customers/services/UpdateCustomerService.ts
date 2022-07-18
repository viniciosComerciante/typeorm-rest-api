import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customer = await customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const customerExists = await customersRepository.findByEmail(email);

    //se o email que está sendo atualizado é encontrado na base de dados e não é do próprio usuário, não podemos permitir a modificação
    if (customerExists && customerExists.id !== id) {
      throw new AppError('Theres already one user with this mail adress.');
    }

    customer.name = name;
    customer.email = email;

    await customersRepository.save(customer);

    return customer;
  }
}
export default UpdateCustomerService;
