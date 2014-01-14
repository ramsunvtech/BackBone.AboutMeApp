var Tlog = console.log || {};

var Target = {};
Target.Template = {
  getTpl: function (tplPath) {
    var tmpl;
    $.ajax({
      url: tplPath,
      type: 'get',
      async: false,
      success: function(html) {
          tmpl = html;
      }
    });
    return tmpl;
  }
};

/**
 ** Model Code Starts Here.
 */

var PageModel = Backbone.Model.extend({
  url: function () {
    return 'pages/' + this.id + '.json';
  },
  defaults: {
    pageTitle: '',
    breadCrumb: '',
    pageBody: ''
  }
});


/**
 ** View Code Starts Here.
 */

var PageView = Backbone.View.extend({
  model: PageModel,
  initialize: function (arg) {
    page = new PageModel({id:arg.pageName});
    this.render();
  },
  el: $('#page'),
  events: {
    'click nav li': 'onMenuParentClick',
    'click nav a': 'onMenuClick'
  },

  onMenuClick: function (e) {
    var a = 'active';
    $('nav li.active').removeClass(a);
    $(e.target).parent('li').addClass(a);
  },

  getTpl: function (tplFile) {
    var tplData = Target.Template.getTpl(tplFile);
    return tplData;
  },

  compileTpl: function(tplObj, tplFile, tplVars) {
    var tplData = this.getTpl(tplFile),
        compiledTpl = _.tpl(tplObj, tplData, tplVars);
    return compiledTpl;
  },

  compileSubTpl: function(tplObj, tplFile, tplVars) {
    var tplData = this.getTpl(tplFile);
    _.subTpl(tplObj, tplData, tplVars);
  },

  compileRecursiveTpl: function(tplObj, tplFile, tplVars) {
    var tplData = this.getTpl(tplFile),
        compiledTpl = _.recursiveTpl(tplObj, tplData, tplVars);
    return compiledTpl;
  },

  stop: function(e) {
    e.preventDefault();
  },

  stopAll: function(e) {
    this.stop(e);
    e.stopPropagation();
  },

  render: function () {
    var pageEl = this.$el,
        that = this;

    page.fetch({
      success: function() {
        var pageResponse;
        
        // Rending the Page BreadCrumb.
        var breadCrumbInfo = {
          items: page.get('breadCrumb')
        };              
        that.compileSubTpl('breadCrumb', 'templates/bread-crumb.html', breadCrumbInfo);

        // Rendering the Page Body.
        var pageBodyInfo =  {
          title: page.get('pageTitle'),
          desc: page.get('pageBody')
        };
        that.compileSubTpl('pageBody', 'templates/page-body.html', pageBodyInfo);

        // Rendering the Page.
        var pageInfo = {
          "footerText": "&copy; 2014 About Me App, Inc."
        };
        var pageResponse = that.compileRecursiveTpl('page', 'templates/page.html', pageInfo);

        pageEl.children('.content').html(pageResponse);
      }
    });

  } 
});

/**
  Router Code Starts Here
 */

var AppRouter = Backbone.Router.extend({
  routes: {
    ':page': 'getPage',
    '': 'loadHub'
  },
  loadHub: function () {
    this.getPage('home');
  },
  getPage: function(page) {
    new PageView({
        pageName: page
    });
  }
});

new AppRouter;

Backbone.history.start();