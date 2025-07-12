const express = require('express');
const userSchema = require('./models/user')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs')
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// fs.writeFile(path.join(__dirname, 'views', 'index.ejs'),  'created', ()=> console.log('folder has been created')
// )



app.get('/', (req, res) => {
    res.render('index')
});

app.post('/create', async (req, res) => {
    const {username, name, email, password, age} = req.body;

    const salt =  await bcrypt.genSalt(10);
    const hashpasword = await bcrypt.hash('password', salt);

const token = jwt.sign(email, 'secret');
res.cookie("token", token)


 const userdata = await userSchema.create({
username, name, email, password: hashpasword, age
 })
 res.send(userdata)
//  res.json({msg: 'you are successfull'})
})

app.get('/logout', (req, res) => {
    res.cookie('token', '');
    res.redirect('/')
    
})



app.listen(PORT, ()=> console.log(`server is listen on port ${PORT}`))