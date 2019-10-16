require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session')
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const {
    SESSION_SECRET, CONNECTION_STRING
} = process.env;

const port= 4000;

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('database connected')
})

//endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)

app.listen(port, () => console.log(`server running ${port}`))