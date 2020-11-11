const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:JerryPine@localhost/bookmarks_app_db');

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
    await Bookmarks.create({name: 'nypl', url: 'www.nypl.org', category: 'job search'});
    await Bookmarks.create({name: 'epfl', url: 'www.epfl.org', category: 'job search'});
    await Bookmarks.create({name: 'google', url: 'www.google.com', category: 'job search'});
};


module.exports = {
    db,
    syncAndSeed,
    models: {
        Bookmarks
    }

};
