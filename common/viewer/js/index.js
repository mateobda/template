$(document).on('click', '.btn-welcome-back', () => window.close())

$(document).on('click touchstart', 'html', () => {
  $('#sidebar, #content_ova').removeClass('on')
  $('.toogle-menu__item').addClass('hide')
})

$(document).on('click touchstart', '#sidebar', function (e) {
  e.stopPropagation()
})

$(document).on('click', '.toogle-menu', () => {
  $('#sidebar, #content_ova').toggleClass('on')
  $('.toogle-menu__item').toggleClass('hide')
})

$(document).on('click', '.main-nav__tab', function () {
  $(this).toggleClass('on')
  $(this).next().toggleClass('on')
})

$(document).on('ready', () => {
  fetch('content/navigation.json')
  .then(data => data.json())
  .then(data => {
    buildMenu(data)

    const firstContent = `content/${$('.main-nav').find("[data-nav='content-1']").data("ova")}`
    $.get(firstContent, (data, status) => $("#stage").html(data))

    return data
  })
  .then(data => {
    navigationOVA(data)
  })
  .catch(error => {
    console.error(error)
  })

  const buildMenu = jsonInfo => {
    jsonInfo.menu.content.forEach((value, index) => {

      const itemContent =
      `<li class="main-nav__item ${(value.order == 1) ? 'fa active' : ''}"><a href="" class="navigation" data-nav="content-${value.order}" data-ova="${value.link}">${value.title}</a></li>`
      $('.content-tab').append(itemContent)
    })

    jsonInfo.menu.resume.forEach((value, index) => {
      const itemResume =
      `<li class="main-nav__item"><a href="" class="navigation" data-nav="resume-${value.order}" data-ova="${value.link}">${value.title}</a></li>`
      $('.resume-tab').append(itemResume)
    })
  }

  const removeNavButtons = numRes => {
    let dataNav = $('.main-nav__item.active').children('.navigation').data("nav")
    const conType = $('.active').children().data("nav").split("-")[0]
    const contNum = parseInt($('.active').children().data("nav").split("-")[1])

    if (dataNav !== "content-1") {
      $('.fa-arrow-left').parent().removeClass('hide')
    } else {
      $('.fa-arrow-left').parent().addClass('hide')
    }

    if (dataNav == `resume-${numRes}`) {
      $('.fa-arrow-right').parent().addClass('hide')
    } else {
      $('.fa-arrow-right').parent().removeClass('hide')
    }
  }

  const toggleArrowNext = () => {
    $('.content-tab').prev().addClass('on')
    $('.content-tab').addClass('on')
  }

  const toggleArrowPrev = () => {
    $('.resume-tab').prev().addClass('on')
    $('.resume-tab').addClass('on')
  }

  const navigationOVA = function (jsonInfo) {
    const numCont = jsonInfo.menu.content.length
    const numRes = jsonInfo.menu.resume.length

    $(document).on('click touchstart', '.main-nav__item', function () {
      $('.main-nav__item').removeClass('active fa')
      $(this).addClass('active fa')
      removeNavButtons(numRes)
    })

    $(document).on('click touchstart', '.viewer_next', function () {
      const conType = $('.active').children().data("nav").split("-")[0]
      const contNum = parseInt($('.active').children().data("nav").split("-")[1])

      if (((conType === 'content') && (contNum < numCont)) || ((conType === 'resume') && (contNum < numRes))) {
        $('.fa-arrow-left').parent().removeClass('hide')
        let theme = contNum + 1
        theme = conType + '-' + (theme)
        const file = `content/${$('.main-nav').find("[data-nav='"+ theme + "']").data("ova")}`

        $.get(file, (data, status) => $("#stage").html(data).promise().done(startPage()))

        $('.main-nav__item').removeClass('active fa')
        $('.main-nav').find("[data-nav='" + theme + "']").parent().addClass('active fa')
        if ((conType == 'resume') && (contNum == numRes - 1)) {
          $('.fa-arrow-right').parent().addClass('hide')
        }

      } else if ((conType == 'content') && (contNum == numCont)) {
        var theme = 'resume-1'
        $('.fa-arrow-right').parent().addClass('hide')
        $('.fa-arrow-left').parent().removeClass('hide')

        toggleArrowPrev()

        $('.main-nav__item').removeClass('active fa')
        $('.main-nav').find("[data-nav='" + theme + "']").parent().addClass('active fa')
        const file = `content/${$('.main-nav').find("[data-nav='" + theme + "']").data("ova")}`

        $.get(file, (data, status) => $("#stage").html(data).promise().done(startPage()))
      }
    })

    $(document).on('click touchstart', '.viewer_prev', function () {
      const conType = $('.active').children().data("nav").split("-")[0]
      const contNum = parseInt($('.active').children().data("nav").split("-")[1])

      if (((conType === 'content') && (contNum > 1)) ) {
          $('.fa-arrow-right').parent().removeClass('hide')
          let theme = contNum - 1
          theme = conType + '-' + (theme)
          const file = `content/${$('.main-nav').find("[data-nav='"+ theme + "']").data("ova")}`

          $.get(file, (data, status) => $("#stage").html(data).promise().done(startPage()))

          $('.main-nav__item').removeClass('active fa')
          $('.main-nav').find("[data-nav='" + theme + "']").parent().addClass('active fa')
          if ((conType == 'content') && (contNum == 2)) {
            $('.fa-arrow-left').parent().addClass('hide')
          }

        } else if ((conType == 'resume') && (contNum == 1)) {
          var theme = 'content-' + numCont

          $('.fa-arrow-right').parent().removeClass('hide')
          if (numCont==1) {
            $('.fa-arrow-left').parent().addClass('hide')
          }

          toggleArrowNext()

          $('.main-nav__item').removeClass('active fa')
          $('.main-nav').find("[data-nav='" + theme + "']").parent().addClass('active fa')
          const file = `content/${$('.main-nav').find("[data-nav='" + theme + "']").data("ova")}`

          $.get(file, (data, status) => $("#stage").html(data).promise().done(startPage()))
        }
      })
    }
  })

  $(document).on("click", ".navigation", function (e) {
    e.preventDefault()
    const file = `content/${$(this).data("ova")}`

    $.get(file, (data, status) => $("#stage").html(data).promise().done(startPage()))

    $('#sidebar, #content_ova').removeClass('on')
    $('.toogle-menu__item').addClass('hide')
  })
