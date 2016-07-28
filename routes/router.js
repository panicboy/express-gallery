const Express = require('express');
const Router = Express.Router();
const app = Express();
const db = require('../models');
const Post = db.Post;
const User = db.User;
const methodOverride = require('method-override');
app.use(methodOverride('X-HTTP-Method-Override'));


/*  >>> DAS MIDDLEWARE <<<  */
Router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    console.log('original method: ', req.method, ', rewritten method: ', method);
    console.log('req.body: ', req.body);
    delete req.body._method;
    return method;
  }
}));

Router.get('/favicon.ico', (req, res) => {
  return;
});
/*  >>> END MIDDLEWARE <<<  */

Router.get('/', (req, res) => {
  Post.findAll()
  .then(function (findResult) {
    if(findResult !== null && findResult != 'null'){
      let listOfItems = { galleryItems: findResult };
      listOfItems.logged = false;
      if(req.user !== undefined) listOfItems.logged = true;
        return res.render('index', listOfItems);
      }
  });
});

// Router.get('/listpostsandusers', (req,res) => {
//   db.sequelize.query("SELECT `Posts.id`, `title`, `UserId`, `username` FROM Posts, Users WHERE Posts.UserId = Users.id")
//   .then((findResult) => {
//     return res.send(findResult);
//   });
// });

Router.get('/new', (req, res) => {
  if(req.user === undefined) res.render('login', {logged: false});
  return res.render('new', {logged: true});
});

Router.get('/:id', (req, res) => {
  if(req.user === undefined) console.log('no req.user');
  if(req.user) console.log('req.user: ', req.user, ', id: ', req.user.id);
  var id = req.params.id;
  Post.findById(id)
  .then(function (findResult) {
    if(findResult !== null && findResult != 'null'){
      let foundItem = findResult.dataValues;
      foundItem.logged = true;
      if(req.user === undefined) foundItem.logged = false;
      return res.render('detailview', foundItem);
    }
  });
});

Router.post('/', (req,res)=>{
  if(req.user === undefined) res.render('login',{logged: false});
  req.body.UserId = req.user.id;
  console.log('post body: ', req.body);
  Post.create(req.body)
  .then(() => {
    return res.redirect('/');
  });
});

Router.get('/:id/edit', (req, res) => {
  if(req.user === undefined) console.log('no req.user');
  if(req.user) console.log('req.user: ', req.user, ', id: ', req.user.id);
  // add authentication here
  // redirect to login if not authenticated
  var id = req.params.id;
  Post.findById(id)
  .then(function (findResult) {
    if(findResult !== null && findResult != 'null') {
      let foundPost = findResult.dataValues;
      if(req.user === undefined || Number(req.user.id) != foundPost.UserId) {
        foundPost.logged = false;
        return res.render('detailview', foundPost);
      }
      foundPost.logged = true;
      return res.render('edit', foundPost);
    }
  });
});

Router.put('/:id', (req, res) => {
  var body = req.body;
  body.id = req.params.id;
  // make sure id exists in the database
  Post.findById(body.id)
   .then((findResult) => {
    // null means the id wasn't in the db
    if(findResult !== null && findResult != 'null') {
      let foundImage = findResult.dataValues;
      if(req.user === undefined || Number(req.user.id) != foundImage.UserId) return res.render('detailview', foundImage);
      Post.upsert(body)
        .then(() => {
          return res.redirect('/');
        });
    } else {
      // ID doesn't exist
      return res.json(`couldn't find id ${body.id}`);
    }
  })
  .catch((err) => {
    console.error(`Problems with findById ${body.id}: `, err);
  });
});

Router.delete('/:id', (req, res) => {
  var id = req.params.id;
  Post.findById(id)
   .then((findResult) => {
    // null means the id wasn't in the db
    if(findResult !== null && findResult != 'null') {
      let foundImage = findResult.dataValues;
      if(req.user === undefined || Number(req.user.id) != foundImage.UserId) return res.render('detailview', foundImage);
      Post.destroy({
        where: {
          id: `${id}`
        }
      })
      .then(() => {
        return res.redirect('/');
      });
    }});
});

module.exports = Router;
