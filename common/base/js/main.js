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
    'jquery-touch-punch': 'vendors/jquery/jquery.ui.touch-punch.min',
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
  'jquery-touch-punch',
  'jquery-easytabs',
  'jquery-bookblock',
  'modernizr',
  'word_search',
  'sg-jwframe',
  'sg-attr-defaultPack',
  'sg-attr-draggable',
  'sg-tag-defaultPack',
], function () {
  sg.setStage("#stage")
  sg.setScaleMode("showall")
  sg.setLoadingImage("../common/base/img/loader.gif")

  sg.init(function () {
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

    setInHeight(".bb-bookblock", sg.stageHeight - getOutHeight("#content > header"));

    $items.each((index, element) => {
      let $element = $(element)
      pagination(index, $element)
    })

    var Page = (function () {

      var $items = $('.bb-item'),
      itemsCount = $items.length,
      current = 0,
      bb = $('.bb-bookblock').bookblock({
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
      $successGames = '<div class="bda-game__message bda-game__win hide animated fadeIn"><strong>¡Felicitaciones!</strong><span>Haz clic para continuar</span></div><div class="bda-game__modal hide animated fadeIn"></div>'

      function init() {
        itemsCount == 1 ? $navNext.addClass("off") : ""

        $navPrev.on('click touchstart', () => {
          performAssets(bb.prev())
        })

        $navNext.on('click touchstart', () => {
          performAssets(bb.next())
          return false
        })
      }

      function performAssets(orientation) {
        $(orientation.origin).find("iframe").each((k, v) => {
          if ($(v).hasClass("bda-video__iframe")) {
            $(v).parent().removeClass('bda-video--active')
            $(v).attr("src", "")
          } else {
            $(v).attr("src", "")
          }
        })

        $(orientation.destination).find("iframe").each((k, v) => {
          if (!$(v).hasClass("bda-video__iframe")) {
            $(v).attr("src", $(v).data("src"))
          }
        })

        $(orientation.destination).find("img").each((k, v) => {
          if ($(v).data('src') != undefined) {
            $(v).attr('src', $(v).data('src'))
          }
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

      function closeBgWin() {
        $(".bda-game__modal, .bda-game__message").on('click', () => {
          $(".bda-game__modal").addClass("hide")
          $(".bda-game__message").addClass("hide")
        })
      }

      // Video Begin
      function videoPlay($wrapper) {
        let $iframe = $wrapper.find('.bda-video__iframe')
        let src = $iframe.data('src')
        $wrapper.addClass('bda-video--active')
        $iframe.attr('src', src)
      }

      $(document).on('click', '.bda-video__image', function (event) {
        event.preventDefault()
        let $poster = $(this)
        let $wrapper = $poster.closest('.bda-video__container')
        videoPlay($wrapper)
      })
      // Video End

      // Iframe fullscreen Begin
      $('iframe').attr({
        allowfullscreen: 'allowfullscreen',
        mozallowfullscreen: 'mozallowfullscreen',
        msallowfullscreen: 'msallowfullscreen',
        oallowfullscreen: 'oallowfullscreen',
        webkitallowfullscreen: 'webkitallowfullscreen',
        scrolling: 'no',
        frameborder: '0'
      })
      // Iframe fullscreen End

      // Drag & Drop Begin
      sg.setDraggable(
        ".drag-and-drop__item-drop", {
          success: function () {
            $(this).addClass('drag-and-drop__item--success')

            var nWords = $(this).siblings().length + 1
            var matches = $(this).siblings('.drag-and-drop__item--success').length + 1

            if (nWords === matches) {
              $(this).closest(".bb-item").prepend($successGames)
              $(".bda-game__modal, .bda-game__message").removeClass("hide")
            }

            closeBgWin()
          },
          fail: function () {},
          revert: true
        }
      )
      // Drag & Drop End

      // PopUp Begin
      $('.bda-btn--popup').click(function () {
        let elementIndex = $(this).attr("data-pop")
        const container = $(`#popup__container${elementIndex}`)
        var video = container.find('.bda-video__iframe')
        var iframe = container.find('iframe')

        if($(this).hasClass('creative-commons')) {
          $('.popup__bg').addClass('hide')
        } else {
          $('.popup__bg').removeClass('hide')
        }

        container.removeClass('hide')
        iframe.attr('src', iframe.data('src'))

        $(document).keydown(function (event) {
          if (event.keyCode == 27) {
            container.addClass('hide')
            $('.popup__bg').addClass('hide')
          }
        })

        $('.popup__close').on('click', () => {
          container.addClass('hide')
          $('.popup__bg').addClass('hide')

          $('.creative-commons').removeClass('hide')

          if (video.hasClass("bda-video__iframe")) {
            video.parent().removeClass('bda-video--active')
            video.attr("src", "")
          }

          iframe.attr('src', '')
        })
      })
      // PopUp End

      // Frases Begin
      $(".bda-phrases__button-validate").on("click", function () {
        const phrases = `.phrase-${$(this).data("group")}`
        let nphrases = $(phrases).length
        let respuestasCorrectas = 0

        $(phrases).each(function (index, value) {
          const t = $(this)
          let response = t.data("res")
          let inputUser = t.val()

          t.removeClass("bda-phrases__input--success").removeClass("bda-phrases__input--error")

          if (response == inputUser) {
            respuestasCorrectas++
            t.addClass("bda-phrases__input--success")
          } else {
            t.addClass("bda-phrases__input--error")
            t.val("")
          }

          if (respuestasCorrectas === nphrases) {
            t.addClass("bda-phrases__input--success")
            $navPrev.addClass('off')
            $navNext.addClass('off')
            $(".bda-game__modal, .bda-game__error").addClass("hide")
            $(".bda-game__modal, .bda-game__win").removeClass("hide")

          } else {
            $navPrev.addClass('off')
            $navNext.addClass('off')
            $(".bda-game__modal, .bda-game__win").addClass("hide")
            $(".bda-game__modal, .bda-game__error").removeClass("hide")
          }
        })
      })

      closeBgWin()
      // Frases End

      bb.jump(location.hash.substr(1))

      return {
        init: init
      }
    })()

    Page.init()
  })
})
