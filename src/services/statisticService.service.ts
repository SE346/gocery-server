import { Op, Transaction } from 'sequelize';
import { Order } from '../models';

enum typeQuery {
  ALL = 'all',
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

enum statisticTypeQuery {
  OVERVIEW = 'overview',
  DETAIL = 'detail',
}

interface DateObject {
  day?: number;
  month?: number;
  year?: number;
}

interface RangeDate {
  startDate: string;
  endDate: string;
}

interface OrderByType {
  revenue: number;
  transactions: {
    total: number;
    finished: number;
    inprogress: number;
    cancelled: number;
  };
}

export const findDate = (types: typeQuery, date?: DateObject) => {
  let startDate;
  let endDate;

  if (types === 'all') {
    startDate = new Date(2020, 0, 2);
    endDate = new Date(2030, 0, 2);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
  }
  if (types === 'day') {
    const year = date?.year || 2020;
    const month = (date?.month || 1) - 1;
    const day = (date?.day || 1) + 1;

    startDate = new Date(year, month, day);
    endDate = new Date(year, month, day + 1);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
  }
  if (types === 'month') {
    const year = date?.year || 2020;
    const month = (date?.month || 1) - 1;

    startDate = new Date(year, month, 2);
    endDate = new Date(year, month + 1);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
  }
  if (types === 'year') {
    const year = date?.year || 2020;

    startDate = new Date(year, 0, 2);
    endDate = new Date(year + 1, 0, 2);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
  }

  return {
    startDate,
    endDate,
  };
};

export const getOrderByType = async (
  types: typeQuery,
  t: Transaction,
  date?: DateObject
): Promise<OrderByType> => {
  const { startDate, endDate } = findDate(types, date);

  // Count revenue
  const revenue = await Order.sum('total', {
    where: {
      orderDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
  });

  // Count finished transaction
  const countedFinishedTransaction = await Order.count({
    where: {
      status: 'Finished',
      orderDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    transaction: t,
  });

  // Count inprogress transaction
  const countedInprogressTransaction = await Order.count({
    where: {
      status: 'In Progress',
      orderDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    transaction: t,
  });

  // Count cancelled transaction
  const countedCancelledTransaction = await Order.count({
    where: {
      status: 'Cancelled',
      orderDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    transaction: t,
  });

  return {
    revenue: revenue,
    transactions: {
      total:
        countedFinishedTransaction + countedCancelledTransaction + countedInprogressTransaction,
      finished: countedFinishedTransaction,
      inprogress: countedInprogressTransaction,
      cancelled: countedCancelledTransaction,
    },
  };
};

export const getStatistic = async (
  types: statisticTypeQuery,
  t: Transaction,
  date: RangeDate
): Promise<OrderByType> => {
  const { startDate, endDate } = date;

  // Count revenue
  const revenue = await Order.sum('total', {
    where: {
      orderDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
  });

  // Count finished transaction
  const countedFinishedTransaction = await Order.count({
    where: {
      status: 'Finished',
      orderDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    transaction: t,
  });

  // Count inprogress transaction
  const countedInprogressTransaction = await Order.count({
    where: {
      status: 'In Progress',
      orderDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    transaction: t,
  });

  // Count cancelled transaction
  const countedCancelledTransaction = await Order.count({
    where: {
      status: 'Cancelled',
      orderDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    transaction: t,
  });

  return {
    revenue: revenue,
    transactions: {
      total:
        countedFinishedTransaction + countedCancelledTransaction + countedInprogressTransaction,
      finished: countedFinishedTransaction,
      inprogress: countedInprogressTransaction,
      cancelled: countedCancelledTransaction,
    },
  };
};
