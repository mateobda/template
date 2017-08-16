requirejs.config({
  baseUrl: "../common/",
  paths: {
    'jquery': 'vendors/jquery/jquery-1.11.1.min',
    'sg': 'vendors/sg/sg-1.5',
    'sg-jwframe': 'vendors/sg/sg.jwframe-1.4',
    'sg-attr-defaultPack': 'vendors/sg/sg.attr.defaultPack-1.2',
    'sg-attr-draggable': 'vendors/sg/sg.attr.draggable-1.2',
    'sg-tag-defaultPack': 'vendors/sg/sg.tag.defaultPack-1.5',
    'youtube-api': 'vendors/jquery/youtube_api',
    'jquery-ui': 'vendors/jquery/jquery-ui-1.10.4.custom.min',
    'jquery-bookblock': 'vendors/jquery/jquery.bookblock',
    'jquery-easytabs': 'vendors/jquery/jquery.easytabs.custom',
    'jquerypp': 'vendors/jquery/jquerypp.custom',
    'modernizer': 'vendors/jquery/modernizr.custom',
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
    'modernizer': {
      deps: ['jquery']
    },
    'youtube-api': {
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
  'youtube-api',
  'jquery-ui',
  'jquery-easytabs',
  'jquery-bookblock',
  'modernizer',
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
          speed: 800,
          perspective: 2000,
          shadowSides: 0.8,
          shadowFlip: 0.4,
          onEndFlip: (old, page, isLimit) => {
            current = page
            updateNavigation(isLimit)
            window.triggered = true
          }
        }),
        $navNext = $('#bb-nav-next'),
        $navPrev = $('#bb-nav-prev').addClass('off')

      function init() {
        itemsCount == 1 ? $navNext.addClass("off") : ""

        $navPrev.on('click touchstart', () => bb.prev())

        $navNext.on('click touchstart', () => {
          $('body').trigger('page-changed')
          bb.next()
          return false
        })
      }

      $(document).off('keydown').keydown((e) => {
        const keyCode = e.keyCode || e.which,
          arrow = {
            left: 37,
            up: 38,
            right: 39,
            down: 40
          }

        switch (keyCode) {
          case arrow.left:
            bb.prev()
            break
          case arrow.right:
            $('body').trigger('page-changed')
            bb.next()
            break
        }
      })

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
          success: function() {
            sg.sound("success")
            $(this).addClass('drag_bda')
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




      /*** Frases START ***/
      $(".validate-phrase").on("click", function() {
        const phrases = `.phrase-${$(this).data("group")}`
        let nphrases = $(phrases).length
        let respuestasCorrectas = 0
        $(phrases).each(function(index, value) {
          const t = $(this)
          let response = t.data("res")
          let inputUser = t.val()
          t.removeClass("success").removeClass("error")
          if (response == inputUser) {
            respuestasCorrectas++
            t.addClass("success")
          } else {
            t.addClass("error")
            t.val("")
          }
          if (respuestasCorrectas === nphrases) {
            t.addClass("success")
            $(".bda-bg-modal, .error-modal").addClass("hide")
            $(".bda-bg-modal, .success-modal").removeClass("hide")
          } else {
            $(".bda-bg-modal, .success-modal").addClass("hide")
            $(".bda-bg-modal, .error-modal").removeClass("hide")
          }
        })
      })
      $(".bda-bg-modal, .success-modal, .error-modal").click(function() {
        $(".success-modal").addClass("hide")
        $(".error-modal").addClass("hide")
        $(".bda-bg-modal").addClass("hide")
      })
      /*** Frases END ***/

      bb.jump(location.hash.substr(1))

      return {
        init: init
      }
    })()

    Page.init()
  })
})
