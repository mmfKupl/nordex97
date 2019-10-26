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

export const sqlCon = {
  sqlCon: null,
  activated: false,
  async init() {
    this.activated = false;
    this.sqlCon = await connect(mySql.createConnection(dbConfig));
    this.activated = true;
    return this.sqlCon;
  },
  async getCategory() {
    if (!this.sqlCon && this.activated) {
      await this.init();
    }
    const data = await query('call GetCategoryTable()', [], this.sqlCon);
    return data[0];
  },
  async getItems() {
    if (!this.sqlCon && this.activated) {
      await this.init();
    }
    const data = await query('call GetItemTable()', [], this.sqlCon);
    return data[0];
  },
  async getItemsByCategoryId(categoryId: number) {
    if (!this.sqlCon && this.activated) {
      await this.init();
    }
    const data = await query(
      'call GetItemByCategoryId(?)',
      [categoryId],
      this.sqlCon
    );
    return data[0];
  },
  async getSearchData(queryStr: string) {
    if (!this.sqlCon && this.activated) {
      await this.init();
    }
    queryStr = `%${queryStr}%`;
    const data = await query('call GetSearchData(?)', [queryStr], this.sqlCon);
    return data[0];
  }
};

sqlCon.init();

router.get('/api/items', (req, res, next) => {
  sqlCon
    .getItems()
    .then(data => {
      const recordset = (data && data[0]) || [];
      res.json(recordset);
    })
    .catch(err => {
      res.json(err.message);
    });
});

router.get('/api/categories', (req, res, next) => {
  sqlCon
    .getCategory()
    .then(data => {
      const recordset = (data && data[0]) || [];
      res.json(recordset);
    })
    .catch(err => {
      res.json(err.message);
    });
});

router.get('/api/items/:categoryId', (req, res, next) => {
  const categoryId = +req.params.categoryId;
  sqlCon
    .getItemsByCategoryId(categoryId)
    .then(data => {
      const recordset = (data && data[0]) || [];
      res.json(recordset);
    })
    .catch(err => {
      res.json(err.message);
    });
});

router.get('/api/search/:query', (req, res, next) => {
  sqlCon
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
