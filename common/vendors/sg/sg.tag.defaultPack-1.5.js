/*
default custom tag pack
	sg-btn-hide
	sg-btn-page
	sg-btn-popup
	sg-btn-popup-close
	sg-item-page
	sg-item-popup
	sg-overlap
author: taejin ( drumtj@gmail.com )
*/

/*
v1.3
added 'sg-call' attribute in sg-btn-popup-close
*/

( function( sg ){
	/*
	 * custom tag : sg-btn-hide
	 */
	sg.addCustomTag({
		//custom tag name
		name: "sg-btn-hide",
		//origin tag name (swap tag)
		originTag: "span",
		//indentifier
		id: "data-sg-id='btn-hide'",
		//use attribute list
		attr: [ "sg-onImg", "sg-swapImg", "sg-sound" ],
		init: null,
		//each init
		tagInit: function( element ){
			var $me = $( element );
			var $child = $( '<span></span>' );
			$me
				.css( "display", "inline-block" )
				.contents().each(function( i, e ){
					$child.append( this );
				});
			$child.css( "visibility", "hidden" ).appendTo( $me );
			$me.data( "$child", $child );
		},
		event: "click",
		eventHandle: function( element, event ){
			var $me = $( element );
			var options = $me.data( "options" );
			
			var $child = $me.data( "$child" );
			$child.css( "visibility", options.visible ? "hidden" : "visible" );
			options.visible = !options.visible;
		}
	});
	
	
	var $pageItems, pageIdxs = {}, pageItemInit = false;
	/*
	 * custom tag : sg-item-page
	 */
	sg.addCustomTag({
		name: "sg-item-page",
		originTag: "div",
		id: 'data-sg-id="item-page"',
		attr: [ "sg-call", "sg-sound" ],
		init: function(){
			//$pageItems = $("[data-sg-id=item-page]");
			$pageItems = $.getCustomTag( "sg-item-page" );
			//value of sg-key is only numeric and index of first page is 1.
			//hide all pages except the first page
			$pageItems.filter( ":not([data-sg-key=1])" ).hide();
			
			//#150318
			sg.call( $pageItems.filter( "[data-sg-key=1]" )[0] );
		}
	});
	
	
	/*
	 * custom tag : sg-btn-page
	 */
	function refreshPrevNextBtn( pageIdx, pageLen, groupSelector ){
		var $nextbt = $.getCustomTag( "sg-btn-page" ).filter( groupSelector + "[data-sg-key=next]" )//$("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=next]")
			, $prevbt = $.getCustomTag( "sg-btn-page" ).filter( groupSelector + "[data-sg-key=prev]" );//$("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=prev]");
			
		if( pageIdx-1 < 0 ){
			if($nextbt.length) sg.enabled($nextbt.removeClass("off"));
			if($prevbt.length) sg.disabled($prevbt.addClass("off"));
		}else if( pageIdx+1 > pageLen-1 ){
			if($nextbt.length) sg.disabled($nextbt.addClass("off"));
			if($prevbt.length) sg.enabled($prevbt.removeClass("off"));
		}else{
			if($nextbt.length) sg.enabled($nextbt.removeClass("off"));
			if($prevbt.length) sg.enabled($prevbt.removeClass("off"));
		}
	}
	
	sg.addCustomTag({
		name: "sg-btn-page",
		originTag: "div",
		id: 'data-sg-id="btn-page"',
		attr: [ "sg-call", "sg-sound" ],
		tagInit: function( element ){
			var $me = $( element );
			
			var groupkey = element.getAttribute("data-sg-group")
				, groupSelector = groupkey ? "[data-sg-group=" + groupkey + "]" : ""
				, pageIdx = pageIdxs[groupkey] = 0
				, pageLen = $.getCustomTag( "sg-item-page" ).filter( groupSelector ).length;//$( "[data-sg-id=item-page]" + groupSelector ).length;
			
			refreshPrevNextBtn( pageIdx, pageLen, groupSelector );
			
		},
		event: "click",
		eventHandle: function( element, event ){
			var $me = $( element );
			
			var idkey = element.getAttribute( "data-sg-key" )
				, groupkey = element.getAttribute( "data-sg-group" )
				, groupSelector = groupkey ? "[data-sg-group=" + groupkey + "]" : ""
				, pageIdx = pageIdxs[ groupkey ]
				, pageLen = $.getCustomTag( "sg-item-page" ).filter( groupSelector ).length//$( "[data-sg-id=item-page]" + groupSelector ).length
				, $page, callFlag = false;
			
			if( idkey == "next" ) {
				if( pageIdx+1 < pageLen ) {
					if( groupkey ) $pageItems.filter( groupSelector ).hide();
					else $pageItems.hide();
					
					pageIdx++;
					$page = $pageItems.filter( groupSelector + "[data-sg-key=" + (pageIdx+1) + "]" );
					if($page.length == 0){
						throw new Error(groupSelector + "[data-sg-key=" + (pageIdx+1) + "]" + "is none.");
					}else{
						$page.show();
						callFlag = true;
					}
				}
			}else if( idkey == "prev" ){
				if( pageIdx-1 >= 0 ) {
					if(groupkey) $pageItems.filter(groupSelector).hide();
					else $pageItems.hide();
					pageIdx--;
					$page = $pageItems.filter( groupSelector + "[data-sg-key=" + (pageIdx+1) + "]" );
					if($page.length == 0){
						throw new Error(groupSelector + "[data-sg-key=" + (pageIdx+1) + "]" + "is none.");
					}else{
						$page.show();
						callFlag = true;
					}
				}
			}else{
				if( groupkey ) $pageItems.filter( groupSelector ).hide();
				else $pageItems.hide();
				pageIdx = parseInt( idkey, 10 ) - 1;
				$page = $pageItems.filter( groupSelector + "[data-sg-key=" + idkey + "]" );
				if( $page.length == 0 ){
					throw new Error(groupSelector + "[data-sg-key=" + idkey + "]" + "is none.");
				}else{
					$page.show();
					callFlag = true;
				}
			}
			
			//process for active, deactive of prev button and next button.
			refreshPrevNextBtn( pageIdx, pageLen, groupSelector );
			pageIdxs[ groupkey ] = pageIdx;
			
			//IE css render bug.. line-height의 size가 box-shadow의 그림자부분에 겹칠때, display:none을 해도 그림자가 남는현상 해결위한 선택.. 배경의 css render를 위함
			//for re rendering. because Afterimage problem.
			sg.$body.css( "background-color", sg.$body.css( "background-color" ) );

			//dispatch 'resize' event when paging.  for 'resize' event listener
			sg.$window.trigger( "resize" );
			
			//for item-page
			if( callFlag ){
				sg.actionAttr( $page[ 0 ] );
			}
		}
	});
	
	
	/*
	 * custom tag : sg-item-popup
	 */
	sg.addCustomTag({
		name: "sg-item-popup",
		originTag: "div",
		id: 'data-sg-id="item-popup"',
		//#150216 added
		attr: ["sg-call"],
		//
		tagInit: function( element ){
			$( element ).css( "visibility", "visible" ).hide();
		}
	});
	
	
	/*
	 * custom tag : sg-btn-popup-close
	 */
	 sg.addCustomTag({
		name: "sg-btn-popup-close",
		originTag: "div",
		id: 'data-sg-id="btn-popup-close"',
		//#150216 added
		attr: ["sg-call"]
	 });
	
	
	/*
	 * custom tag : sg-btn-popup
	 */
	
	
	/*#150210 modify*/
	function popupScaleStyle( popup ) {
		if( !popup ) return;
		var ww = window.innerWidth;
		var wh = window.innerHeight;
		
		//#150212 modify
		//var hp = popup.height();
		//var wp = popup.width();
		var hp = popup.outerHeight();
		var wp = popup.outerWidth();
		
		//#150212 removed
		//var msc = Math.min( ww / sg.stageWidth, wh / sg.stageHeight );
		//if (msc > 0.95) msc = 1;
		
		
		//#150212 modify
		/*
		popup
		.css({
			"transform": "scale(" + msc + ")",
			"transform-origin": "0 0",
			"left": (ww - wp * msc) / 2,
			"top": (wh - hp * msc) / 2
		});
		*/
		console.log(sg.scaleX);
		popup.css({
			"transform": "scale(" + sg.scaleX+","+sg.scaleY + ")",
			"transform-origin": "0 0",
			"left" : ((ww - wp * sg.scaleX) * 0.5) + "px",
			"top" : ((wh - hp * sg.scaleY) * 0.5) + "px"
		});
	}
	
	/*#150210 modify*/
	sg.popupList = [];
	sg.extend({
		setPopupBtn: function ( elementOrSelector ) {
			var $target = $( elementOrSelector );
			//console.log($.getCustomTag( "sg-btn-popup" ));
			//console.log("---------------");
			if ( $target.length ) {
				$target.each(function(i, e) {
					var idx = this.getAttribute( "data-sg-key" );
					//console.log(e);
					//console.log("---------------");
					var $popupItem = $.getCustomTag( "sg-item-popup" ).filter( (idx == undefined ? "" : "[data-sg-key=" + idx + "]") );
					//console.log($popupItem[0]);
					$popupItem
					.getCustomTag( "sg-btn-popup-close" )
					.click(function() { //close btn
						$popupItem.data("bgElement").remove();
						$popupItem.hide();
						sg.$window.unbind( "resize", $popupItem.data("resizeHandle") )
						//remove popup in popupList array
						var i=0,j;
						while(j=sg.popupList.length){
							if( i == j ) break;
							if( sg.popupList[i] == $popupItem[0] ){
								sg.popupList.splice(i,1);
							}else i++;
						}
						//console.log(2,sg.popupList);
						
						//#150216 added
						sg.actionAttr( this );
					});
					
					$popupItem.data(
						"bgElement",
						$( '<div></div>' )
							.attr( "data-sg-id", "popupBg2" )
							.width( "100%" )
							.height( "100%" )
							.css({
								"visibility": "visible",
								"position":"fixed",
								"left":"0px",
								"top":"0px",
								"background-color":"#000",
								"opacity": "0.3"
							})
					);
					
					sg.initAttr( this );
				});
				
				$target.click(function(e){
					var $me = $( this );
					var idx = this.getAttribute( "data-sg-key" );
					var $popupItem = $.getCustomTag( "sg-item-popup" ).filter( (idx == undefined ? "" : "[data-sg-key=" + idx + "]") );
			
					if ( $popupItem.length ) {
						sg.$body
							.append( $popupItem.data("bgElement") )
							.append( $popupItem );
						
						$popupItem.css({"z-index":"auto", "position": "fixed"});
						var resizeHandle = function(){
							popupScaleStyle( $popupItem );
						}
						sg.$window.bind( "resize", resizeHandle );
						$popupItem.data("resizeHandle", resizeHandle);
						popupScaleStyle($popupItem);
						
						sg.popupList.push($popupItem[0]);
						
						$popupItem.show();
						//console.log(1,sg.popupList);
						sg.actionAttr( this );
						
						//#150216 added
						sg.actionAttr( $popupItem[0] );
					}
				});
			}
		}
	});
	 
	sg.addCustomTag({
		name: "sg-btn-popup",
		originTag: "div",
		id: 'data-sg-id="btn-popup"',
		attr: [	"sg-call", "sg-sound" ],
		init: function(){
			sg.setPopupBtn( $.getCustomTag( "sg-btn-popup" ) );//"[data-sg-id=btn-popup]" );
		}
	});
	
	
	/*
	 * custom tag : sg-overlap
	 */
	sg.addCustomTag({
		name: "sg-overlap",
		originTag: "div",
		id: 'data-sg-id="overlap"',
		tagInit: function( element ){
			var $this = $( element );
			var targetTag = $this.attr( "data-sg-filter" );
			var list = targetTag ? targetTag.split(",") : [];
			$this
				.css( "position", "relative" )
				.children().css( "position", "absolute" );
			
			$this.filter( list ).filter(":not(:eq(0))").hide();
		}
	});
	
})( sg )