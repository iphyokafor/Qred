import { PageDtoConfig } from '../../common/interface';
import logger from '../../config/logger';
import companyModel, { Company, CompanyStatus } from '../../models/company.model';
import { updateCompanyConfig } from './types';

export const createCompany = async (input: Partial<Company>) => {
  try {
    const company = await companyModel.create({
      ...input,
    });

    return company;
  } catch (error: any) {
    logger.error('Unable to create company', error);
    throw error;
  }
};

export const getCompaniesPaginatedAndSearch = async (props: PageDtoConfig) => {
  let { search, page, limit } = props;

  try {
    page = !page || isNaN(page) ? 1 : Number(page);

    const searchQueries = {
      $or: [{ name: { $regex: search, $options: 'ig' } }, { year_founded: { $regex: search, $options: 'ig' } }],
    };

    page = page < 1 ? 1 : Number(page);

    limit = !limit || isNaN(limit) ? 5 : Number(limit);

    let query = search ? searchQueries : {};

    const count = await companyModel.countDocuments({ query, status: CompanyStatus.ACTIVE });
    
    if(count === 0) {
      throw new Error('No companies found')
    }

    let totalPages = Math.ceil(count / limit);
    page = page > totalPages ? totalPages : page;

    const companies = await companyModel
      .find({ query, status: CompanyStatus.ACTIVE })
      .populate('accounts cards')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    return {
      companies,
      meta: {
        totalPages: totalPages,
        currentPage: page,
        totalCompanies: count,
      },
    };
  } catch (error) {
    logger.error('Unable to fetch companies at this time', error);
    throw error;
  }
};

export const getCompany = async (id: string) => {
  try {
    const company = await companyModel.findOne({ _id: id, status: CompanyStatus.ACTIVE }).populate('accounts cards');

    return company;
  } catch (error) {
    logger.error('Failed to get company', error);
    throw error;
  }
};

export const companyExists = async (name: string) => {
  try {
    const company = await companyModel.findOne({ name, status: CompanyStatus.ACTIVE });

    return company;
  } catch (error) {
    logger.error('Failed to get company', error);
    throw error;
  }
};

export const checkIfCompanyIsDeleted = async (id: string) => {
  try {
    const companyIsDeleted = await companyModel.findOne({ _id: id, status: CompanyStatus.DEACTIVATE });

    return companyIsDeleted;
  } catch (error) {
    throw error;
  }
};

export const updateCompany = async (props: updateCompanyConfig) => {
  const { id, name, address, year_founded } = props;

  try {
    const company = await companyModel.findOneAndUpdate(
      {
        _id: id,
        status: CompanyStatus.ACTIVE,
      },
      {
        $set: {
          name: name,
          address: address,
          year_founded: year_founded,
        },
      },
      {
        new: true,
      },
    );

    return company;
  } catch (error) {
    logger.error('Unable to update company info at this time', error);
    throw error;
  }
};

export const deactivateCompany = async (id: string) => {
  try {
    const company = await companyModel.findOneAndUpdate(
      {
        _id: id,
        status: CompanyStatus.ACTIVE,
        deletedAt: null,
      },
      {
        $set: {
          status: CompanyStatus.DEACTIVATE,
          deletedAt: new Date(),
        },
      },
      {
        new: true,
      },
    );

    return company;
  } catch (error) {
    logger.error('deactivateCompany failed', error);
    throw error;
  }
};
