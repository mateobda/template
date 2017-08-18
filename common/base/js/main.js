requirejs.config({
  baseUrl: "../common/",
  paths: {
    'jquery': 'vendors/jquery/jquery-1.11.1.min',
    'sg': 'vendors/sg/sg-1.5',
    'sg-jwframe': 'vendors/sg/sg.jwframe-1.4',
    'sg-attr-defaultPack': 'vendors/sg/sg.attr.defaultPack-1.2',
    'sg-attr-draggable': 'vendors/sg/sg.attr.draggable-1.2',
    'sg-tag-defaultPack': 'vendors/sg/sg.tag.defaultPack-1.5',
    'jquery-ui': 'vendors/jquery/jquery-ui-1.10.4.custom.min',
    'jquery-bookblock': 'vendors/jquery/jquery.bookblock',
    'jquery-easytabs': 'vendors/jquery/jquery.easytabs.custom',
    'jquerypp': 'vendors/jquery/jquerypp.custom',
    'modernizr': 'vendors/jquery/modernizr.custom',
    'word_search': 'vendors/word_search/word_search'
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
    'sg-jwframe': {
      deps: ['jquery'],
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
  'jquery-ui',
  'jquery-easytabs',
  'jquery-bookblock',
  'modernizr',
  'word_search',
  'sg-jwframe',
  'sg-attr-defaultPack',
  'sg-attr-draggable',
  'sg-tag-defaultPack',
], function() {
  sg.setStage("#stage")
  sg.setScaleMode("showall")
  sg.setLoadingImage("../common/base/img/loader.gif")

  sg.init(function() {
    const $items = $('.bb-item'),
    count = $items.length

    window.triggered = false

    function getOutHeight(target) {
      let h = 0
      let $this = $(target)
      h = $this.height()
      h += $this.cssVal("padding-top") + $this.cssVal("padding-bottom")
      h += $this.cssVal("margin-top") + $this.cssVal("margin-bottom")
      h += $this.cssVal("border-top-width") + $this.cssVal("border-bottom-width")
      return h
    }

    function setInHeight(target, h) {
      let $this = $(target)
      let b = $this.cssVal('border-bottom-width')
      $this.css("min-height", h - (getOutHeight(target) - $this.height()) + b)
      $this.css("max-height", h - (getOutHeight(target) - $this.height()) + b)
    }

    function pagination(index, $element) {
      let paginationNumber = `<span>${index + 1}<span class="bda-pagination__line"> | </span>${count}</span>`,
      paginationContainer = $('<div class="bda-pagination">').html(paginationNumber)
      paginationContainer.appendTo($element)
    }

    setInHeight("#bb-bookblock", sg.stageHeight - getOutHeight("#content > header"));

    $items.each((index, element) => {
      let $element = $(element)
      pagination(index, $element)
    })

    var Page = (function() {
      var $bookBlock = $('#bb-bookblock'),
        $items = $bookBlock.children(),
        itemsCount = $items.length,
        current = 0,
        bb = $('#bb-bookblock').bookblock({
          speed: 600,
          perspective: 5000,
          shadowSides: 0.8,
          shadowFlip: 0.4,
          onEndFlip: (old, page, isLimit) => {
            current = page
            updateNavigation(isLimit)
            window.triggered = true
          }
        }),
        $navNext = $('#bb-nav-next'),
        $navPrev = $('#bb-nav-prev').addClass('off'),
        $successGames = '<div class="success-modal hide animated rubberBand"><span>&#10004;</span><strong>Felicitaciones, Presiona clic para continuar</strong></div><div class="bda-bg-modal hide animated fadeIn"></div>'

      function init() {
        itemsCount == 1 ? $navNext.addClass("off") : ""

        $navPrev.on('click touchstart', () => bb.prev())

        $navNext.on('click touchstart', () => {
          bb.next()
          return false
        })
      }

      function updateNavigation(isLastPage) {
        if (current === 0) {
          $navNext.removeClass('off')
          $navPrev.addClass('off')
        } else if (isLastPage) {
          $navNext.addClass('off')
          $navPrev.removeClass('off')
        } else {
          $navNext.removeClass('off')
          $navPrev.removeClass('off')
        }
      }

      // Video Begin
      function videoPlay($wrapper) {
        let $iframe = $wrapper.find('.bda-video__iframe')
        let src = $iframe.data('src')
        $wrapper.addClass('bda-video--active')
        $iframe.attr('src', src)
      }

      // function videoStop($wrapper) {
      //   if (!$wrapper) {
      //     let $wrapper = $('.bda-video__container')
      //     let $iframe = $('.bda-video__iframe')
      //   } else {
      //     let $iframe = $wrapper.find('.bda-video__iframe')
      //   }

      //   $wrapper.removeClass('bda-video--active')
      //   $iframe.attr('src', '')
      // }

      $(document).on('click', '.bda-video__image', function(event) {
        event.preventDefault()
        let $poster = $(this)
        let $wrapper = $poster.closest('.bda-video__container')
        videoPlay($wrapper)
      })
      // Video End

      // Drag & Drop Begin
      sg.setDraggable(
        ".drop", {
          success: function () {
            $(this).addClass('drag_bda')
            $(this).addClass('drag_bda--success')
            var nWords = $(this).siblings().length + 1
            var matches = $(this).siblings('.drag_bda--success').length + 1
            if (nWords === matches){
              $(this).closest(".bb-item").prepend($successGames)
              $(".bda-bg-modal, .success-modal").removeClass("hide")
            }
            $(".bda-bg-modal, .success-modal").click(function () {
              $(".success-modal").addClass("hide")
              $(".bda-bg-modal").addClass("hide")
            })
          },
          fail: function() {},
          revert: true
        }
      )
      // Drag & Drop End

      // PopUp Begin
      $('.bda-btn--popup').click(function() {
        let elementIndex = $(this).attr("data-pop")

        $(`#popup__container${elementIndex}`).css('display', 'block')
        $(`#popup__bg${elementIndex}`).css('display', 'block')
        $navPrev.addClass('off')
        $navNext.addClass('off')

        $(document).keydown(function(event) {
          if (event.keyCode == 27) {
            $(`#popup__container${elementIndex}`).css('display', 'none')
            $(`#popup__bg${elementIndex}`).css('display', 'none')
             if ((current + 1) == itemsCount) {
              updateNavigation(itemsCount - 1)
             } else {
              updateNavigation()
             }
          }
        })

        $(`#close${elementIndex}`).click(() => {
          $(`#popup__container${elementIndex}`).css('display', 'none')
          $(`#popup__bg${elementIndex}`).css('display', 'none')

           if ((current + 1) == itemsCount) {
            updateNavigation(itemsCount - 1)
           } else {
            updateNavigation()
           }
        })
      })
      // PopUp End

      $('.bda-btn-validate').click(function() {
        $(".bda-input-exercise").each(function(index, value) {
          const t = $(this)
          t.removeClass("ok").removeClass("err")
          let res = t.data("res")
          let respuesta = t.val()
          if (res == respuesta) {
            t.addClass("ok")
          } else {
            t.addClass("err")
          }
        })
      })

      bb.jump(location.hash.substr(1))

      return { init: init }
    })()

    Page.init()
  })
})
