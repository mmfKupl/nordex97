import * as mySql from 'mysql2';
import * as express from 'express';
const router = express.Router();
import { dbConfig } from '../db.config';

function connect(conn) {
  return new Promise((res, rej) => {
    conn.connect(err => {
      if (err) {
        rej(err);
      } else {
        res(conn);
      }
    });
  });
}

function query(str, params, conn) {
  return new Promise((res, rej) => {
    conn.execute(str, params, (err, results, felds) => {
      if (err) {
        rej(err);
      } else {
        res([results, felds]);
      }
    });
  });
}

export const sqlConn = {
  async init() {
    const sqlCon = mySql.createConnection(dbConfig);
    await connect(sqlCon);
    return sqlCon;
  },
  async getCategory() {
    const conn = await this.init();
    const data = await query('call GetCategoryTable()', [], conn);
    conn.end();
    return data[0];
  },
  async getItems() {
    const conn = await this.init();
    const data = await query('call GetItemTable()', [], conn);
    conn.end();
    return data[0];
  },
  async getItemsByCategoryId(categoryId: number) {
    const conn = await this.init();
    const data = await query('call GetItemByCategoryId(?)', [categoryId], conn);
    conn.end();
    return data[0];
  },
  async getSearchData(queryStr: string) {
    const conn = await this.init();
    queryStr = `%${queryStr}%`;
    const data = await query('call GetSearchData(?)', [queryStr], conn);
    conn.end();
    return data[0];
  }
};

router.get('/', (req, res, next) => {
  res.send('api');
});

router.get('/items', (req, res, next) => {
  sqlConn
    .getItems()
    .then(data => {
      const recordset = (data && data[0]) || [];
      res.json(recordset);
    })
    .catch(err => {
      res.json(err.message);
    });
});

router.get('/categories', (req, res, next) => {
  sqlConn
    .getCategory()
    .then(data => {
      const recordset = (data && data[0]) || [];
      res.json(recordset);
    })
    .catch(err => {
      res.json(err.message);
    });
});

router.get('/items/:categoryId', (req, res, next) => {
  const categoryId = +req.params.categoryId;
  sqlConn
    .getItemsByCategoryId(categoryId)
    .then(data => {
      const recordset = (data && data[0]) || [];
      res.json(recordset);
    })
    .catch(err => {
      res.json(err.message);
    });
});

router.get('/search/:query', (req, res, next) => {
  sqlConn
    .getSearchData(req.params.query)
    .then(data => {
      const recordset = (data && data[0]) || [];
      res.json(recordset);
    })
    .catch(err => {
      res.json(err.message);
    });
});

export const dbrouter = router;
