const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const db = new Sequelize(process.env.PORT || 'postgres://postgres:JerryPine@localhost/bookmarks_app_db');

const User = db.define('Users', {
    email: {
        type: STRING,
        allowNull: false
    }
});

const syncAnsSeed = async()=>{
    await db.sync({ force: true});
};

const init = async() => {
    await db.authenticate();
    await syncAnsSeed();
};


init();

// const { Client } = require('pg');
// const client = new Client(process.env.PORT || 'postgres://postgres:JerryPine@localhost/bookmarks_app_db')
// const init = async() =>{
//     try {
//         await client.connect();
//         await syncAnsSeed();
//     } 
//     catch (ex){
//         console.log(ex);
//     }

// };

// 