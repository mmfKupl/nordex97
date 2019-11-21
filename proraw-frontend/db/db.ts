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
  async adminLogIn(login, password) {
    const conn = await this.init();
    const data = await query(
      'call AdminLogIn(?, md5(?))',
      [login, password],
      conn
    );
    conn.close();
    return data[0];
  },
  async adminLogOut(idAdmin) {
    const conn = await this.init();
    const data = await query('call AdminLogOut(?)', [idAdmin], conn);
    conn.close();
    return data[0];
  },
  async validateAdminAction(idAdmin, sessionKey, conn?) {
    let flag = false;
    if (!conn) {
      flag = true;
      conn = await this.init();
    }
    const data = await query(
      'call ValidateAdminAction(?, ?)',
      [idAdmin, sessionKey],
      conn
    );
    if (flag) {
      conn.close();
    }
    return data[0];
  },
  async getCategory() {
    const conn = await this.init();
    const data = await query('call GetCategoryTable()', [], conn);
    conn.close();
    return data[0];
  },
  async getItems() {
    const conn = await this.init();
    const data = await query('call GetItemTable()', [], conn);
    conn.close();
    return data[0];
  },
  async getItemsByCategoryId(categoryId: number) {
    const conn = await this.init();
    const data = await query('call GetItemByCategoryId(?)', [categoryId], conn);
    conn.close();
    return data[0];
  },
  async getSearchData(queryStr: string) {
    const conn = await this.init();
    queryStr = `%${queryStr}%`;
    const data = await query('call GetSearchData(?)', [queryStr], conn);
    conn.close();
    return data[0];
  },
  async createCategoryTable() {
    const conn = await this.init();
    const data = await query('call CreateCategoryTable()', [], conn);
    conn.close();
    return data;
  },
  async addCategory(category, conn) {
    const data = await query(
      'call AddCategory(?, ?, ?, ?)',
      [
        category.Title || null,
        category.Sub || null,
        category.ExpandId || null,
        category.Expand || null
      ],
      conn
    );
    return data;
  },
  async addItem(item, conn) {
    const data = await query(
      'call AddItem(?, ?, ?, ?, ?, ?, ?)',
      [
        item.IDCategory || null,
        item.Title || null,
        item.Description || null,
        item.VendorCode || null,
        item.Property || null,
        item.Keywords || null,
        item.Available || null
      ],
      conn
    );
    return data;
  },
  async createItemTable() {
    const conn = await this.init();
    const data = await query('call createItemTable()', [], conn);
    conn.close();
    return data;
  },
  async dropTable(tableName = '') {
    const conn = await this.init();
    const res = await query(`drop table ${tableName}`, [], conn);
    conn.close();
    return res;
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
