import * as sql from 'mssql';
import * as express from 'express';
const router = express.Router();
import { dbConfig } from '../../db.config';

export const sqlCon = {
  sqlCon: null,
  async init() {
    return (this.sqlCon = await sql.connect(dbConfig));
  },
  async getCategory() {
    if (!this.sqlCon) {
      return null;
    }
    return await this.sqlCon.query('select * from Category');
  },
  async getItems() {
    if (!this.sqlCon) {
      return null;
    }
    return await this.sqlCon.query('select * from Item');
  },
  async getItemsByCategoryId(categoryId: number) {
    if (!this.sqlCon || categoryId < 0) {
      return null;
    }
    return await this.sqlCon.query(
      `select * from Item where IDCategory = ${categoryId}`
    );
  }
};

sqlCon.init();

router.get('/api/items', (req, res, next) => {
  sqlCon.getItems().then(data => {
    const recordset = (data && data.recordset) || [];
    res.json(recordset);
  });
});

router.get('/api/category', (req, res, next) => {
  sqlCon.getCategory().then(data => {
    const recordset = (data && data.recordset) || [];
    res.json(recordset);
  });
});

router.get('/api/items/:categoryId', (req, res, next) => {
  const categoryId = +req.params.categoryId;
  sqlCon.getItemsByCategoryId(categoryId).then(data => {
    const recordset = (data && data.recordset) || [];
    res.json(recordset);
  });
});

export const dbrouter = router;

// const
