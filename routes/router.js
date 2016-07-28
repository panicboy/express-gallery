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
      if(req.user !== undefined){
        return res.render('index', {
        galleryItems: findResult,
        logged: true
        });
      } else {
        return res.render('index', {
        galleryItems: findResult,
        logged: false
        });
      }
    }
  });
});

Router.get('/new', (req, res) => {
  if(req.user === undefined) res.render('login');
  return res.render('new');
});

Router.get('/:id', (req, res) => {
  if(req.user === undefined) console.log('no req.user');
  if(req.user) console.log('req.user: ', req.user, ', id: ', req.user.id);
  var id = req.params.id;
  Post.findById(id)
  .then(function (findResult) {
    if(findResult !== null && findResult != 'null'){
      return res.render('detailview', findResult.dataValues);
    }
  });
});

Router.post('/', (req,res)=>{
  if(req.user === undefined) res.render('login');
  req.body.UserId = req.user.id;
  Post.create(req.body)
  .then(function (postdata) {
    // sends back values as entered into DB
    return res.render('detailview', postdata.dataValues);
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
      let foundImage = findResult.dataValues;
      if(req.user === undefined || Number(req.user.id) != foundImage.UserId) return res.render('detailview', foundImage);
      return res.render('edit', foundImage);
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
        .then(console.log)
    } else {
      // ID doesn't exist
      return res.json(`couldn't find id ${body.id}`);
    }
  })
  .catch((err) => {
    console.error(`Problems with findById ${body.id}: `, err);
  });
  Post.findById(body.id)
  .then(function (findResult) {
    if(findResult !== null && findResult != 'null'){
      return res.render('detailview', findResult.dataValues);
    }
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
      .then(function (result) {
        res.json(result); // sends back 0 or 1 for failure/success
      });
    }});
});

module.exports = Router;
