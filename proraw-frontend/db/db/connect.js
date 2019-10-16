const sql = require('mssql');
// const category = require('../assets/itemList.json');
const itemList = require('../assets/items/1.json');

const config = {
  server: 'DESKTOP-DLJHLFA',
  database: 'proraw',
  user: 'sa',
  password: '159874632'
};

// (async () => {
//   const sqlCon = await sql.connect(config);
//   for (let item of category) {
//     let { title, sub, expandId, expand } = item;
//     sub = sub ? 1 : 0;
//     expandId = expandId === undefined ? 'null' : expandId;
//     expand = expand === undefined ? 'null' : expand;
//     const res = await sqlCon.query(
//       `exec AddCategory '${title}', ${sub}, ${expandId}, ${expand}`
//     );
//     console.log(res);
//   }
//   const data = await sqlCon.query('exec GetCategoryTable');
//   console.log(data);
//   process.exit(1);
// })();

(async () => {
  const sqlCon = await sql.connect(config);
  for (let item of itemList) {
    let { title, description, article, property } = item;
    const res = await sqlCon.query(
      `exec AddItem 2, '${title}', '${description}', '${article}', '${property}', 1`
    );
    console.log(res);
  }
  const data = await sqlCon.query('select * from Item');
  console.log(data);
  process.exit(1);
})();

// const a = {
//   sqlCon: null,
//   async init() {
//     return (this.sqlCon = await sql.connect(config));
//   },
//   async selectFrom(from = '', where = '') {
//     return this.sqlCon.query(`select * from ${from} ${where}`);
//   }
// };
// exports.a = a;
// sql.connect(config).then( async res => {

//     const data =  await res.query('select * from Bank where КодБанка=1')
//     console.log(data);
// }).catch(err => {
//     console.log(err);
// })
