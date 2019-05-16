const   express     = require('express'),
        router      = express.Router({mergeParams: true}),
        Campground  = require('../models/campgroundModel'),
        Comment     = require('../models/commentModel'),
        middleware  = require('../middleware');

// ==========================
// COMMENT ROUTES
// ==========================

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    (err || !campground) ? (console.log(err), req.flash('error', 'Sorry, that campground does not exist')) : res.render('comments/new', {campground: campground});
  });
});

router.post('/', (req, res) => {
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err || !campground){
           console.log(err);
           req.flash('error', 'Sorry, that campground does not exist')
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash('success', 'You posted a new comment');
               res.redirect(`/campgrounds/${campground._id}`);
           }
        });
       }
   });
   
});

//edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    err ? res.redirect('back') :  res.render('comments/edit', {campground_id: req.params.id, comment: req.comment});
  });
  
});

//update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComment) => {
    err ? console.log(err) : (req.flash('success', 'You updated a comment'), res.redirect(`/campgrounds/${req.params.id}`));
  });
});



//destroy
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    err ? console.log(err) : (req.flash('error', 'You have deleted a comment'), res.redirect(`/campgrounds/${req.params.id}`));
  });
});



module.exports = router;