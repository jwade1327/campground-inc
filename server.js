// STILL NEED TO ADD HANDLEBARS OR WHATEVER TEMPLATE GENERATOR 

const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3001;
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');

require('dotenv').config();

const sess = {
    secret: process.env.DB_SECRET,
    cookie: {maxAge: 900000}, // 15 minutes
    //sameSite: secure,
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));

const helpers = require('./utils/helpers');
//re-add hbs if you want to add a 'helpers' utility file
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./controllers'));

sequelize.sync({force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});