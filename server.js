//models seems to be all the tables from the database
const { db, syncAndSeed, models: {Bookmarks}} = require('./db');
const express = require('express');
const path = require('path');


const app = express();


app.use(express.urlencoded({ extened: false}));
app.use(require('method-override')('_method'));

//honestly still not entirely sure how why this works but does the trick
app.get('/styles.css', (req, res)=>res.sendFile(path.join(__dirname, 'styles.css')));

//our redirct 
app.get('/', (req, res)=> res.redirect('/bookmarks'));

app.delete('/bookmarks/:id', async(req, res, next)=> {
    try{
        const bookmark = await Bookmarks.findByPk(req.params.id);
        await bookmark.destroy();
        res.redirect('/bookmarks')
    }
    catch(ex){
        next(ex);
    }

});



app.post('/bookmarks', async(req, res, next)=> {
    try{
        const bookmark = await Bookmarks.create({name: req.body.name, url: req.body.url, category: req.body.category});
        res.redirect(`/bookmarks/${ bookmark.name }/${ bookmark.id }`)
    }
    catch(ex){
        next(ex);
    }

});

//our main page
app.get('/bookmarks', async(req, res, next)=> {
    try {
        //gives me all my bookmarks but I want the book marks by category 
        const bookmarks = await Bookmarks.findAll();
        //console.log(bookmarks);
        //bookmarks is an array, so I can put all the categories in another array
        //bookmarks.for((element)=>{console.log(element)},[]);
        const arrCat = [];
        const arrCat2 = {};
        bookmarks.forEach(element => {
            if (!arrCat.includes(element.category)){
                arrCat.push(element.category);
            }
            //console.log(element.category);
        });

        for (let i = 0; i<bookmarks.length; i++){
            if (arrCat2.hasOwnProperty(bookmarks[i].category)){
                //console.log(bookmarks[i].category);
                arrCat2[bookmarks[i].category] += 1;
            }
            else {
                arrCat2[bookmarks[i].category] = 1;
            }
        }
        console.log(arrCat2);
        // for (const [key, value] of Object.entries(arrCat2)){
        //     console.log(`${key}: ${value}`);
        // }
        //console.log(Object.entries(arrCat2));
        //very convulated way of doing it should have just made a new table :)
        arrCat3 = Object.entries(arrCat2);

        //an array of categories
        //console.log(arrCat);
        //going to have to do some sort of filter
        res.send(`
            <html>
                <head>
                    <link rel='stylesheet' href ='/styles.css' />
                </head>
                <body>
                <h1>bookmarks</h1>
                <form method='POST'>
                    <input name='name' placeholder='enter site name'/>
                    <input name='url' placeholder='enter site url'/>
                    <input name='category' placeholder='enter site category'/>
                    <button>Create</button>
                </form>    
                </form>
               
                <ul>
                ${    

                    arrCat3.map( cat => `
                    <li>
                    <a href='/bookmarks/${cat[0]}'>
                    ${ cat[0] }
                    </a> (${ cat[1] }) 
                    </li> 
                    `).join('')


                    //  arrCat.map( cat => `
                    //     <li>
                    //     <a href='/bookmarks/${cat}'>
                    //     ${ cat }
                    //     </a> () 
                    //     </li> 
                    //     `).join('')
                
                }
                </ul> 
                </body>
            </html>
        `);
    }
    catch (ex){
        next(ex);
    }
});

app.get('/bookmarks/:name', async(req, res, next)=> {
    try {
        const bookmarks = await Bookmarks.findAll({where: {category: req.params.name}});
        //going to have to do some sort of filter
        res.send(`
            <html>
                <head>
                    <link rel='stylesheet' href ='/styles.css' />
                </head>
                <body>
                <h1>bookmarks</h1>

                <ul>
                    ${ bookmarks.map( bookmark => `
                        <li>
                        <a href='/bookmarks/${bookmark.name}/${bookmark.id}'>
                        ${ bookmark.name}
                        </a>
                        </li> 
                        `).join('')}

                </ul>
                </body>
            </html>
        `);
    }
    catch (ex){
        next(ex);
    }
});


app.get('/bookmarks/:name/:id', async(req, res, next)=> {
    try {
        const bookmark = [await Bookmarks.findByPk(req.params.id)][0];
        //don't yet know how to send to outside website
        res.send(`
            <html>
                <head>
                    <link rel='stylesheet' href ='/styles.css' />
                </head>
                <body>
                <h1><a href='/'>bookmarks</a></h1>
                <h2>${ bookmark.name}</h2>
                <p>
                    <a href='http://${bookmark.url}'>
                    ${ bookmark.url}
                    </a>
                </p>
                 <form method='POST' action='/bookmarks/${bookmark.id}?_method=DELETE'>
                 <button>x</button>
                 </form>
                </body>
            </html>
        `);
    }
    catch (ex){
        next(ex);
    }
});



const init = async() => {
    try {
    await db.authenticate();
    await syncAndSeed();
    //console.log(await Bookmarks.findAll());
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on the ${port}`));
    }
    catch (ex){
        console.log(ex);
    }
};


init();

