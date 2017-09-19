requirejs.config({
  baseUrl: "common/",
  paths: {
    'jquery': 'vendors/jquery/jquery-1.11.1.min',
    'sg': 'vendors/sg/sg-1.5',
    'sg-attr-defaultPack': 'vendors/sg/sg.attr.defaultPack-1.2',
    'sg-attr-draggable': 'vendors/sg/sg.attr.draggable-1.2',
    'sg-tag-defaultPack': 'vendors/sg/sg.tag.defaultPack-1.5',
    'jquery-ui': 'vendors/jquery/jquery-ui-1.10.4.custom.min',
    'jquery-touch-punch': 'vendors/jquery/jquery.ui.touch-punch.min',
    'jquery-bookblock': 'vendors/jquery/jquery.bookblock',
    'jquery-easytabs': 'vendors/jquery/jquery.easytabs.custom',
    'jquerypp': 'vendors/jquery/jquerypp.custom',
    'modernizr': 'vendors/jquery/modernizr.custom',
    'word_search': 'vendors/word_search/word_search',
    'initialize': 'vendors/initialize/initialize'
  },
  waitSeconds: 0,
  /*
  shim:
  AMD: http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
  */
  shim: {
    'jquery-ui': {
      deps: ['jquery']
    },
    'jquery-touch-punch': {
      deps: ['jquery', 'jquery-ui']
    },
    'jquery-easytabs': {
      deps: ['jquery']
    },
    'modernizr': {
      deps: ['jquery']
    },
    'jquery-bookblock': {
      deps: ['jquerypp', 'jquery']
    },
    'jquerypp': {
      deps: ['jquery']
    },
    'word_search': {
      deps: ['jquery']
    },
    'sg': {
      deps: ['jquery'],
      exports: "sg"
    },   
    'sg-attr-defaultPack': {
      deps: ['sg']
    },
    'sg-attr-draggable': {
      deps: ['sg', 'jquery-ui']
    },
    'sg-tag-defaultPack': {
      deps: ['jquery'],
      exports: "sg"
    },
    'initialize': {
      deps: ['jquery', 'sg', 'jquery-bookblock'],
      exports: "init_all"
    }
  }
});

require([
  'jquery',
  'sg',
  'jquery-ui',
  'jquery-touch-punch',
  'jquery-easytabs',
  'jquery-bookblock',
  'modernizr',
  'word_search',
  'sg-attr-defaultPack',
  'sg-attr-draggable',
  'sg-tag-defaultPack',
  'initialize',
], function() {
  sg.setStage("#content_ova")
  sg.setScaleMode("showall")
  sg.setLoadingImage("common/base/img/loader.gif")
   
  startPage()
})