const express = require('express');
const app = express();
const fs = require('fs');
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const js2xmlparser = require('js2xmlparser');
const xml2js = require('xml2js');
import { sqlConn } from './db/db';
import { join } from 'path';

let uploadingStatus = false;
const DIST_FOLDER = join(process.cwd(), 'admin/admin');

async function parseToXMLCategories() {
  const category = (await sqlConn.getCategory())[0];
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
  const filedata = fs.readFileSync(filePath);
  const json = JSON.parse(await xml2js.parseStringPromise(filedata));
  if (type === 'categories') {
    const conn = await sqlConn.init();
    const categories = json[type].category;
    const rd = await sqlConn.dropTable('Category');
    const rc = await sqlConn.createCategoryTable();
    // tslint:disable-next-line: prefer-for-of
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
    const items = json[type].item;
    const rd = await sqlConn.dropTable('Item');
    const rc = await sqlConn.createItemTable();
    // tslint:disable-next-line: prefer-for-of
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

app.use(busboy());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/getFileCategories', async (req, res) => {
  try {
    const { idAdmin, sessionKey } = req.query;
    const data = await sqlConn.validateAdminAction(
      idAdmin || null,
      sessionKey || null
    );
    if (!data[0][0].Valid) {
      res.send({ status: 'Error', message: 'недостаточно прав.' });
      return;
    }
    const file = await parseToXMLCategories();
    const filePathCat = process.cwd() + '/files/' + 'db_categories.xml';
    fs.writeFileSync(filePathCat, file, { encoding: 'utf8' });
    res.sendFile(filePathCat);
  } catch (err) {
    res.json({ status: 'Error', message: err.message });
  }
});

app.get('/getFileItems', async (req, res) => {
  try {
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
    const filePathItems = process.cwd() + '/files/' + 'db_items.xml';
    fs.writeFileSync(filePathItems, file, { encoding: 'utf8' });
    res.sendFile(filePathItems);
  } catch (err) {
    res.json({ status: 'Error', message: err.message });
  }
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
    const filepath = process.cwd() + '/files/' + filename;
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
    const filepath = process.cwd() + '/files/' + filename;
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

app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);

app.get(/\/.+/, (req, res) => {
  res.redirect('/');
});

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: DIST_FOLDER });
});

export const adminApp = app;
