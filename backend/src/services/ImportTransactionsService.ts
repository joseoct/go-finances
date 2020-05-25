import { getCustomRepository, getRepository, In } from 'typeorm';
import path from 'path';
import csvtojson from 'csvtojson';
import fs from 'fs';
import TransactionRepository from '../repositories/TransactionsRepository';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  csvFilename: string;
}

class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const pathFileImported = path.join(uploadConfig.directory, csvFilename);

    const transactionJsonArray = await csvtojson().fromFile(pathFileImported);

    const categories = transactionJsonArray.map(
      transaction => transaction.category,
    );

    const categoriesWithoutDuplicates = categories.filter(
      (value, index) => categories.indexOf(value) === index,
    );

    const categoriesFound = await categoriesRepository.find({
      where: {
        title: In(categoriesWithoutDuplicates),
      },
    });

    const categoriesFoundTitle = categoriesFound.map(
      (category: Category) => category.title,
    );

    const categoriesAbleToSave = categoriesWithoutDuplicates.filter(
      category => !categoriesFoundTitle.includes(category),
    );

    // console.log(categoriesWithoutDuplicates);
    // console.log(categoriesFoundTitle);
    // console.log(categoriesAbleToSave);

    const createCategories = await categoriesRepository.create(
      categoriesAbleToSave.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(createCategories);

    const allCategories = [...createCategories, ...categoriesFound];

    const newTransactions = transactionRepository.create(
      transactionJsonArray.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: allCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(newTransactions);

    // const transactions = await Promise.all(
    //   jsonArray.map(async transaction => {
    //     const createTransaction = createTransactionService.execute(transaction);

    //     return createTransaction;
    //   }),
    // );

    await fs.promises.unlink(pathFileImported);

    return newTransactions;
  }
}

export default ImportTransactionsService;
