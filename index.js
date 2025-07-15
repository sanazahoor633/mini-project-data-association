const express = require('express');
const userSchema = require('./models/user');
const postSchema = require('./models/post')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const user = require('./models/user');
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

   const user = await userSchema.findOne({email});
if(user) {return res.status(500).send('user Already registered')}


    const salt = await bcrypt.genSalt(10);
    // console.log(salt);
    
    const hashPassword = await bcrypt.hash(password, salt);
    // console.log(hashPassword);
    
   const userData = await userSchema.create({
        username,
         name,
          email, 
          password: hashPassword,
          age
    })
const token = jwt.sign({email: email, userid: userData._id}, 'secret');
res.cookie('token',  token)
res.redirect('/login')
})





app.get('/logout', (req, res) => {
    res.cookie('token', '');
    res.redirect('/login')
    
})


app.get('/profile', isLogedin, async (req, res) => {

 let user = await userSchema.findOne({email: req.user.email}).populate("posts");
//  console.log(user);
 
  res.render('profile', {user})
  
    
})


app.get('/like/:id',  isLogedin, async (req, res) => {

  let post = await postSchema.findOne({_id: req.params.id}).populate("user");
  if(post.likes.indexOf(req.userid === -1)){
     post.likes.push(req.user.userid)
  } else {
   post.likes.splice(post.likes.indexOf(req.user.userid), 1) 
  }


    await post.save();
      res.redirect("/profile")

})

app.get('/edit/:id',  isLogedin, async (req, res) => {

  let post = await postSchema.findOne({_id: req.params.id}).populate("user");
res.render('edit', {post})

})


app.post('/update/:id',  isLogedin, async (req, res) => {

  let post = await postSchema.findOneAndUpdate({_id: req.params.id}, {content: req.body.content})
res.redirect('/profile')

})



app.post('/post', isLogedin, async (req, res) => {
 let user = await userSchema.findOne({email: req.user.email});
const {content} = req.body


  const post = await postSchema.create({
    user: user._id,
    content: content

  })
    

  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile')
})



app.get('/login', (req, res) => {
  res.render('login')
    
})

app.post('/login', async (req, res) => {
  const {email, password} = req.body

  const user = await userSchema.findOne({email})
  if(!user) res.status(500).send('you are not regestered')

    const result = await bcrypt.compare(password, user.password);
    if(result) { 
      const token = jwt.sign({email: email, userid: user._id}, 'secret');
res.cookie('token',  token)
  res.status(200).redirect('/profile')
    
    }
    else res.redirect('/login')
})

function isLogedin (req, res, next) {
const token = req.cookies.token

if(!token) return res.redirect('/login');
else {
  let data = jwt.verify(token, 'secret')
  req.user = (data)
}
next()
}

app.listen(PORT, ()=> console.log(`server is listen on port ${PORT}`))