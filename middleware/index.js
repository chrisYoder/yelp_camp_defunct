const Campground  = require('../models/campgroundModel'),
      Comment     = require('../models/commentModel');
      


const middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function (req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err || !foundCampground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
      } else {
        if(foundCampground.author.id.equals(req.user._id)){
          req.campground = foundCampground;
          next();
        } else {
          req.flash('error', `You don't have permission to do that.`);
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      }
    });  
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};
  
  
middlewareObject.checkCommentOwnership = function (req, res, next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err || !foundComment){
        console.log(err);
        req.flash('error', 'That comment does not exist');
        res.redirect('back');
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          req.comment = foundComment;
          next();
        }else{
          req.flash('error', `You don't have permission to do that`);
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObject.isLoggedIn = function (req, res, next) {
  req.isAuthenticated() ? next() : (req.flash('error', 'You need to be logged in to do that'), res.redirect('/login'));
};



module.exports = middlewareObject;
