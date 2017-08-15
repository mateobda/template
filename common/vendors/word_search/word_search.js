﻿var cfin = 0;

(function ($) {
  oWs = function ($el, options) {

    var idElement = $el.attr("id")
    var successWord = 0
    var miradorpalabras = ""
    var miserrores = 0
    var dejapasar = false


    $t = $("<table>")
    var palabrasencontradas = new Array()

    $.extend(options)
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    this.init = function () {
      var contadorpalabras = 0
      var comienzoy = Math.floor((Math.random() * (options.dificulty + 0)) + 0)
      var comienzoyar = new Array()

      options.words.forEach((element, index) => {
        while (true) {
          var cc = Math.floor((Math.random() * (options.dificulty + 0)) + 0)
          var existe = false

          options.words.forEach((element, index) => {
            if (comienzoyar[j] == cc) existe = true
          })

          if (!existe) {
            comienzoyar[index] = cc
            break
          }
        }
      })

      comienzoyar = comienzoyar.sort((a, b) => a - b)

      var totalvertical = options.words.length / 2

      if (totalvertical > 2) totalvertical = totalvertical - 1

      for (var j = 0; j < options.dificulty + 1; j++) {
        $header = $("<tr>")
        var contadorletras = 0
        var comienzox = Math.floor((Math.random() * (options.dificulty + 2)) - 1)
        var enquepos = 0

        if (j == comienzoyar[contadorpalabras]) {
          enquepos = (options.dificulty + 1 - options.words[contadorpalabras].length)
          enquepos = Math.floor((Math.random() * enquepos))
        }

        if (enquepos == -1) enquepos = 0

        for (var i = 0; i < options.dificulty + 1; i++) {
          var pos = Math.floor((Math.random() * (options.dificulty + 3)) - 1)
          var letraelegidapos = Math.floor(Math.random() * 14)
          var $g = this

          if (pos == -1) pos = 0

          if (comienzoy == -1) comienzoy = 0

          if (comienzox == -1) comienzox = 0

          if (comienzoyar[contadorpalabras] == j) {
            //Aca pongo las palabras que vienen de la DB.
            if (enquepos == i) {

              if (contadorletras < options.words[contadorpalabras].length) {
                $("<td>").attr("nocruzar", "S").html(options.words[contadorpalabras].charAt(contadorletras)).appendTo($header).attr("pos", i.toString() + ";" + j.toString()).click(function () {
                  $g.click(this)
                }).addClass("noes")
                contadorletras++
                enquepos++

              } else {
                $("<td>").attr("nocruzar", "F").html(letters[letraelegidapos]).appendTo($header).attr("pos", i.toString() + ";" + j.toString()).click(function () {
                  $g.click(this)
                }).addClass("noes")

              }
            } else {
              $("<td>").attr("nocruzar", "F").html(letters[letraelegidapos]).appendTo($header).attr("pos", i.toString() + ";" + j.toString()).click(function () {
                $g.click(this)
              }).addClass("noes")

            }
          } else {
            $("<td>").attr("nocruzar", "F").html(letters[letraelegidapos]).appendTo($header).attr("pos", i.toString() + ";" + j.toString()).click(function () {
              $g.click(this)
            }).addClass("noes")
          }
        }

        $t.append($header)
        $el.append($t)

        if (j == comienzoyar[contadorpalabras]) {
          if (contadorpalabras < totalvertical) contadorpalabras++
        }
      }

      var posy = Math.floor((Math.random() * (options.dificulty + 2)) - 1)
      var posx = Math.floor((Math.random() * (options.dificulty + 2)) - 1)
      var total = 0

      if (posy == -1) posy = 0

      if (posx == -1) posx = 0

      var caminadorvertical = contadorpalabras + 1

      for (var v = caminadorvertical; v < options.words.length; v++) {
        var pospalabra = 0
        var posyv = 0

        while (true) {

          if ((posy + options.words[v].length) < options.dificulty) {
            posyv = posy

            for (var i = 0; i < options.words[v].length; i++) {
              if ($("td[pos='" + posx.toString() + ";" + posyv.toString() + "']").attr("nocruzar") == "S") {
                total++
                break
              }

              posyv++
            }

          } else {
            total = 1
          }

          if (total > 0) {
            posy = Math.floor((Math.random() * (options.dificulty + 2)) - 1)
            posx = Math.floor((Math.random() * (options.dificulty + 2)) - 1)

            if (posy == -1) posy = 0

            if (posx == -1) posx = 0

          } else {
            break
          }

          total = 0
        }

        for (var i = 0; i < options.words[v].length; i++) {
          $("td[pos='" + posx.toString() + ";" + posy.toString() + "']").html(options.words[v].charAt(i)).attr("nocruzar", "S")
          posy++
        }
      }
    }

    var cantidadclicks = 0
    var posicionx = 0
    var posiciony = 0
    var posicionx1 = 0
    var posiciony1 = 0

    // Amarra la funcion al evento click
    this.click = function (td) {
      // This es el objeto instanciado
      var $g = this
      //el contador de clics se eleva a 1 indicando que es el primer click de la seleccion
      cantidadclicks += 1
      //se añade estilo a la letra clickeada para verla resaltada de gris
      $(td).css({
        color: '#fff',
        background: '#9E9E9E'
      })
      //si la cantidad de clicks es 1, es el primer click
      if (cantidadclicks == 1) {
        //las variables correspondientes a la posicion 1 cambian de acuerdo a los valores X y Y de al letra cliqueada
        posicionx = $(td).attr("pos").split(";")[0]
        posiciony = $(td).attr("pos").split(";")[1]

      } else {
        //si la cantidad de clicks es diferente de 1, es porque se clickeo la segunda letra
        //se cargan las variables correspondientes a sus posiciones en x y y
        posicionx1 = $(td).attr("pos").split(";")[0]
        posiciony1 = $(td).attr("pos").split(";")[1]
        //y el contador se hace 0 para que la proxima selección comienze desde 1
        cantidadclicks = 0

        var selecion = ""
        var y = posiciony
        var x = posicionx
        var i = 1
        var total = posicionx1 - posicionx
        //si la diferencia entre la posicion final y la posicion inicial es menor que 0, entonces la seleccion se hizo de der a izq
        if (total < 0) {
          $(td).css({
            color: '',
            background: ''
          })

          $("#" + idElement + " td[pos='" + posicionx.toString() + ";" + posiciony.toString() + "']").css({
            color: '',
            background: ''
          })

          $(".noes").css({
            color: '',
            background: ''
          })
          //en este caso se anula la selección
          return
        }
        //Verifica la orientacion (vertica, horizontal) comparando las psiciones en y de la primera y la ultima selección
        if (posiciony != posiciony1) {
          // --- VERTICAL ---

          //si las posiciones son iguales en y, entonces el desplazamiento fue horizontal
          total = posiciony1 - posiciony
          //se verifica que la seleccion sea de arriba hacia abajo
          if (total < 0) {
            $(td).css({
              color: '',
              background: ''
            })

            $("#" + idElement + " td[pos='" + posicionx.toString() + ";" + posiciony1.toString() + "']").css({
              color: '',
              background: ''
            })

            $(".noes").css({
              color: '',
              background: ''
            })
            //se anula la seleccion
            return
          }

          var word = ''

          while (true) {
            var $tdlocal = $("#" + idElement + " td[pos='" + x.toString() + ";" + y.toString() + "']")
            selecion += $tdlocal.html()
            //Una vez validada la selección, se aplican colores personalizados
            $tdlocal.css({
              color: '#fff',
              background: options.colorWord
            })
            // Se remueve la clase 'noes'
            $tdlocal.removeClass("noes")
            //Las letras dentro del html de cada td se concatenan en la variable word
            word += $tdlocal.html()
            //si la iteración  corresponde a la cantidad de letras, entonces se sale de la misma
            if (i == total + 1) break

            y++
            i++
          }
          // Se aplican estilos al listado de palabras
          $(`li[name='${word}']`).addClass("bda-word-search__word--correct")

        } else {
          // --- HORIZONTAL ---

          var word = ''

          while (true) {
            var $tdlocal = $("#" + idElement + " td[pos='" + x.toString() + ";" + y.toString() + "']")
            selecion += $tdlocal.html()
            $tdlocal.css({
              color: '#fff',
              background: options.colorWord
            })
            $tdlocal.removeClass("noes")
            word += $tdlocal.html()

            if (i == total + 1) break

            x++
            i++
          }
          $(`li[name='${word}']`).addClass("bda-word-search__word--correct")
        }

        var existe = false
        $.each(options.words, function () {

          if (selecion == this) {
            existe = true
            var verificar = false

            if (palabrasencontradas == 0) {
              palabrasencontradas[0] = this
              successWord += 1

            } else {

              for (var i = 0; i < palabrasencontradas.length; i++) {
                if (palabrasencontradas[i] == this) {
                  verificar = true
                }
              }

              if (!verificar) {
                palabrasencontradas[palabrasencontradas.length] = this
                successWord += 1
              }

            }

            cfin++;

            if (!verificar) miradorpalabras += selecion + ", "

            $(`#${idElement}td[class='']`).addClass("noborrar")

            if (successWord == options.words.length) {
              $g.win()
            }
          }

        })

        if (!existe) {

          miserrores += 1
          y = posiciony
          x = posicionx
          i = 1
          total = posicionx1 - posicionx

          if (posiciony != posiciony1) {

            total = posiciony1 - posiciony

            while (true) {
              var $tdlocal = $("#" + idElement + " td[pos='" + x.toString() + ";" + y.toString() + "']")

              if (!$tdlocal.hasClass("noborrar")) {
                selecion += $tdlocal.html();
                $tdlocal.css({
                  color: '',
                  background: ''
                })
                $tdlocal.addClass("noes")
              }

              if (i == total + 1) break

              y++
              i++
            }

          } else {
            while (true) {

              var $tdlocal = $("#" + idElement + " td[pos='" + x.toString() + ";" + y.toString() + "']")

              if (!$tdlocal.hasClass("noborrar")) {
                selecion += $tdlocal.html()
                $tdlocal.css({
                  color: '',
                  background: ''
                })
                $tdlocal.addClass("noes")
              }

              if (i == total + 1) break

              x++
              i++
            }
          }

          $(".noes").css({
            color: '',
            background: ''
          })
        }
      }
    }

    this.win = function () {
      $(".bda-win-game__modal, .bda-win-game__message").removeClass("hide")

      $(".bda-win-game__modal, .bda-win-game__message").click(() => {
        $(".bda-win-game__modal").addClass("hide")
        $(".bda-win-game__message").addClass("hide")
      })
    }

    this.enabled = () => dejapasar = true

    this.init()
  }

  $.fn.wordSearch = function (options) {
    let list = $("<ul>/").addClass("bda-word-search__list-words")

    $.each(options.words, function (k, v) {
      list.append($("<li class='bda-word-search__word'>").attr("name", v).html(`<span>${v.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}</span>`))
    })

    $(this).parent().append(list)
    new oWs(this, options).enabled()
  }

})(jQuery)
