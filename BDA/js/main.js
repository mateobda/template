function init() {
  $("#bda-word-search__content").wordSearch({
    dificulty: 8,
    words: ['cultura', 'paz']
  })

  $("#bda-word-search__content--modal").wordSearch({
    dificulty: 8,
    words: ['hola', 'mundo']
  })

  $('#bda-tab-container').easytabs()

  $('#bda-tab-container--number').easytabs()

  $('#bda-tab-container-ver').easytabs()
}
