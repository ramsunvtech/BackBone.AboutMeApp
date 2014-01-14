// Here the list of Underscore Mixin Functions and Custom Properties.

_.mixin({

  initTplBuffer: function() {
    _.tplBuffer = [];
  }(),

  tpl: function (tplObj, tpl, tplVars) {
    var compiledTpl = _.template(tpl, tplVars, {
      variable: tplObj
    });
    return compiledTpl;
  },

  subTpl: function (tplObj, tpl, tplVars) {
    var compiledTpl = _.tpl(tplObj, tpl, tplVars);
    _.tplBuffer.push({
      "id": tplObj,
      "compiledTpl": compiledTpl
    });
  },

  recursiveTpl: function (tplObj, tpl, tplVars) {
    var tplBuffer = _.tplBuffer;
    if(_.isArray(tplBuffer)) {
      for(index in tplBuffer) {
        if(_.isObject(tplVars)) {
          var tplId = tplBuffer[index].id,
            tplData = tplBuffer[index].compiledTpl;
          tplVars[tplId] = tplData;
        }
      }
    }
    var compiledTpl = _.tpl(tplObj, tpl, tplVars);
    return compiledTpl;
  }

});