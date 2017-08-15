function init() {
  $("#bda-word-search__content").wordSearch({
    dificulty: 10,
    words: ['cultura', 'paz', 'mundo', ]
  })

  $('#bda-tab-container').easytabs({

    updateHash: false
  })

  $('#bda-tab-container-ver').easytabs({

    updateHash: false
  })

}
