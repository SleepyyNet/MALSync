import {pageInterface} from "./../pageInterface";

export const Kissanime: pageInterface = {
    name: 'kissanime',
    domain: 'http://kissanime.ru',
    database: 'Kissanime',
    type: 'anime',
    isSyncPage: function(url){
      if(typeof utils.urlPart(url, 5) != 'undefined'){
          if(j.$('#centerDivVideo').length){
              return true;
          }
      }
      return false;
    },
    sync:{
      getTitle: function(url){return Kissanime.sync.getIdentifier(url)},
      getIdentifier: function(url){return utils.urlPart(url, 4);},
      getOverviewUrl: function(url){return url.split('/').slice(0,5).join('/');},
      getEpisode: function(url){
        var episodePart = utils.urlPart(url, 5);
        var temp = [];
        temp = episodePart.match(/[e,E][p,P][i,I]?[s,S]?[o,O]?[d,D]?[e,E]?\D?\d{3}/);
        if(temp !== null){
            episodePart = temp[0];
        }
        temp = episodePart.match(/\d{3}/);
        if(temp === null){
            temp = episodePart.match(/\d{2,}\-/);
            if(temp === null){
                episodePart = 0;
            }else{
                episodePart = temp[0];
            }
        }else{
            episodePart = temp[0];
        }
        return episodePart;
      },
      nextEpUrl: function(url){return url.replace(/\/[^\/]*$/, '')+'/'+j.$('#selectEpisode option:selected').next().val();}
    },
    overview:{
      getTitle: function(){return j.$('.bigChar').first().text();},
      getIdentifier: function(url){return Kissanime.sync.getIdentifier(url)},
      uiSelector: function(selector){selector.insertAfter(j.$(".bigChar").first());},
      list:{
        elementsSelector: function(){return j.$(".listing tr")},
        elementUrl: function(selector){return utils.absoluteLink(selector.find('a').first().attr('href'), Kissanime.domain);},
        elementEp: function(selector){
          var url = Kissanime.overview!.list!.elementUrl(selector);
          if(/_ED/.test(url)) return NaN;
          return Kissanime.sync.getEpisode(url);
        },
      }
    },
    init(page){
      api.storage.addStyle(require('./style.less').toString());
      j.$(document).ready(function(){page.handlePage()});
    }
};
