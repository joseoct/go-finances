import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type must be only income or outcome');
    }

    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);
    const customTransactionRepository = getCustomRepository(
      TransactionsRepository,
    );

    const { total } = await customTransactionRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError(
        'Outcome is not valid when the value is less than total',
      );
    }

    let categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      categoryExists = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryExists);
    }

    const createTransaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryExists,
    });

    await transactionRepository.save(createTransaction);

    return createTransaction;
  }
}

export default CreateTransactionService;
