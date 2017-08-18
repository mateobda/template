function init() {
  $("#bda-word-search__content").wordSearch({
    dificulty: 8,
    words: ['cultura', 'paz']
  })

  $("#bda-word-search__content-1").wordSearch({
    dificulty: 8,
    words: ['hola', 'mundo']
  })

  $('#bda-tab-container').easytabs({
    updateHash: false
  })

  $('#bda-tab-container-ver').easytabs({
    updateHash: false
  })
}
