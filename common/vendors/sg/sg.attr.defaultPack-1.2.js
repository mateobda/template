/*
default custom attribute pack
	sg-init
	sg-click
	sg-one
	sg-onImg
	sg-swapImg
	sg-sound
author: taejin ( drumtj@gmail.com )
*/

( function( sg ){
	/*
	 * custom attribute : sg-init
	 */
	sg.addCustomAttr({
		//custom attribute name
		name: "sg-init",
		//apply to every tag?
		applyAll: true,
		init: function( element, attrValue ){
			if ( attrValue ) eval( attrValue );
		}
	});
	
	/*
	 * custom attribute : sg-click
	 */
	sg.addCustomAttr({
		name: "sg-click",
		applyAll: true,
		init: function( element, attrValue ){
			sg.sound( element, false );
			$( element )
			.pointer()
			.click(function(){
				var $me = $( this );
				if( !$me.data( "options" ).enabled ) return;
				if( attrValue ) eval( attrValue );
				sg.sound( this );
			});
		}
	});
	
	/*
	 * custom attribute : sg-one
	 */
	sg.addCustomAttr({
		name: "sg-one",
		applyAll: true,
		init: function( element, attrValue ){
			sg.sound( element, false );
			$( element )
			.pointer()
			.click(function(){
				var $me = $( this );
				if( !$me.data( "options" ).enabled ) return;
				if( attrValue ){
					eval( attrValue );
					$me.unbind( "click" ).css( "cursor", "auto" );
				}
				sg.sound( this );
			});
		}
	});
	
	
	/*
	 * custom attribute : sg-call
	 */
	
	sg.extend({
		call: function( element ){
			if( !element ) throw "sg.call: element is " + element;
			var fnNames = $( element ).attr( "data-sg-call" );
			if( fnNames ) eval( fnNames );
		}
	});
	
	sg.addCustomAttr({
		name: "sg-call",
		action: function( element ){
			sg.call( element );
		}
	});
	
	
	/*
	 * custom attribute : sg-onImg
	 */
	function onImg( element, isShow ){
		if( !element ) throw "sg.onImg: element is " + element;
		
		var onimgSelector = $( element ).attr( "data-sg-onimg" );
		if( onimgSelector != undefined ){
			if( isShow ) $( onimgSelector ).show();
			else $( onimgSelector ).hide();
		}
	}
	
	sg.addCustomAttr({
		name: "sg-onImg",
		init: function( element ){
			onImg( element, $( element ).data( "options" ).visible );
		},
		action: function( element ){
			onImg( element, $( element ).data( "options" ).visible );
		}
	});
	
	
	/*
	 * custom attribute : sg-swapImg
	 */
	 
	sg.extend({
		swapImg: function( elementOrSelector ){
			var $img = $( elementOrSelector );
			$img.each(function( i, e ){
				var $me = $( this );
				var tempSrc = $me.attr( "src" );
				$me.attr( "src", $me.attr( "data-sg-src" ) );
				$me.attr( "data-sg-src", tempSrc );
			});
		}
	});
	
	function attr_swapImg( element, isInit ){
		if(!element) throw "attr_swapImg: element is " + element;
		var swapimgSelector = $(element).attr( "data-sg-swapimg" );
		if( swapimgSelector != undefined ){
			
			if( isInit ){
				var img = new Image();
				img.src = $( swapimgSelector ).attr("data-sg-src");
			}else{
				sg.swapImg( swapimgSelector );
			}
		}
	};
	
	sg.addCustomAttr({
		name: "sg-swapImg",
		init: function( element ){
			attr_swapImg( element, true );
		},
		action: function( element ){
			attr_swapImg( element );
		}
	});
	
	
	/*
	 * custom attribute : sg-sound
	 */
	var sounds = [];
	var soundUrlList = {};
	
	function getSoundObj(url) {
		var i, len = sounds.length;
		for (i = 0; i < len; i++) {
			if (url == sounds[i].getAttribute("data-relative-src")) {
				return sounds[i];
			}
		}
		return null;
	}

	// play flag is for loading and not reproduce
	sg.extend({
		setSoundName: function (path, name){
			if( typeof path === "string" ){
				soundUrlList[ name ] = path;
			}
			
			if( typeof path === "object" ){
				for( var o in path ){
					soundUrlList[ o ] = path[o];
				}
			}
		},
		
		sound: function ( elementOrPath, playFlag, name ) {
			if (!elementOrPath) { throw "sg.sound: element is " + elementOrPath; }
	
			var soundName;
			var soundUrl;
			var $element;
			
			if (typeof elementOrPath === "string") {
				soundName = elementOrPath; //is url
			} else {
				soundName = $(elementOrPath).attr( "data-sg-sound" );
			}
	
			if ( soundName ) {
				if ( soundName in soundUrlList ){
					soundUrl = soundUrlList[ soundName ];
				}else{
					soundUrl = soundName;
					if ( name ) {
						sg.setSoundName( soundUrl, name );
					}
				}
	
				var audio = getSoundObj( soundUrl );
				if ( !audio ) {
					/*
					//old
					audio = new Audio();
					audio.src = soundUrl;
					audio.setAttribute( "data-relative-src", soundUrl );
					audio.load();
					sounds.push( audio );
					*/
					
					//#150312
					var temparr = soundUrl.match(/(\.\w+)$/i);
					if( temparr ){
						var ext = temparr[0].replace('.','');
						if( ext == "mp3" ) ext = "mpeg";
						if( /mpeg|wav|ogg/.test(ext) ){
							var type = "audio/" + ext;
							var $a = $('<audio></audio>');
							var $s = $('<source src="'+soundUrl+'" type="'+type+'">');
							$a.append($s);
							$a.attr('data-relative-src', soundUrl);
							sg.$body.append($a);
							audio = $a[0];
							if(audio){
								try{
									audio.load();
								}catch(e){
									console.error( e );
								}
								sounds.push( audio );
							}
						}
					}
				}
				if ( playFlag == true || typeof playFlag === "undefined" ) {
					try {
						audio.currentTime = 0;
					} catch (e) {}
					try{
						if(audio) audio.play();
					}catch(e) { console.error("not support 'audio tag'"); }
				}
			}
		}
	});
	
	sg.addCustomAttr({
		name: "sg-sound",
		init: function ( element ){
			sg.sound( element, false );
		},
		action: function ( element ){
			sg.sound( element );
		}
	});
	
	
})( sg )