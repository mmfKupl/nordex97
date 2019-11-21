const express = require('express');
const fs = require('fs');

const app = express();
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const path = require('path');
const mySql = require('mysql2');
const js2xmlparser = require('js2xmlparser');
const xml2json = require('xml2json');
const dbConfig = {
  host: 'nordex97.ru',
  user: 'a0350381',
  database: 'a0350381_nordex97',
  password: 'anzukiuneh'
};

let uploadingStatus = false;

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

const sqlConn = {
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
  async validateAdminAction(idAdmin, sessionKey, conn) {
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

async function parseToXMLCategories() {
  let category = (await sqlConn.getCategory())[0];
  if (!category.length) {
    throw new Error('fail to get categories');
  }

  const xmlCat = js2xmlparser.parse('categories', { category });

  return xmlCat;
}

async function parseToXMLItems() {
  let item = (await sqlConn.getItems())[0];
  item = item.map(i => {
    i.Available = i.Available.readInt8(0);
    i.Description = i.Description.trim();
    return i;
  });
  if (!item.length) {
    throw new Error('fail to get items');
  }

  const xmlItems = js2xmlparser.parse('items', { item });

  return xmlItems;
}

async function updateBD(filePath = '', type = 'categories' || 'items') {
  let filedata = fs.readFileSync(filePath);
  const json = JSON.parse(xml2json.toJson(filedata));
  if (type === 'categories') {
    const conn = await sqlConn.init();
    const categories = json[type]['category'];
    const rd = await sqlConn.dropTable('Category');
    const rc = await sqlConn.createCategoryTable();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      try {
        await sqlConn.addCategory(category, conn);
      } catch (err) {
        console.log(err.message);
      }
    }
    conn.close();
  } else if (type === 'items') {
    const conn = await sqlConn.init();
    const items = json[type]['item'];
    const rd = await sqlConn.dropTable('Item');
    const rc = await sqlConn.createItemTable();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        await sqlConn.addItem(item, conn);
      } catch (err) {
        console.log(err.message);
      }
    }
    conn.close();
  }
}

app.use(express.static(`${__dirname}/dist/proraw-admin`));
app.use(busboy());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/getFileCategories', async (req, res) => {
  const { idAdmin, sessionKey } = req.query;
  const data = await sqlConn.validateAdminAction(
    idAdmin || null,
    sessionKey || null
  );
  console.log(data);
  if (!data[0][0].Valid) {
    res.send({ status: 'Error', message: 'недостаточно прав.' });
    return;
  }
  const file = await parseToXMLCategories();
  const filePathCat = __dirname + '/files/' + 'db_categories.xml';
  fs.writeFileSync(filePathCat, file, { encoding: 'utf8' });
  res.sendFile(filePathCat);
});

app.get('/getFileItems', async (req, res) => {
  const { idAdmin, sessionKey } = req.query;
  const data = await sqlConn.validateAdminAction(
    idAdmin || null,
    sessionKey || null
  );
  if (!data[0][0].Valid) {
    res.send({ status: 'Error', message: 'недостаточно прав.' });
    return;
  }
  const file = await parseToXMLItems();
  const filePathItems = __dirname + '/files/' + 'db_items.xml';
  fs.writeFileSync(filePathItems, file, { encoding: 'utf8' });
  res.sendFile(filePathItems);
});

app.post('/uploadFileCategories', async (req, res) => {
  const { idAdmin, sessionKey } = req.query;
  const data = await sqlConn.validateAdminAction(
    idAdmin || null,
    sessionKey || null
  );
  if (!data[0][0].Valid) {
    res.send({ status: 'Error', message: 'недостаточно прав.' });
    return;
  }
  req.pipe(req.busboy);
  req.busboy.on('file', (fieldname, file, filename) => {
    if (!filename.includes('.xml')) {
      res.send({ status: false, message: 'forbiden file' });
      return;
    }
    uploadingStatus = true;
    const filepath = __dirname + '/files/' + filename;
    const fsstream = fs.createWriteStream(filepath);
    file.pipe(fsstream);
    fsstream.on('close', () => {
      updateBD(filepath, 'categories').finally(() => (uploadingStatus = false));
      res.send({ status: true, message: 'файл обрабатывается' });
    });
  });
});

app.post('/uploadFileItems', async (req, res) => {
  const { idAdmin, sessionKey } = req.query;
  const data = await sqlConn.validateAdminAction(
    idAdmin || null,
    sessionKey || null
  );
  if (!data[0][0].Valid) {
    res.send({ status: 'Error', message: 'недостаточно прав.' });
    return;
  }
  req.pipe(req.busboy);
  req.busboy.on('file', (fieldname, file, filename) => {
    if (!filename.includes('.xml')) {
      res.send({ status: false, message: 'forbiden file' });
      return;
    }
    uploadingStatus = true;
    const filepath = __dirname + '/files/' + filename;
    const fsstream = fs.createWriteStream(filepath);
    file.pipe(fsstream);
    fsstream.on('close', () => {
      updateBD(filepath, 'items').finally(() => (uploadingStatus = false));
      res.send({ status: true, message: 'файл обрабатывается' });
    });
  });
});

app.get('/getUploadingStatus', (req, res) => {
  res.json({ status: uploadingStatus });
});

app.get('/*', (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.sendFile('/dist/admin/index.html', { root: __dirname });
});

app.post('/login', async (req, res) => {
  const data = await sqlConn.adminLogIn(req.body.login, req.body.password);
  res.json(data[0]);
});

app.post('/logout', async (req, res) => {
  const data = await sqlConn.adminLogOut(req.body.idAdmin);
  res.json(data[0]);
});

app.post('/validateAdmin', async (req, res) => {
  const { idAdmin, sessionKey } = req.body;
  const data = await sqlConn.validateAdminAction(
    idAdmin || null,
    sessionKey || null
  );
  res.json(data[0]);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(__dirname);
  console.log(`Listening Port ${port}`);
});
