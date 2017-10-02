$(document).on('click', '.btn-welcome-back', () => window.close())

$(document).on('click touchstart', 'html', () => {
  $('#sidebar, #content_ova').removeClass('on')
  $('.toogle-menu__item').addClass('off')
})

$(document).on('click touchstart', '#sidebar', function (e) {
  e.stopPropagation()
})

$(document).on('click', '.toogle-menu', () => {
  $('#sidebar, #content_ova').toggleClass('on')
  $('.toogle-menu__item').toggleClass('off')
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
    .then(data => navigationOVA(data))

    .catch(error => console.error(error))

  const buildMenu = jsonInfo => {
    jsonInfo.menu.content.forEach((value, index) => {

      const itemContent =
        `<li class="main-nav__item ${(value.order == 1) ? 'active' : ''}"><a href="" class="navigation" data-nav="content-${value.order}" data-ova="${value.link}">${value.title}</a></li>`
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
      $('.viewer_prev').removeClass('off')
    } else {
      $('.viewer_prev').addClass('off')
    }

    if (dataNav == `resume-${numRes}`) {
      $('.viewer_next').addClass('off')
    } else {
      $('.viewer_next').removeClass('off')
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

    $(document).on('click', '.main-nav__item', function () {
      $('.main-nav__item').removeClass('active')
      $(this).addClass('active')
      removeNavButtons(numRes)
    })

    $(document).on('click', '.viewer_next', () => {
      const conType = $('.active').children().data("nav").split("-")[0]
      const contNum = parseInt($('.active').children().data("nav").split("-")[1])

      if (((conType === 'content') && (contNum < numCont)) || ((conType === 'resume') && (contNum < numRes))) {
        $('.viewer_prev').removeClass('off')
        let theme = contNum + 1
        theme = conType + '-' + (theme)
        const file = `content/${$('.main-nav').find("[data-nav='"+ theme + "']").data("ova")}`

        $.get(file, (data, status) => $("#stage").html(data).promise().done(startPage()))

        $('.main-nav__item').removeClass('active')
        $('.main-nav').find("[data-nav='" + theme + "']").parent().addClass('active')
        if ((conType == 'resume') && (contNum == numRes - 1)) {
          $('.viewer_next').addClass('off')
        }

      } else if ((conType == 'content') && (contNum == numCont)) {
        var theme = 'resume-1'
        $('.viewer_next').addClass('off')
        $('.viewer_prev').removeClass('off')

        toggleArrowPrev()

        $('.main-nav__item').removeClass('active')
        $('.main-nav').find("[data-nav='" + theme + "']").parent().addClass('active')
        const file = `content/${$('.main-nav').find("[data-nav='" + theme + "']").data("ova")}`

        $.get(file, (data, status) => $("#stage").html(data).promise().done(startPage()))
      }
    })

    $(document).on('click', '.viewer_prev', () => {
      const conType = $('.active').children().data("nav").split("-")[0]
      const contNum = parseInt($('.active').children().data("nav").split("-")[1])

      if (((conType === 'content') && (contNum > 1))) {
        $('.viewer_next').removeClass('off')
        let theme = contNum - 1
        theme = conType + '-' + (theme)
        const file = `content/${$('.main-nav').find("[data-nav='"+ theme + "']").data("ova")}`

        $.get(file, (data, status) => $("#stage").html(data).promise().done(startPage()))

        $('.main-nav__item').removeClass('active')
        $('.main-nav').find("[data-nav='" + theme + "']").parent().addClass('active')
        if ((conType == 'content') && (contNum == 2)) {
          $('.viewer_prev').addClass('off')
        }

      } else if ((conType == 'resume') && (contNum == 1)) {
        var theme = 'content-' + numCont

        $('.viewer_next').removeClass('off')
        if (numCont == 1) {
          $('.viewer_prev').addClass('off')
        }

        toggleArrowNext()

        $('.main-nav__item').removeClass('active')
        $('.main-nav').find("[data-nav='" + theme + "']").parent().addClass('active')
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
  $('.toogle-menu__item').addClass('off')
})
