﻿var cfin = 0;

(function ($) {
  oWs = function ($el, options) {

    var aciertos = 0
    var activarhover = false
    var miradorpalabras = ""
    var miserrores = 0
    var dejapasar = false

    $t = $("<table>")
    var palabrasencontradas = new Array()

    $.extend(options)
    var letras = new Array()
    letras[0] = "A"
    letras[1] = "B"
    letras[2] = "C"
    letras[3] = "D"
    letras[4] = "E"
    letras[5] = "F"
    letras[6] = "G"
    letras[7] = "H"
    letras[8] = "I"
    letras[9] = "J"
    letras[10] = "K"
    letras[11] = "L"
    letras[12] = "M"
    letras[13] = "N"
    letras[14] = "Ñ"
    letras[15] = "O"
    letras[16] = "P"
    letras[17] = "Q"
    letras[18] = "R"
    letras[19] = "S"
    letras[20] = "T"
    letras[21] = "U"
    letras[22] = "V"
    letras[23] = "W"
    letras[24] = "X"
    letras[25] = "Y"
    letras[26] = "Z"

    this.init = function () {
      var contadorpalabras = 0
      var comienzoy = Math.floor((Math.random() * (options.dificulty + 0)) + 0)
      var comienzoyar = new Array()

      for (var i = 0; i < options.words.length; i++) {

        while (true) {

          var cc = Math.floor((Math.random() * (options.dificulty + 0)) + 0)
          var existe = false

          for (var j = 0; j < options.words.length; j++) {

            if (comienzoyar[j] == cc) {
              existe = true
            }
          }
          if (!existe) {
            comienzoyar[i] = cc
            break
          }

        }

      }

      comienzoyar = comienzoyar.sort(function (a, b) {
        return a - b
      })

      var totalvertical = options.words.length / 2

      if (totalvertical > 2) {
        totalvertical = totalvertical - 1
      }

      for (var j = 0; j < options.dificulty + 1; j++) {
        $header = $("<tr>")
        var contadorletras = 0
        var comienzox = Math.floor((Math.random() * (options.dificulty + 2)) - 1)
        var enquepos = 0

        if (j == comienzoyar[contadorpalabras]) {
          enquepos = (options.dificulty + 1 - options.words[contadorpalabras].length)
          enquepos = Math.floor((Math.random() * enquepos))
        }

        if (enquepos == -1) {
          enquepos = 0
        }

        for (var i = 0; i < options.dificulty + 1; i++) {
          var pos = Math.floor((Math.random() * (options.dificulty + 3)) - 1)
          var letraelegidapos = Math.floor(Math.random() * 14)
          var $g = this

          if (pos == -1) {
            pos = 0
          }

          if (comienzoy == -1) {
            comienzoy = 0
          }

          if (comienzox == -1) {
            comienzox = 0
          }

          if (comienzoyar[contadorpalabras] == j) {
            //Aca pongo las palabras que vienen de la DB.
            if (enquepos == i) {

              if (contadorletras < options.words[contadorpalabras].length) {
                $("<td>").attr("nocruzar", "S").html(options.words[contadorpalabras].charAt(contadorletras)).appendTo($header).attr("pos", i.toString() + ";" + j.toString()).css("cursor", "pointer").hover(function () {
                  if (activarhover) {
                    $(this).css("color", "#C15858")
                  }
                }).click(function () {
                  $g.click(this)
                }).addClass("noes").css("font-weight")
                //}).addClass("noes").css("font-weight", "bold");
                contadorletras++
                enquepos++
              } else {
                $("<td>").attr("nocruzar", "F").html(letras[letraelegidapos]).appendTo($header).attr("pos", i.toString() + ";" + j.toString()).css("cursor", "pointer").hover(function () {
                  if (activarhover) {
                    $(this).css("color", "#C15858")
                  }
                }).click(function () {
                  $g.click(this);
                }).addClass("noes")
              }
            } else {
              $("<td>").attr("nocruzar", "F").html(letras[letraelegidapos]).appendTo($header).attr("pos", i.toString() + ";" + j.toString()).css("cursor", "pointer").hover(function () {
                if (activarhover) {
                  $(this).css("color", "#C15858")
                }
              }).click(function () {
                $g.click(this)
              }).addClass("noes")
            }

          } else {
            $("<td>").attr("nocruzar", "F").html(letras[letraelegidapos]).appendTo($header).attr("pos", i.toString() + ";" + j.toString()).css("cursor", "pointer").hover(function () {
              if (activarhover) {
                $(this).css("color", "#C15858")
              }
            }).click(function () {
              $g.click(this)
            }).addClass("noes")
          }
        }

        $t.append($header)
        $el.append($t)

        if (j == comienzoyar[contadorpalabras]) {
          if (contadorpalabras < totalvertical) {
            contadorpalabras++
          }
        }
      }

      var posy = Math.floor((Math.random() * (options.dificulty + 2)) - 1)
      var posx = Math.floor((Math.random() * (options.dificulty + 2)) - 1)
      var total = 0

      if (posy == -1) {
        posy = 0
      }

      if (posx == -1) {
        posx = 0
      }

      var caminadorvertical = contadorpalabras + 1
      var cantidadvueltas = 0

      for (var v = caminadorvertical; v < options.words.length; v++) {
        var pospalabra = 0
        var posyv = 0

        while (true) {
          cantidadvueltas++

          if (cantidadvueltas == 100) {
            return
          }

          if ((posy + options.words[v].length) < options.dificulty) {
            posyv = posy;
            for (var i = 0; i < options.words[v].length; i++) {
              if ($("td[pos='" + posx.toString() + ";" + posyv.toString() + "']").attr("nocruzar") == "S") {
                total++
                break
              }
              posyv++
            }
          } else {
            total = 1;
          }
          if (total > 0) {
            posy = Math.floor((Math.random() * (options.dificulty + 2)) - 1);
            posx = Math.floor((Math.random() * (options.dificulty + 2)) - 1);
            if (posy == -1) {
              posy = 0;
            }
            if (posx == -1) {
              posx = 0;
            }
          } else {
            break;
          }
          total = 0;
        }
        for (var i = 0; i < options.words[v].length; i++) {
          $("td[pos='" + posx.toString() + ";" + posy.toString() + "']").html(options.words[v].charAt(i)).attr("nocruzar", "S").css("font-weight");
          //$("td[pos='" + posx.toString() + ";" + posy.toString() + "']").html(options.words[v].charAt(i)).attr("nocruzar", "S").css("font-weight", "bold");
          posy++;
        }
      }
    }

    var cantidadclicks = 0;
    var posicionx = 0;
    var posiciony = 0;
    var posicionx1 = 0;
    var posiciony1 = 0;
    this.click = function (td) {
      if (!dejapasar) {
        return;
      }
      var $g = this;
      cantidadclicks += 1;

      $(td).css({
        color: '#fff',
        background: '#969696'
      });

      if (cantidadclicks == 1) {
        posicionx = $(td).attr("pos").split(";")[0];
        posiciony = $(td).attr("pos").split(";")[1];
        activarhover = false; //hay que cambiar aca
      } else {
        posicionx1 = $(td).attr("pos").split(";")[0];
        posiciony1 = $(td).attr("pos").split(";")[1];
        cantidadclicks = 0;
        activarhover = false;
        var selecion = "";
        var y = posiciony;
        var x = posicionx;
        var i = 1;
        var total = posicionx1 - posicionx;
        if (total < 0) {
          $(td).css({
            color: '',
            background: ''
          });;
          $("td[pos='" + posicionx.toString() + ";" + posiciony.toString() + "']").css({
            color: '',
            background: ''
          });
          $(".noes").css({
            color: '',
            background: ''
          });
          return;
        }
        if (posiciony != posiciony1) {
          total = posiciony1 - posiciony
          if (total < 0) {
            $(td).css({
              color: '',
              background: ''
            });
            $("td[pos='" + posicionx.toString() + ";" + posiciony1.toString() + "']").css({
              color: '',
              background: ''
            });
            $(".noes").css({
              color: '',
              background: ''
            });
            return;
          }
          var word = '';
          while (true) {
            var $tdlocal = $("td[pos='" + x.toString() + ";" + y.toString() + "']");
            selecion += $tdlocal.html();
            $tdlocal.css({
              color: '#fff',
              background: 'rgb(225,116,19)'
            });
            $tdlocal.css("font-weight", "bold");
            $tdlocal.removeClass("noes");
            word += $tdlocal.html();
            if (i == total + 1) {
              break;
            }
            y++;
            i++;
          }
          $('[name=' + word + ']').css('color', '#fff');
          $('[name=' + word + ']').css('background-color', 'rgb(225,116,19)');
        } else {
          var word = '';
          while (true) {
            var $tdlocal = $("td[pos='" + x.toString() + ";" + y.toString() + "']");
            selecion += $tdlocal.html();
            $tdlocal.css({
              color: '#fff',
              background: 'rgb(225,116,19)'
            });
            $tdlocal.css("font-weight", "bold");
            $tdlocal.removeClass("noes");
            word += $tdlocal.html();
            if (i == total + 1) {
              break;
            }
            x++;
            i++;
          }
          $('[name=' + word + ']').css('color', '#fff');
          $('[name=' + word + ']').css('background-color', 'rgb(225,116,19)');
        }
        var existe = false;
        $.each(options.words, function () {
          if (selecion == this) {
            existe = true;
            var verificar = false;
            if (palabrasencontradas == 0) {
              palabrasencontradas[0] = this;
              aciertos += 1;
            } else {
              for (var i = 0; i < palabrasencontradas.length; i++) {
                if (palabrasencontradas[i] == this) {
                  verificar = true;
                }
              }
              if (!verificar) {
                palabrasencontradas[palabrasencontradas.length] = this;
                aciertos += 1;
              }
            }
            cfin++;
            var sound = new Howl({
              urls: ['sound/success.mp3']
            }).play();
            console.log(cfin);
            if (cfin == 6) {
              $('.pop-next').trigger('click');
            }
            if (!verificar) {
              miradorpalabras += selecion + ", ";
              // $g.cantidadpalabras();
            }
            $("td[class='']").addClass("noborrar");
            if (aciertos == options.words.length) {
              $('.pop-good').trigger('click');
              var sound = new Howl({
                urls: ['sound/success.mp3']
              }).play();
              var sound = new Howl({
                urls: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/win.mp3']
              }).play();
              $g.win();
            }
          }
        });
        if (!existe) {
          miserrores += 1;
          y = posiciony;
          x = posicionx;
          i = 1;
          total = posicionx1 - posicionx;
          if (posiciony != posiciony1) {
            total = posiciony1 - posiciony
            while (true) {
              var $tdlocal = $("td[pos='" + x.toString() + ";" + y.toString() + "']");
              if (!$tdlocal.hasClass("noborrar")) {
                selecion += $tdlocal.html();
                $tdlocal.css({
                  color: '',
                  background: ''
                });
                $tdlocal.css("font-weight", "normal");
                $tdlocal.addClass("noes");
              }
              if (i == total + 1) {
                break;
              }
              y++;
              i++;
            }
          } else {
            while (true) {
              var $tdlocal = $("td[pos='" + x.toString() + ";" + y.toString() + "']");
              if (!$tdlocal.hasClass("noborrar")) {
                selecion += $tdlocal.html();
                $tdlocal.css({
                  color: '',
                  background: ''
                });
                $tdlocal.css("font-weight", "normal");
                $tdlocal.addClass("noes");
              }
              if (i == total + 1) {
                break;
              }
              x++;
              i++;
            }
          }
          $(".noes").css({
            color: '',
            background: ''
          });
        }
      }
    }
    this.win = function () {
      if (options.win != "") {
        eval(options.win + "('" + miradorpalabras + "-" + miserrores + "')");
      }
    }
    this.enabled = function () {
      dejapasar = true;
    }
    // this.cantidadpalabras = function () { eval("nogano('" + aciertos + "')"); eval("noganopalabras('" + miradorpalabras + "')"); }
    this.init();
  };

  $.fn.wordSearch = function (options) {
    new oWs(this, options).enabled()
  };

})(jQuery);
