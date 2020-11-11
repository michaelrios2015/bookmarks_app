const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const db = new Sequelize(process.env.PORT || 'postgres://postgres:JerryPine@localhost/bookmarks_app_db');

//making a table with sequilize and turning it into a function we 
//can manipulate with sequileize should use soem validators going to skip 
//for now, really just the url
const Bookmarks = db.define('Bookmarks', {
    name: {
        type: STRING,
        allowNull: false
    },
    //needs a validator
    url: {
        type: STRING,
        allowNull: false
    },
    category: {
        type: STRING,
        allowNull: false
    }
});

const syncAndSeed = async()=>{
    await db.sync({ force: true});
    await Bookmarks.create({name: 'nypl', url: 'nypl.org', category: 'library'});
    await Bookmarks.create({name: 'epfl', url: 'epfl.org', category: 'library'});
    await Bookmarks.create({name: 'google', url: 'google.com', category: 'programming'});
};

const init = async() => {
    try {
    await db.authenticate();
    await syncAndSeed();
    console.log(await Bookmarks.findAll());
    }
    catch (ex){
        console.log(ex);
    }
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