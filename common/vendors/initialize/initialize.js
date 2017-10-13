function startPage() {
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

    setInHeight(".bb-bookblock", sg.stageHeight - getOutHeight("#stage > header"));

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

      itemsCount == 1 ? $navNext.addClass("off") : ""

      $navPrev.on('click touchstart', () => {
        performAssets(bb.prev())
      })

      $navNext.on('click touchstart', () => {
        performAssets(bb.next())
        return false
      })

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

      // Iframe Begin
      $('iframe').each(function (index, value) {
        $(this).attr({
          allowfullscreen: 'allowfullscreen',
          mozallowfullscreen: 'mozallowfullscreen',
          msallowfullscreen: 'msallowfullscreen',
          oallowfullscreen: 'oallowfullscreen',
          webkitallowfullscreen: 'webkitallowfullscreen',
          scrolling: 'no',
          frameborder: '0'
        })

        if (!$(this).hasClass('bda-video__iframe')) {
          const srcIframe = $(this).attr('src')

          if ($(this).closest('.bb-item').attr('id') === 'item1') {
            $(this).attr('data-src', srcIframe)
          } else {
            $(this).attr({
              'src': '',
              'data-src': srcIframe
            })
          }
        }
      })
      // Iframe End

      // Images Begin
      $('img').wrap('<div class="zoom-images"></div>')

      $('img').on('click', function () {
        const srcImage = $(this).attr('src')
        const itemClosest = $(this).closest('.bb-item')
        const widthImage = $(this)[0].naturalWidth
        const heightImage = $(this)[0].naturalHeight
        const ratio = widthImage / heightImage
        const dif = 1 - ratio

        if ($(this).parents('.popup__container').length == 0) {
          var closeFlag = 'close_zoom'
        } else {
          closeFlag = 'close_zoom_popup'
        }

        if (dif > 0.1) {
          itemClosest.append(`<div class="zoom-vertical animated fadeIn remove-zoom"><div><img src="${srcImage}"></div><span class="${closeFlag}">X</span></div>`)
          $('.popup__bg').removeClass('hide')

        } else {
          itemClosest.append(`<div class="zoom-horizontal animated fadeIn remove-zoom"><img src="${srcImage}"><span class="${closeFlag}">X</span></div>`)
          $('.popup__bg').removeClass('hide')
        }

        $(document).on('keydown', (keyword) => {
          if (keyword.which === 27) {
            $('.remove-zoom').remove()
            $('.popup__bg').addClass('hide')
            $('.popup__container').addClass('hide')
          }
        })
      })

      $(document).on('click', '.popup__bg', () => {
        $('.remove-zoom').remove()
        $('.popup__bg').addClass('hide')
        $('.popup__container').addClass('hide')
      })

      $(document).on('click', '.close_zoom', () => {
        $('.popup__bg').addClass('hide')
        $('.remove-zoom').remove()
      })

      $(document).on('click', '.close_zoom_popup', () => {
        $('.remove-zoom').remove()
      })

      $('img').on('mouseover', function () {
        const height = $(this)[0].height
        const width = $(this)[0].width
        $(this).css('opacity', '0.4')
        $(this).before(`<div class="hoverimages" style="height:${height}px; width: ${width}px"><span><i class="icon-clic"></i><strong>Haz clic aquí</strong></span></div>`)
      })

      $(document).on('mouseout', 'img', function () {
        $(this).css('opacity', '1')
        $('.hoverimages').remove()
      })
      // Images End

      // Audio image
      $('.btn--sound').on('click', function () {
        const currentAudio = $(this).find('audio')[0]
        let check

        $('.btn--sound').each(function (k, v) {
          const currentChecked = $(this).find('audio')[0]
          if (currentChecked.paused) {
            check = true
          } else {
            check = false
            return check
          }
        })

        if (check) {
          currentAudio.play()

          $(this).next('.text-audio').slideDown()
        } else {
          currentAudio.pause()
        }
      })
      // End Audio image

      // Show content
      $('.btn--show').on('click', function () {
        $(this).siblings('div').slideDown()
      })
      // End Show content

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
              $(".bda-game__error").addClass("hide")
            }

            closeBgWin()
          },
          fail: function () {},
          revert: true
        }
      )
      // Drag & Drop End

      // PopUp Begin
      $('.bda-btn--popup').on('click', function () {
        let elementIndex = $(this).attr("data-pop")
        const container = $(`#popup__container${elementIndex}`)
        var video = container.find('.bda-video__iframe')
        var iframe = container.find('iframe')

        if ($(this).hasClass('creative-commons')) {
          $('.popup__bg').addClass('hide')
        } else {
          $('.popup__bg').removeClass('hide')
        }

        container.removeClass('hide')

        if (!iframe.hasClass('bda-video__iframe')) {
          iframe.attr('src', iframe.data('src'))
        }

        $(document).keydown(function (event) {
          if (event.keyCode == 27) {
            container.addClass('hide')
            $('.popup__bg').addClass('hide')

            if (video.hasClass("bda-video__iframe")) {
              video.parent().removeClass('bda-video--active')
              video.attr("src", '')
            }

            iframe.attr('src', '')
          }
        })

        $('.popup__close, .popup__bg').on('click', () => {
          container.addClass('hide')
          $('.popup__bg').addClass('hide')

          $('.creative-commons').removeClass('hide')

          if (video.hasClass("bda-video__iframe")) {
            video.parent().removeClass('bda-video--active')
            video.attr("src", '')
          }

          iframe.attr('src', '')
        })
      })
      // PopUp End

      // fullscreen video popup Begin
      function videoFullScreen(e) {
        if (document.fullscreenEnabled || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
          $('.popup__bg, .bda-main-nav span, .bda-pagination, .toogle-menu, .creative-commons, .bda-guide').css('z-index', '-1')
          console.log("Entra a fullscreen")
        } else {
          $('.popup__bg').css('z-index', '2')
          $('.bda-main-nav span, .bda-pagination, .toogle-menu, .bda-guide').css('z-index', '1')
          $('.creative-commons').css('z-index', '')
          console.log("Sale de fullscreen")
        }
      }

      document.addEventListener("fullscreenchange", videoFullScreen, false)
      document.addEventListener("webkitfullscreenchange", videoFullScreen, false)
      document.addEventListener("mozfullscreenchange", videoFullScreen, false)
      // fullscreen video popup End

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
            $(".bda-game__modal, .bda-game__error").addClass("hide")
            $(".bda-game__modal, .bda-game__win").removeClass("hide")

          } else {
            $(".bda-game__modal, .bda-game__win").addClass("hide")
            $(".bda-game__modal, .bda-game__error").removeClass("hide")
          }
        })
      })

      closeBgWin()
      // Frases End

      //Add target: blank to links in creative-commons
      $('.popup__content--cc').children('a').attr('target', '_blank')
      // End Add target blank

      // Begin Pagination
      var pg = {}

      $('.pagination').on('click', function () {
        const npag = $(this).parent().children('.page').length
        let id = $(this).parent().attr("id")

        pg[id] = !pg.hasOwnProperty(id) ? 1 : pg[id]
        $(this).parent().children('.page').addClass('hide')

        if ($(this).hasClass("btn-next")) {
          pg[id]++
            $(this).parent().children(`.page${pg[id]}`).removeClass('hide')

          if (pg[id] > 1) $(this).parent().children('.btn-back').removeClass('hide')

          if (pg[id] === npag) $(this).parent().children('.btn-next').addClass('hide')
        } else {
          pg[id]--
            $(this).parent().children(`.page${pg[id]}`).removeClass('hide')

          if (pg[id] === 1) $(this).parent().children('.btn-back').addClass('hide')

          if (pg[id] < npag) $(this).parent().children('.btn-next').removeClass('hide')
        }
      })
      // End Pagination

      // Begin Multiple options
      $('.validate-multiple').click(function () {
        const $test = $(this).closest('.multiple-test')
        const $nquestions = $test.find('.multiple-question').length
        console.log($nquestions)
        const $radios = $test.find('.multiple-answers li input')
        $radios.attr('disabled', true)
        const $selected = $test.find('input:checked')
        if ($selected.length < $nquestions) {
          $('.warning').html(
            '<p style="color: red">Debes seleccionar al menos una respuesta para cada pregunta, presiona "corregir" para continuar.</p>'
          )
        } else {
          $selected.each(function (value, index) {
            const $option = $(this).parent()
            $option.hasClass('correct-answer') ? $option.addClass('correct') : $option.addClass('incorrect')
          })
        }
        const $ncorrect = $('.correct').length
        if (($ncorrect < $nquestions) && ($selected.length == $nquestions)) {
          $('.warning').html('<p style="color: red">Para corregir tus respuestas, haz click en "corregir".</p>')
        }
      })

      $('.try-again').click(function () {
        $('.warning').html('')
        const $test = $(this).closest('.multiple-test')
        const $options = $test.find('.multiple-answers li')
        const $radios = $test.find('.multiple-answers li input')
        console.log($radios)
        $options.removeClass('correct')
        $options.removeClass('incorrect')
        $radios.attr('disabled', false)
        $radios.attr('checked', false)
      })
      // End Multiple options

      bb.jump(location.hash.substr(1))
    })()
  })
}
