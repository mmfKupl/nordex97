const mysql = require('mysql2');
let { arr } = require('../../proraw');

const mc = [
  {
    IDCategory: 1,
    Title: 'АБС пластики (ABS, ASA)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 2,
    Title: 'Полиэтилены',
    Sub: false,
    ExpandId: 1,
    Expand: null
  },
  { IDCategory: 3, Title: 'ПНД (HDPE)', Sub: true, ExpandId: null, Expand: 1 },
  { IDCategory: 4, Title: 'ПВД (LDPE)', Sub: true, ExpandId: null, Expand: 1 },
  { IDCategory: 5, Title: 'ПЭСП (MDPE)', Sub: true, ExpandId: null, Expand: 1 },
  {
    IDCategory: 6,
    Title: 'ЛПЭНП (LLDPE)',
    Sub: true,
    ExpandId: null,
    Expand: 1
  },
  {
    IDCategory: 7,
    Title: 'Полипропилены (PP)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 8,
    Title: 'Полистиролы',
    Sub: false,
    ExpandId: 6,
    Expand: null
  },
  {
    IDCategory: 9,
    Title: 'Общего назначения (GPPS)',
    Sub: true,
    ExpandId: null,
    Expand: 6
  },
  {
    IDCategory: 10,
    Title: 'Ударопрочные (HIPS)',
    Sub: true,
    ExpandId: null,
    Expand: 6
  },
  {
    IDCategory: 11,
    Title: 'Вспенивающиеся (EPS)',
    Sub: true,
    ExpandId: null,
    Expand: 6
  },
  {
    IDCategory: 12,
    Title: 'Красители для полимеров',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 13,
    Title: 'Добавки для полимеров',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 14,
    Title: 'Поливинилхлориды (PVC)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 15,
    Title: 'Пластикаты ПВХ',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 16,
    Title: 'Поликарбонаты (PC)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 17,
    Title: 'Полиэтилентерефталаты (PET)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 18,
    Title: 'Полиамиды (ПА)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 19,
    Title: 'Полиуретаны (PU)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 20,
    Title: 'Полиметилметакрилаты (ПММА)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 21,
    Title: 'Полиформальдегиды',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 22,
    Title: 'Полиолефины (ПОФ)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 23,
    Title: 'Эластомеры',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 24,
    Title: 'Прессматериалы (PM)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 25,
    Title: 'Мономеры',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 26,
    Title: 'Термопласты',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 27,
    Title: 'Фенопласты (FP)',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  { IDCategory: 28, Title: 'Бор', Sub: false, ExpandId: null, Expand: null },
  { IDCategory: 29, Title: 'Воски', Sub: false, ExpandId: null, Expand: null },
  {
    IDCategory: 30,
    Title: 'Реактивы',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 31,
    Title: 'Органические растворители',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 32,
    Title: 'Каучуки синтетические',
    Sub: false,
    ExpandId: null,
    Expand: null
  },
  {
    IDCategory: 33,
    Title: 'Химическое сырье',
    Sub: false,
    ExpandId: null,
    Expand: null
  }
];

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
    conn.query(str, params, (err, results, felds) => {
      if (err) {
        rej(err);
      } else {
        res([results, felds]);
      }
    });
  });
}

(async () => {
  try {
    const conn = await connect(mysql.createConnection(config));
    // const fil = {};
    // arr = arr.filter(obj => {
    //   if (!fil[obj.article]) {
    //     fil[obj.article] = true;
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // for (let item of arr) {
    //   let {
    //     category,
    //     title,
    //     description,
    //     article,
    //     property,
    //     keywords,
    //     available
    //   } = item;
    //   const res = await query(
    //     `call AddItem(?, ?, ?, ?, ?, ?, ?)`,
    //     [category, title, description, article, property, keywords, available],
    //     conn
    //   );
    //   console.log(res);
    // }
    const data = await query('call GetCategoryTable()', [], conn);
    console.log(data);
    conn.end(console.log);
  } catch (err) {
    console.log(err);
  }
  // const data = await sqlCon.query('select * from Item');
  // console.log(data);
  process.exit(1);
})();
// (async () => {
//   try {
//     const conn = mysql.createConnection(config);
//     await connect(conn);

//     for (let item of mc) {
//       let { Title, Sub, ExpandId, Expand } = item;
//       const res = await query(
//         `call AddCategory(?, ?, ?, ?)`,
//         [Title, Sub, ExpandId, Expand],
//         conn
//       );
//       console.log(res);
//     }
//     conn.end(console.log);
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit(1);
// })();
