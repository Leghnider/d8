var HomeController = {
  Index: function(req, res) {
    res.render('home/index', { title: 'd8' });
  }
};

module.exports = HomeController;
