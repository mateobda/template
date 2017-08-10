requirejs.config({
  baseUrl: "../common/",
  paths: {
    'jquery': 'vendors/jquery/jquery-1.11.1.min',
    'sg': 'vendors/sg/sg-1.5',
    'sg-jwframe': 'vendors/sg/sg.jwframe-1.4',
    'sg-attr-defaultPack': 'vendors/sg/sg.attr.defaultPack-1.2',
    'sg-attr-draggable': 'vendors/sg/sg.attr.draggable-1.2',
    'sg-tag-defaultPack': 'vendors/sg/sg.tag.defaultPack-1.5',
    'youtube-api' : 'vendors/jquery/youtube_api',
    'jquery-ui' : 'vendors/jquery/jquery-ui-1.10.4.custom.min',
    'jquery-bookblock' : 'vendors/jquery/jquery.bookblock',
    'jquery-easytabs' : 'vendors/jquery/jquery.easytabs.custom',
    'jquerypp': 'vendors/jquery/jquerypp.custom',
    'modernizer': 'vendors/jquery/modernizr.custom'
  },
  waitSeconds: 0,
  /*
  shim:
  AMD: http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
  */
  shim: {
    'jquery-ui':{
      deps:['jquery']
    },
    'jquery-easytabs':{
      deps:['jquery']
    },
    'modernizer': {
      deps:['jquery']
    },
    'youtube-api':{
      deps:['jquery']
    },
    'jquery-bookblock':{
      deps:['jquerypp', 'jquery']
    },
    'jquerypp':{
      deps:['jquery']
    },
    'sg':{
      deps:['jquery'],
      exports: "sg"
    },
    'sg-jwframe':{
      deps:['jquery'],
      exports: "sg-jwframe"
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
    }
  }
});

require([
  'jquery',
  'sg',
  'youtube-api',
  'jquery-ui',
  'jquery-easytabs',
  'jquery-bookblock',
  'modernizer',
  'sg-jwframe',
  'sg-attr-defaultPack',
  'sg-attr-draggable',
  'sg-tag-defaultPack',
], function () {
  sg.setStage( "#stage" )
  sg.setScaleMode( "showall" )
  sg.setLoadingImage( "../common/base/img/loader.gif" )

  sg.init(function () {
    function getOutHeight (target) {
      var h = 0
      console.log(target);
      var $this = $(target)
      h = $this.height()
      h += $this.cssVal("padding-top") + $this.cssVal("padding-bottom")
      h += $this.cssVal("margin-top") + $this.cssVal("margin-bottom")
      h += $this.cssVal("border-top-width") + $this.cssVal("border-bottom-width")
      return h
    }

    function setInHeight (target, h) {
      var $this = $( target )
      var b = $this.cssVal('border-bottom-width')
      $this.css("min-height", h - (getOutHeight( target ) - $this.height()) + b)
      $this.css("max-height", h - (getOutHeight( target ) - $this.height()) + b)
    }

    function pagination (index, $element) {
      let paginationNumber = `<span>${index + 1}<span class="eslas"> | </span>${count}</span>`,
      paginationContainer = $('<div class="ipt-pagenumer">').html(paginationNumber)
      paginationContainer.appendTo($element)
    }

    const $items = $('.bb-item'),
    count = $items.length

    setInHeight( ".bda-container", sg.stageHeight - getOutHeight( "#content > header" ) );

    $items.each((index, element) => {
      let $element = $(element)
      pagination(index, $element)
    })
  })
})
