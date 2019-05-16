const express     = require('express'),
      router      = express.Router(),
      Campground  = require('../models/campgroundModel'),
      middleware  = require('../middleware/index.js'),
      Comment     = require('../models/commentModel');
     



// INDEX - show all campgrounds
router.get('', (req, res) => {
  // get all campgrounds from dv
  Campground.find({}, (err, allCampgrounds) => {
    err ? console.log(err) : res.render('campgrounds/index', {campgrounds: allCampgrounds, page: 'campgrounds'});
  });
});

// CREATE --> adds new campground to the db
router.post('/', middleware.isLoggedIn, (req, res) => {
  // get data from the form and add it the campgrounds array
  // redirect back to the campgrounds page
  let name          = req.body.name,
      image         = req.body.image,
      description   = req.body.desc,
      cost          = req.body.cost,
      author        = {
                        id: req.user._id,
                        username: req.user.username
                      };
  
  
  let newCampground = {
                        name:         name,
                        cost:         cost,
                        image:        image,
                        description:  description,
                        author:       author
                      };

  Campground.create(newCampground, (err, newCampground) => {
    err ? console.log(err) : ( req.flash('success', `You created ${newCampground.name}`), res.redirect('/campgrounds') );
  });
});



//  NEW 
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW 
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').populate({
    path: 'reviews', 
    options: {sort: {createdAt: -1}}
  }).exec( (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

//EDIT Campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    (err || !campground) ? (console.log(err), req.flash('error', 'Sorry, that campground does not exist')) : res.render('campgrounds/edit', {campground: req.campground});
  });
});


// UPDATE Campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
   delete req.body.campground.rating;
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    err ? console.log(err) : (req.flash('success', `You have successfully updated ${updatedCampground.name}`), res.redirect('/campgrounds'));
  });
});

// DELETING Campgrounds
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      res.redirect('/campgrounds');
    } else {
      Comment.remove({'_id': {$in: campground.comments}}, (err) => {
        if(err) {
          console.log(err);
          return res.redirect('/campgrounds');
        }
      });
    }
  });
});



module.exports = router;
