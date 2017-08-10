function init() {
  window.triggered = false

  var Page = (function () {
    var $container = $('.content-container'),
    $bookBlock = $('#bb-bookblock'),
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
    $navPrev = $('#bb-nav-prev').addClass('off'),
    $navFirst = $('#bb-nav-first').addClass('off'),
    $navLast = $('#bb-nav-last')

    function init() {
      itemsCount == 1 ? $navNext.addClass("off") : ""

      $navPrev.on('click touchstart', () => bb.prev())

      $navNext.on('click touchstart', () => {
        $('body').trigger('page-changed')
        bb.next()
        return false
      })

      $navFirst.on('click touchstart', () => {
        bb.jump(1)
        return false
      })
    }

    $(document).off('keydown').keydown((e) => {
      const keyCode = e.keyCode || e.which,
      arrow = { left: 37, up: 38, right: 39, down: 40 }

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
        $navFirst.addClass('off')
        $navLast.removeClass('off')
      } else if (isLastPage) {
        $navNext.addClass('off')
        $navLast.addClass('off')
        $navPrev.removeClass('off')
        $navFirst.removeClass('off')
      } else {
        $navNext.removeClass('off')
        $navPrev.removeClass('off')
        $navLast.removeClass('off')
        $navFirst.removeClass('off')
      }
    }

    /* Video Begin */
      function videoPlay($wrapper) {
        var $iframe = $wrapper.find('.js-videoIframe')
        var src = $iframe.data('src')
        $wrapper.addClass('videoWrapperActive')
        $iframe.attr('src', src)
      }

      function videoStop($wrapper) {
        if (!$wrapper) {
          var $wrapper = $('.js-videoWrapper')
          var $iframe = $('.js-videoIframe')
        } else {
          var $iframe = $wrapper.find('.js-videoIframe')
        }
        $wrapper.removeClass('videoWrapperActive')
        $iframe.attr('src', '')
      }

      $(document).on('click', '.js-videoPoster', function (ev) {
        ev.preventDefault()
        var $poster = $(this)
        var $wrapper = $poster.closest('.js-videoWrapper')
        videoPlay($wrapper)
      })
    /* Video End */

    /* Drag & Drop Begin */
      sg.setDraggable(
        ".drop", {
          success: function () {
            sg.sound("success")
            $(this).addClass('drag_bda')
          },
          fail: function () {},
          revert: true
        }
      )
    /* Drag & Drop End */

    /* PopUp Begin */
      $('.bda-btn-popup').click(function () {
        let elementIndex = $(this).attr("data-pop")

        $(`#popup__container${elementIndex}`).css('display', 'block')
        $(`#popup__bg${elementIndex}`).css('display', 'block')

        $(document).keydown(function (event) {
          if (event.keyCode == 27) {
            $(`#popup__container${elementIndex}`).css('display', 'none')
            $(`#popup__bg${elementIndex}`).css('display', 'none')
          }
        })

        $(`#close${elementIndex}`).click(() => {
          $(`#popup__container${elementIndex}`).css('display', 'none')
          $(`#popup__bg${elementIndex}`).css('display', 'none')
        })
      })
    /* PopUp End */

    $('#bda-tab-container').easytabs({
      animate: false,
      updateHash: false
    })

    $('.bda-btn-validate').click(function () {
      $(".bda-input-exercise").each(function (index, value) {
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
}
