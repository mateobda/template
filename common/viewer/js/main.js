var linkList = [];
var idx = 0;
var $frame;
var $sidebar;
var $content;
var $window;
var $topbar;

$(function() {
  xmlLoadComplete(xmldata);
  function xmlLoadComplete(xml) {
    var $con = $('<div/>');
    var $resources = $(xml).find("resources");
    var counter = 0;
    $(xml).find("organizations").each(function(i, e) {
      $(this).children("organization").each(function(i, e) {
        $(this).children("item").each(function(i, e) {
          var $arrowIcon = '<span class="fa fa-arrow-up" aria-hidden="true"></span>';
          var $div = $(`<div class="main-nav__tab"><i class="fa fa-${ i == 0 ? 'sign-out' : i == 1 ? 'pencil' : i == '2' ? 'info-circle' : 'file-text-o' }" aria-hidden="true"></i>${$(this).children("title").text()} ${$arrowIcon}`);
          var $cld = $(`<ul class="main-nav__list"></ul>`);

          $div.click(function(e) {
            var flag = $(this).data("flag");
            if(!flag) {
              $cld.hide("fast");
            } else {
              $cld.show("fast");
            }
            $(this).find('span').toggleClass('animate-arrow');
            $(this).data("flag", !flag)
          });
          $con.append($div);
          $con.append($cld);

          $(this).children("item").each(function(i, e) {
            var node = new NODE({
              link: $resources.find("[identifier=" + $(this).attr("identifierref") + "]").attr("href"),
              title: $(this).children("title").text()
            });

            var $item = $(`<li class="main-nav__item"><a href="javascript:;" onclick="loc(${counter})">	${node.title} </a></li>`);
            $cld.append($item)
            node.$el = $item
            counter++
            linkList.push(node)
          });
        });
      });
    });
    $topbar = $("#topbar");
    $content = $("#content");
    $sidebar = $("#sidebar").append($con);
    $frame = $('<iframe id="iframe" frameborder="0" scrolling="no"></iframe>').appendTo($content);

    $window = $(window).bind("resize", function(e) {
      frameResize();
    });
    frameResize()

    loc(0);
  }
});

function frameResize() {
  var sbw = $sidebar.width();
  var cw = window.innerWidth - sbw - 1;
  var ch = window.innerHeight - $topbar.height() - 1;
  $sidebar.height(ch - 10);
  $content.css("left", `${sbw}px`);
  $frame.width(cw).height(ch);
}

function loc(i) {
  if(i != idx) linkList[idx].$el.children().removeClass("active").addClass("visited");
  linkList[i].$el.children().addClass("active");
  $frame[0].src = linkList[i].link;
  idx = i;
  return false;
}

function next() {
  if(idx + 1 < linkList.length) loc(idx + 1)
}

function prev() {
  if(idx - 1 >= 0) loc(idx - 1)
}

var isAnimating = false
var leftMenuFlag = true
var backupLeftMenuWidth

$(".toogle-menu__button").addClass("on")

function toggleLeftMenu(target) {
  if($sidebar.length && !isAnimating){
    if(leftMenuFlag) {
      backupLeftMenuWidth = $sidebar.width();
      $sidebar.animate({width:0},{
        step: function(o){ $window.trigger("resize"); },
        start: function (){ isAnimating = true; },
        complete: function(){ isAnimating = false; }
      });
      $(".toogle-menu__button").removeClass("on");
      target.innerHTML = "Mostrar Menú";
    } else {
      $sidebar.animate({width:backupLeftMenuWidth},{
        step: function(o){ $window.trigger("resize"); },
        start: function (){ isAnimating = true; },
        complete: function(){ isAnimating = false; }
      });
      $(".toogle-menu__button").addClass("on");
      target.innerHTML = "Ocultar Menú";
    }
    leftMenuFlag = !leftMenuFlag;
  }
}

function toggleLeftMenuIcon(target) {
  if($sidebar.length && !isAnimating){
    if(leftMenuFlag) {
      backupLeftMenuWidth = $sidebar.width();
      $sidebar.animate({width: 0},{
        step: function(o){ $window.trigger("resize"); },
        start: function (){ isAnimating = true; },
        complete: function(){ isAnimating = false; }
      });
      $(".toogle-menu__button").removeClass("on")
      $(".toogle-menu__item").html("Mostrar Menú")
    } else {
      $sidebar.animate({width: backupLeftMenuWidth},{
        step: function(o){ $window.trigger("resize"); },
        start: function (){ isAnimating = true; },
        complete: function(){ isAnimating = false; }
      });
      $(".toogle-menu__button").addClass("on");
      $(".toogle-menu__item").html("Ocultar Menú")
    }
    leftMenuFlag = !leftMenuFlag;
  }
}

function NODE(prop) {
  var prop = prop || {};
  var defaultProp = {
    link: null,
    title: null,
    $el: null
  };
  for(var o in defaultProp) this[o] = prop[o] || defaultProp[o];
}
