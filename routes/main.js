var router = require('express').Router();
var Product = require('../models/product');


var paginate = (req, res, next) => {
  // This is pagination
    var perPage = 9;  // Every page will have 9 product items
    var page = req.params.page;

    Product
       .find()
       .skip(perPage * page)
       .limit(perPage)
       .populate('category')
       .exec((err, products) => {
         if(err) return next(err);

         // To Count Product so that we can paging according to it
         Product.count().exec((err, count) => {
           if(err) return next(err);
           res.render('main/product-main', {
             products: products,
             pages: count/perPage
           });
         });
       });
}

// Creating bridge between  Product database and replica elastic search
Product.createMapping((err, res) => {

  if(err){
    console.log("Error Creating Mapping");
    console.log("Error");
  }  else{
    console.log("Mapping Created");
    console.log(res);
  }
});

var stream = Product.synchronize();
var count = 0;

// Count the amount of documents
stream.on('data', () => {
  count++;
})

// give the count of document after close
stream.on('close', () => {
  console.log("Indexed" + count + "Documents");
});


// Show the the user whether any error come to the server
stream.on('error', () => {
console.log(err);
})


router.post('/search',(req, res, next) => {

    res.redirect('/search?q=' + req.body.q);

});

router.get('/search',(req, res, next) => {

    if(req.query.q){
      Product.search({
        query_string: {query: req.query.q}
      }, (err, results) => {

          if(err) return next(err);

          var data = results.hits.hits.map((hit) =>{
            return hit;
          });

          res.render('main/search-result', {
            query: req.query.q,
            data: data
          });

      });
    }
});

router.get('/', (req, res, next) => {
     if(req.user)  {

       paginate(req, res, next);

     } else{
       // If user is not login
    res.render('main/home');
    }
});

router.get('/about', (req, res) => {
  res.render('main/about');
});

router.get('/products/:id', (req, res, next) => {
  Product
    .find({category: req.params.id})
    .populate('category') // pupulate Because data Type is Object_id
    .exec((err, products) => {
      if(err) return next(err);

      res.render('main/category', {
        products: products
      });
    });
});

router.get('/page/:page', (req, res, next) => {
  paginate(req, res, next);
})


  router.get('/product/:id', (req, res, next) => {
    Product.findById({_id: req.params.id}, (err, product) => {
      if(err) return next(err);
      res.render('main/product', {
        product: product
      });
    });
  });
module.exports = router;
