
/**
 * @fileOverview Librería para la producción de contenidos de la web 
 * @version 1.0
 * @author taejin (drumtj@gmail.com)
 */

/**
 * @see <a href="http://jquery.com/">http://jquery.com/</a>
 * @name jQuery 
 * @class
 * Refiere jQuery Library (http://jquery.com/) para ver los detalles completos. Esto solo documenta las funciones y clases que son añadidos por este plug-in de jQuery. 
 */


/**
 * @see <a href="http://jquery.com/">http://jquery.com/</a>
 * @name fn
 * @class
 * Refiere jQuery Library (http://jquery.com/) para ver los detalles completos. Esto solo documenta la función y clases que son añadidos a jQuery por este plug-in. 
 * @memberOf jQuery
 */

(function(){
	
	if( !("jQuery" in window) ){
		throw new Error("sg library is require jQuery");
	}
	
	var toString = {}.toString
		, slice = [].slice;
	
	var //readyCallbackList = []
		initCallbackList = []
		, customTagList = {}
		, customAttrList = {}
		, setStageFunc
		, setScaleModeFunc
		, progressImg;
	
	//private
	var version = "1.0"
		, scaleMode = "none"
		, scaleX = 1
		, scaleY = 1
		, stageWidth = 0
		, stageHeight = 0
		, $stage = null
		, $content = null
		, $body = null
		, $window = $( window );
	
	//support
	if( !("forEach" in Array.prototype) ){
		Array.prototype.forEach = function ( callback ){
			for( var i=0; i<this.length; i++ ){
				callback.call( window, this[ i ] );
			}
		}
	}
	
	
	
	
	/**
	 * Configura el cursor del mouse como puntero. 
	 * @function
	 * @name pointer
	 * @memberOf jQuery.fn
	 * @example
	 * $( element ).pointer();
	 * @example
	 * $( element ).pointer( false );
	 * @param {boolean} bool
	 * @returns Objeto de jQuery 
	 * @type jQuery Object
	 */
	jQuery.fn.pointer = function(){
		return $( this ).css( "cursor", arguments[0] == false ? "auto" : "pointer" );
	};
	
	/**
	 * Devuelve el valor numérico del CSS. 
	 * @function
	 * @name cssVal
	 * @memberOf jQuery.fn
	 * @example
	 * $( element ).cssVal( "margin-top" );
	 * @param {string} cssName
	 * @returns value
	 * @type number
	 */
	jQuery.fn.cssVal = function( cssName ){
		var num = parseFloat( $( this ).css( cssName ) );
		return isNaN( num ) ? 0 : num;
	};
	
	/**
	 * Es una función que extrae las etiquetas personalizadas específicas. Extrae las etiquetas personalizadas entre los elementos hijos. 
	 * @function
	 * @name getCustomTag
	 * @memberOf jQuery.fn
	 * @example
	 * $( 'p' ).getCustomTag( "sg-btn-hide" );
	 * @param {string} tagName
	 * @returns Objeto de jQuery 
	 * @type jQuery Object
	 * @link sg.addCustomTag referir las funciones definidas de etiquetas personalizadas. 
	 */
	jQuery.fn.getCustomTag = function( tagName ){
		var isRoot = (this == $);
		for( var o in customTagList ){
			if( tagName == o ){
				if( isRoot ) return $( "[" + customTagList[ o ].identifier + "]" );
				else return $( this ).children( "[" + customTagList[ o ].identifier + "]" );
			}
		}
		return $;
	};
	
	/**
	 * Función que extrae las etiquetas personalizadas específicas. 
	 * @function
	 * @name getCustomTag
	 * @memberOf jQuery
	 * @example
	 * $.getCustomTag( "sg-btn-hide" );
	 * @param {string} tagName
	 * @returns objeto de jQuery
	 * @type jQuery Object
	 * @link sg.addCustomTag referir funciones definidas de etiquetas personalizadas. 
	 */
	jQuery.getCustomTag = jQuery.fn.getCustomTag;
	
	
	
	function swapTag( obj, findTagName, swapTagName, identifier ) {
		if ( document.querySelector( findTagName ) ) {
			identifier = identifier ? ' ' + identifier + ' ' : '';
			obj.html = obj.html
				.replace( new RegExp( '<' + findTagName, 'g' ), '<' + swapTagName + identifier )
				.replace( new RegExp( '</' + findTagName + '>', 'g' ), '</' + swapTagName + '>' );
		}else{
			customTagList[ findTagName ].nothing = true;
		}
	}
	
	function replaceTagList(){
		var obj = {	html: document.body.innerHTML }
			, customTagName
			, customAttrName
			, ctInfo, caInfo, i, j, k;
		
		for( customTagName in customTagList ){
			ctInfo = customTagList[ customTagName ];
			swapTag(obj, customTagName, ctInfo.originTag, ctInfo.identifier);
		};

		//add custom attribute prefix : data-
		var sgAttrNameReg = /\ssg([\-][\w]*){1,5}(\s)?=/gi,
			s1 = obj.html.split('<'),
			s2, matchArr, r2 = [];

		for ( i = 0; i < s1.length; i++ ) {
			s2 = s1[ i ].split( '>' );
			for ( j = 0; j < s2.length; j++ ) {
				if ( j % 2 == 0 ) {
					matchArr = s2[ j ].match( sgAttrNameReg );
					if ( matchArr ) {
						for ( k = 0; k < matchArr.length; k++ ) {
							s2[ j ] = s2[ j ].replace( matchArr[ k ], " data-" + matchArr[ k ].substr( 1 ) );
						}
					}
				}
			}
			r2.push( s2.join( '>' ) );
		}
		
		obj.html = r2.join( '<' );
		document.body.innerHTML = obj.html;
		
		delete s1;
		delete s2;
		delete r2;
		delete obj;
		delete matchArr;
		
		//support placeholder bug
		$( "[placeholder]" ).each(function(i,e){
			$( this ).text("").attr( "placeholder", $( this ).attr("placeholder") );
		});
		
		//function apply for custom tags
		var $customTag;
		for( customTagName in customTagList ){
			ctInfo = customTagList[ customTagName ];
			
			//#150409 tj anotation
			//if( ctInfo.nothing ) continue;
			
			$customTag = $.getCustomTag( customTagName );
			
			//#150409 tj added
			if( $customTag.length == 0 ) continue;
			
			if( sg.isFunction( ctInfo[ "initFunc" ] ) ){
				ctInfo[ "initFunc" ].call( sg );
			}
			
			//execute to init function of custom attribute for each custom tag
			$customTag.each(function(index, element) {
				$( element ).data( "_customTagName", customTagName );
				sg.setOption( element );
				if( /^sg-btn-/.test( customTagName ) ) $( element ).pointer();
				if( sg.isFunction( ctInfo[ "eachInitFunc" ] ) ){
					ctInfo[ "eachInitFunc" ].call( element, element );
				}
				sg.initAttr( element );
			});
			
			//execute to action function of custom attribute when called event handle
			if( ctInfo[ "eventName" ] ){
				$customTag.bind( ctInfo[ "eventName" ], function( e ){
					var ctname = $( this ).data( "_customTagName" );
					if ( !$( this ).data( "options" ).enabled ) return;
					if( sg.isFunction( customTagList[ ctname ][ "eventFunc" ] ) ) customTagList[ ctname ][ "eventFunc" ].call( this, this, e );
					sg.actionAttr( this );
				});
			};
			$customTag = null;
		};
		
		//apply custom attribute for all tag
		for( customAttrName in customAttrList ){
			caInfo = customAttrList[ customAttrName ];
			if( caInfo.isForEveryTags ){
				if( caInfo && sg.isFunction( caInfo[ "init" ] ) ){
					$( "[data-" + customAttrName + "]" ).each(function( i, element ){
						sg.setOption( element );
						caInfo[ "init" ].call( element, element, element.getAttribute( "data-" + customAttrName ) );
					});
				}
			}
		}
	}
	
	//call by 'resize' event
	var _ww, _hh, _ch, _msc;
	function applyScaleMode(){
		_ww = $window.width();
		_hh = $window.height();
		
		//#150212 modify
		/*
		_ch = $content.height();
		_ch += $content.cssVal( "border-top-width" ) + $content.cssVal( "border-bottom-width" );
		_ch += $content.cssVal( "margin-top" ) + $content.cssVal( "margin-bottom" );
		_ch += $content.cssVal( "padding-top" ) + $content.cssVal( "padding-bottom" );
		*/
		_ch = $content.outerHeight();
		
		
		switch( scaleMode ){
			case "showall":
				_msc = Math.min(_ww / stageWidth, _hh / stageHeight);
				if(_ch - stageHeight <= 1){
					//컨텐츠가 스테이지보다 클 때
					if(_ch * _msc > _hh){
						//console.log("top 0, overflow:visible");
						$stage.css({
							"transform" : "scale(" + _msc + ")",
							"transform-origin" : "0 0",
							"left" : ((_ww - stageWidth * _msc) * 0.5) + "px",
							"top" : 0
						});
						
						
						
						$stage.parent().css({
							"overflow-y" : "visible"
						});
					}
					//컨텐츠가 스테이지 안에 있을 때
					else{
						//console.log("top center, overflow:hidden");
						$stage.css({
							"transform" : "scale(" + _msc + ")",
							"transform-origin" : "0 0",
							"left" : ((_ww - stageWidth * _msc) * 0.5) + "px",
							"top" : ((_hh - _ch * _msc) * 0.5) + "px"
						});
						
						$stage.parent().css({
							"overflow-y" : "hidden"
						});
					}
				}
				else{
					//console.log("top center, overflow:auto");
					
					$stage.css({
						"transform" : "scale(" + _msc + ")",
						"transform-origin" : "0 0",
						"left" : ((_ww - stageWidth * _msc) * 0.5) + "px",
						"top" : ((_hh - stageHeight * _msc) * 0.5) + "px"
					});
					
					$stage.parent().css({
						"overflow-y" : "auto"
					});	
				}
				scaleX = scaleY = _msc;
			break;
			
			case "noscale":
				scaleX = scaleY = 1;
				$stage.css({
					"transform" : "scale(" + scaleX + ")",
					"transform-origin" : "0 0"
				});
			break;
			
			case "exactfit":
				scaleX = _ww / stageWidth;
				scaleY = _hh / stageHeight;
				$stage.css({
					"transform" : "scale(" + scaleX + ", " + scaleY + ")",
					"transform-origin" : "0 0"
				});
			break;
		}
	}
	
	
	/**
	 * @namespace Librería para la producción de contenidos de la web
	 * @author taejin (drumtj@gmail.com)
	 * @name sg
	 * @version 1.0
	 * @since 2014.09.22
	 * @description
	 * sg library es una librería que requiere jQuery. <br>
	 * Ofrece configuración de scaleMode, atributos personalizados y API para la producción de etiquetas personalizadas.<br>
	 */
	var sg = {
		/**
		 * [Read Only] es información sobre versions de la librería sg.
		 * @name version
		 * @memberOf sg
		 * @type string
		 */
		get version() { return version },
		
		/**
		 * [Read Only] Método de escala de stage. Se lo configura con Sg.setScaleMode y se puede colocar "showall", "exactfit" o "none" como su valor. 
		 * @name scaleMode
		 * @memberOf sg
		 * @type string
		 */
		get scaleMode() { return scaleMode },
		
		/**
		 *[Read Only]  Es el valor del eje X de stage. Se calcula el valor cuando se ajusta scaleMode como la función de  sg.set.
		 * Su proporción se calcula en base del width de stage.
		 * @name scaleX
		 * @memberOf sg
		 * @type number 0.0 ~ 1.0
		 */
		get scaleX() { return scaleX },
		
		/**
		 * [Read Only] stage의 Es el valor del eje Y de stage. Se calcula el valor cuando se ajusta scaleMode como la función de  sg.set.
		 * Su proporción se calcula en base del width de stage. 
		 * @name scaleY
		 * @memberOf sg
		 * @type number 0.0 ~ 1.0
		 */
		get scaleY() { return scaleY },
		
		/**
		 * [Read Only] El valor de width de stage. Se importa el valor de width de stage al configurar stage con la función de set Stage.
		 * @name stageWidth
		 * @memberOf sg
		 * @type number
		 */
		get stageWidth() { return stageWidth },
		
		/**
		 * [Read Only] El valor de height de stage. Se importa el valor de height de stage al configurar stage con la función de set Stage.
		 * @name stageHeight
		 * @memberOf sg
		 * @type number
		 */
		get stageHeight() { return stageHeight },
		
		/**
		 * [Read Only] Es un elemento configurado como stage. Se lo configura con sg.setStage.
		 * @name $stage
		 * @memberOf sg
		 * @type jQuery Object
		 */
		get $stage() { return $stage },
		
		/**
		 * [Read Only] Es un contenedor que contiene los elementos hijos de stage. Se crea cuando se configura $stage.
		 * @name $content
		 * @memberOf sg
		 * @type jQuery Object
		 */
		get $content() { return $content },
		
		/**
		 * [Read Only] $("body")
		 * @name $body
		 * @memberOf sg
		 * @type jQuery Object
		 */
		get $body() { return $body },
		
		/**
		 * [Read Only] $(window)
		 * @name $window
		 * @memberOf sg
		 * @type jQuery Object
		 */
		get $window() { return $window },
		
		/**
		 * Se puede añadir o extender funciones en sg. 
		 * @function
		 * @name extend
		 * @memberOf sg
		 * @example
		 * sg.extend({
		 * 	myfunc: function( ){
		 *		//TO DO
		 * 	}
		 * });
		 *
		 * sg.myfunc();
		 * @param {object} property
		 * @link sg.super Referencia
		 */
		extend: function( prop ){
			if(typeof prop !== "object"){ throw new Error("sg.extend arguments is not Object!"); }
			
			for( var name in prop ){
				//sg.hasOwnProperty( name )
				if( name in sg ) prop[ name ]._super = sg[ name ];
				sg[ name ] = prop[ name ];
			}
		},
		
		/**
		 * importa la etiqueta original desde la función extendida a través de sg.extend.
		 * @function
		 * @name super
		 * @memberOf sg
		 * @example
		 * sg.extend({
		 * 	myfunc: function( str ){
		 *		return '<<' + str + '>>';
		 * 	}
		 * });
		 *
		 * sg.myfunc( 'abc' ); //return "<<abc>>"
		 *
		 * sg.extend({
		 * 	myfunc: function( str ){
		 *		return this.super( str.toUpperCase() );
		 * 	}
		 * });
		 *
		 * sg.myfunc( 'abc' ); //return "<<ABC>>"
		 * @param {object} [arguments=undefined] Parámetros de la función original.
		 * @return {*} el valor devuelto de la función original. 
		 * @type *
		 * @link sg.extend Refencia
		 */
		super: function(){
			var _super = arguments.callee.caller._super;
			return sg.isFunction( _super ) ? _super.apply( this, arguments ) : null;
		}
	};
	
	
	sg.extend({
		/**
		 * Verificar si el objeto es función. Usar isFunction de jQuery.
		 * @function
		 * @name isFunction
		 * @memberOf sg
		 * @param {object} object
		 * @returns true o false
		 * @type boolean
		 */
		isFunction: $.isFunction,
		
		/**
		 * Verificar si el objeto es array. Usar la función isArray de jQuery. 
		 * @function
		 * @name isArray
		 * @memberOf sg
		 * @param {object} object
		 * @returns true o false
		 * @type boolean
		 */
		isArray: $.isArray,
		
		/**
		 * Verificar si el objeto es objeto de window. Usar la función isWindow de jQuery.
		 * @function
		 * @name isWindow
		 * @memberOf sg
		 * @param {object} object
		 * @returns true o false
		 * @type boolean
		 */
		isWindow: $.isWindow,
		
		/**
		 * Verificar si el objeto es número. Usar la función isNumeric de jQuery.
		 * @function
		 * @name isNumeric
		 * @memberOf sg
		 * @param {object} object
		 * @returns true o false
		 * @type boolean
		 */
		isNumeric: $.isNumeric,
		
		/**
		 * Verificar si el objeto es un objeto vacío. Usar la función isEmptyObject de jQuery. 
		 * @function
		 * @name isEmptyObject
		 * @memberOf sg
		 * @param {object} object
		 * @returns true o false
		 * @type boolean
		 */
		isEmptyObject: $.isEmptyObject,
		
		/**
		 * Verificar si el objeto está incluido en el array. Usar la función inArray de jQuery. 
		 * @function
		 * @name inArray
		 * @memberOf sg
		 * @param {object} element
		 * @param {array} array
		 * @param {number} index
		 * @returns true o false
		 * @type string
		 */
		inArray: $.inArray,
		
		/**
		 * Devuelve data type del objeto. Usar la función type de jQuery. 
		 * @function
		 * @name type
		 * @memberOf sg
		 * @param {object}
		 * @returns true o false
		 * @type string
		 */
		type: $.type
	});
	
	
	
	sg.extend({
		
		/**
		 * Añadir la función de inicialización (callback). Las funciones (callback) añadidas se ejecutan después de la inicialización.
		 * @function
		 * @name addInit
		 * @memberOf sg
		 * @example
		 * sg.addInit( function(){} );
		 * @param {function} callback
		 */
		addInit: function( callback ){
			initCallbackList.push( callback );
		},
		
		/**
		 * Configurar la ruta de la imagen de cargando. La imagen configurada se visualiza en la pantalla durante la ejecución de página. 
		 * @function
		 * @name setLoadingImage
		 * @memberOf sg
		 * @example
		 * sg.setLoadingImage( '../common/img/progress.gif' );
		 * @param {string} path
		 */
		setLoadingImage: function( path ){
			progressImg = new Image();
			progressImg.setAttribute("data-sg-id", "progressImg");
			progressImg["onload"] = function( e ){
				this.style.left = (((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - this.width) * 0.5) + "px";
				this.style.top = (((window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth) - this.height) * 0.5) + "px";
				if( !sg.isReady ) document.body.appendChild( progressImg );
				else delete progressImg;
			};
			progressImg.src = path;
			progressImg.style.position = "fixed";
			progressImg.style.visibility = "visible";
		},
		
		/**
		 * Configura stage. El stage configurado tiene acceso al sg.$stage. El stage es el criterio de controlar la escala. 
		 * @function
		 * @name setStage
		 * @memberOf sg
		 * @example
		 * sg.setStage( "#stage" );
		 * @param {object} elementOrSelector
		 */
		setStage: function( elementOrSelector ){
			setStageFunc = function(){
				var $temp = $( elementOrSelector );
				if( $temp.length == 0 ) throw new Error( "setStage : $stage is not select. (selector : " + elementOrSelector + ")" );
				
				$temp.attr( "data-sg-id", "stage" );
				$content = $( "<div data-sg-id='content'></div>" );
				$content.append( $temp.contents() );
				
				$temp.append( $content ).css( "position", "absolute" );
				$temp.parent().css( "overflow-x", "hidden" );
				
				//border가 없으면, 때로는 크기가 잘 못 계산되기 때문에
				if( $temp.cssVal( "border-top-width" ) == 0 ){
					$temp.css( "border", "solid 1px rgba(255,255,255,0)" );
				}
				
				stageWidth = $temp.width();
				stageHeight = $temp.height();
				
				$content.css({
					"min-height": stageHeight,
					"visibility": "hidden"
				});
							
				$stage = $temp;
				
				//apply scaleMode
				if( setScaleModeFunc ){
					setScaleModeFunc.apply( sg );
					setScaleModeFunc = null;
				}
			}
			
			if( sg.isReady ){
				setStageFunc.apply( sg );
				setStageFunc = null;
			}
		},
		
		/**
		 * Configura scaleMode. Se habilita siempre y cuando tenga configurado el stage, y hay modos de "showall", "exactfit" y "none".
		 * @function
		 * @name setScaleMode
		 * @memberOf sg
		 * @example
		 * sg.setStage( "#stage" );
		 * sg.setScaleMode( "showall" );
		 * @example
		 * sg.setStage( "#stage" );
		 * sg.setScaleMode( "exactfit" );
		 * @param {string} scaleMode
		 */
		setScaleMode: function( _scaleMode ){
			scaleMode = _scaleMode;
			setScaleModeFunc = function(){
				$window.bind( "resize" , function(){
					applyScaleMode();
				});
				applyScaleMode();
			}
			
			if( $stage ){
				setScaleModeFunc.apply( this );
				setScaleModeFunc = null;
			}
		},
		
		//options setting for custom tags
		/**
		 * Se guarda el valor a ser aplicado al ejecutar la etiqueta personalizada en $(target).data("options").
		 * @function
		 * @name setOption
		 * @memberOf sg
		 * @example
		 * sg.setOption( element );
		 * @example
		 * sg.setOption( element , {myClicked: false} );
		 * @param {object} elementOrSelector 	- elemento o selector de jQuery
		 * @param {object} [options=undefined]	- Objeto con el conjunto de valores
		 */
		setOption: function ( target, options ){
			var op = { enabled: true };
			for( var o in options ) op[ o ] = options[ o ];
			$( target ).data( "options", op );
		},
		
		/**
		 * Añadir atributos personalizados.<br>
		 * Al definir los atributos, se puede colocar true en el valor de applyAll con el fin de utlizarlos en todas las etiquetas.<br>
		 * Cuando el valor es false, se habilita la función del atributo al usarlo en la etiqueta personalizada. En general,
		 * los atributos personalizados definidos poseen una función especial, y esta función es habilitada con los eventos de las etiquetas personalizadas,
		 * y por ende, se deja el valor básico de applyAll como false.
		 * @function
		 * @name addCustomAttr
		 * @memberOf sg
		 * @param {object} 		option 						- inicializar el objeto de atributo personalizado
		 * @param {string} 		option.name 				- nombre de atributo personalizado.
		 * @param {function} 	[option.init=undefined] 	- función de inicialización.
		 * @param {function} 	[option.action=undefined] 	- función a ejecutar: se ejecuta cuando se procede los eventos de la etiquetas
		 * personalizadas que utilitza estos atributos personalizados. 
		 * @param {boolean} 	[option.applyAll=true] 		- determina si se habilita la función de este atributo en todas las etiquetas básicas. 
		 * @example
		 * //script
		 * sg.addCustomAttr({
		 *	name: "sg-fadeIn",
		 *	init: function( element, attrValue ){
		 *		$( element ).fadeIn();
		 *	},
		 * 	applyAll: true
		 * });
		 * //html
		 * &lt;div sg-fadeIn&gt; ABCD &lt;/div&gt;
		 * @example
		 * //script
		 * sg.addCustomAttr({
		 *	name: "sg-color",
		 *	init: function( element, attrValue ){
		 * 		$( element ).css( "color", attrValue );
		 * 	},
		 *	applyAll: true
		 * });
		 * //html
		 * &lt;div sg-color="red"&gt; ABCD &lt;/div&gt;
		 * @example
		 * sg.addCustomAttr({
		 *	name: "sg-alert",
		 *	action: function( element, attrValue ){
		 * 		if( attrValue ) alert( attrValue );
		 * 	}
		 * });
		 * @link sg.addCustomTag referir la función definida para etiquetas personalizdas.
		 */
		addCustomAttr: function( obj ){
			customAttrList[ obj.name ] = {
				init: obj.init,
				action: obj.action,
				isForEveryTags: obj.applyAll
			}
		},
		
		/**
		 * Añadir etiquetas personalizadas.<br>
		 * El mecanismo básico de la etiqueta personalizada es reemplazar las líneas de código html. <br>
		 * Después de la carga de la página, se busca las etiquetas personalizadas en el body de html, y las reemplaza a las etiquetas básicas definidas. <br>
		 * Al definir las etiquetas personalizadas, se escribe el nombre de la etiqueta original en originTag. Puede ser que las etiquetas personalizadas tengan evento o no.
		 * Se puede crear una etiqueta personalizada que sirve para cambiar la estructura interna de la etiqueta definiendo una función en tagInit.
		 * Por otra parte, se puede crear las etiquetas personalizadas que se habilitan con eventos específicos con una definión de función eventHandle.
		 * @function
		 * @name addCustomTag
		 * @memberOf sg
		 * @param {object} 		option 							- inicializar el objeto de etiqueta personalizado
		 * @param {string}		option.name						- Nombre de etiqueta personalizada. 
		 * @param {string}		[option.originTag="div"]		- El nombre de la etiqueta a ser reemplazada.
		 * @param {string}		[option.id="data-sg-id={name of custom tag}"]
		 *														- Identificador de etiqueta personalizada. Si no es un caso específico, se usa el valor básico.
		 * @param {array}		[option.attr=undefined]			- un array donde se listan los nombres de los atributos personalizados a ser usados en la etiqueta personalizada. 
		 * @param {function}	[option.init=undefined]			- se define las funciones si hay algo que se tiene que ejecutar al inicializar. 
		 * @param {function}	[option.tagInit=undefined]		- se define las funciones si hay algo que se tiene que ejecutar en cada etiqueta al inicializar. 
		 * @param {string}		[option.event=undefined]		- si se habilita con un evento específico, se escribe el nombre. 
		 * @param {function}	[option.eventHandle=undefined]	- se define la función que ejecute evento.  
		 * @example
		 * //script
		 * sg.addCustomTag({
		 *	name: "sg-depth",
		 * 	tagInit: function( element ){
		 *		$("&lt;p&gt;&lt;/p&gt;").append( $( element ).contents() ).appendTo( $( element ) );
		 * 	}
		 * });
		 * //html
		 * &lt;sg-depth&gt; ABCD &lt;sg-depth&gt;
		 * //result
		 * &lt;sg-depth&gt; &lt;p&gt;ABCD&lt;/p&gt; &lt;sg-depth&gt;
		 * @example
		 * //script
		 * sg.addCustomTag({
		 *	name: "sg-h1",
		 *	attr: [ "sg-color", "sg-alert" ],
		 * 	tagInit: function( element ){
		 * 		$( element ).css( "font-size", "40pt" );
		 * 	},
		 * 	event: "click",
		 * 	eventHandle: function( element ){
		 * 		$( element ).animate( {"font-size": "80pt"} );
		 * 	}
		 * });
		 * //html
		 * &lt;sg-h1 sc-color="blue" sg-alert="hello!"&gt; ABCD &lt;/sg-h1&gt;
		 * @link jQuery.getCustomTag Hacer referencia la función extraída de la etiqueta personalizada.
		 * @link sg.addCustomAttr Hacer referencia la función definida del atributo personalizado. 
		 */
		addCustomTag: function( obj ){
			customTagList[ obj.name ] = {
				originTag: obj.originTag ? obj.originTag : "div",
				identifier: obj.id ? obj.id : "data-sg-id='" + obj.name + "'",
				eventName: obj.event,
				
				/*
				//#150313 wrong algorism
				attrList: (function( list ){
					if( !list ) return null;
					else list = slice.call( list );//copy array
					var i=0, attrName;
					list.forEach( function(attrName){
						if( !(attrName in customAttrList) ) list.splice( i, 1 );
						else i++;
					});
					return list;
				})( obj.attr ),
				*/
				
				attrList: obj.attr,
				
				initFunc: obj.init,
				eachInitFunc: obj.tagInit,
				eventFunc: obj.eventHandle
			}
		},
		
		//initialize about custom attribute in custom tag
		/**
		 * La función de inicialización sobre los atributos configurados al definir la etiqueta personalizada. 
		 * @function
		 * @name initAttr
		 * @memberOf sg
		 * @example sg.initAttr( element );
		 * @param {object} element
		 */
		initAttr: function( element ){
			//console.log( element, arguments.callee );
			var customTagName = $( element ).data( "_customTagName" )
				, attrList, attr, attrValue;
				
			if( customTagName ){
				attrList = customTagList[ customTagName ].attrList;
				if( attrList ){
					attrList.forEach(function( attrName ){
						attr = customAttrList[ attrName ];
						attrValue = element.getAttribute( "data-" + attrName );
						if( attr && attr[ "init" ] && !attr.isForEveryTags ){
							attr[ "init" ].call( element, element, attrValue );
						}
					});
				}
			}
		},
		
		//execute function about custom attribute in custom tag
		/**
		 * Ejecuta la función action del atributo personalizado definedo en la etiqueta personalizada. 
		 * @function
		 * @name actionAttr
		 * @memberOf sg
		 * @example sg.actionAttr( element );
		 * @param {object} element
		 */
		actionAttr: function( element ){
			var customTagName = $( element ).data( "_customTagName" )
				, attrList, attr, attrValue;
			
			if( customTagName ){
				attrList = customTagList[ customTagName ].attrList;
				if( attrList ){
					attrList.forEach(function( attrName ){
						attr = customAttrList[ attrName ];
						attrValue = element.getAttribute( "data-" + attrName );
						if( attr && attr[ "action" ] ){
							attr[ "action" ].call( element, element, attrValue );
						}
					});
				}
			}
		},
		
		
		
		/**
		 * jQuery.hide
		 * @function
		 * @name hide
		 * @memberOf sg
		 * @example
		 * sg.hide( 'p' );	//$( 'p' ).hide();
		 * sg.hide( this ); //$( this ).hide();
		 * @param {object} elementOrSelector
		 */
		hide: function( elementOrSelector ){
			$( elementOrSelector ).hide();
		},
		
		/**
		 * jQuery.show
		 * @function
		 * @name show
		 * @memberOf sg
		 * @example
		 * sg.show( 'p' );	//$( 'p' ).show();
		 * sg.show( this ); //$( this ).show();
		 * @param {object} elementOrSelector
		 */
		show: function( elementOrSelector ){
			$( elementOrSelector ).show();
		},
		
		/**
		 * jQuery.fadeIn("slow")
		 * @function
		 * @name fadeIn
		 * @memberOf sg
		 * @example
		 * sg.fadeIn( 'p' );	//$( 'p' ).fadeIn( 'slow' );
		 * sg.fadeIn( this );	//$( this ).fadeIn( 'slow' );
		 * @param {object} elementOrSelector
		 */
		fadeIn: function( elementOrSelector ){
			$( elementOrSelector ).fadeIn("slow");
		},
		
		/**
		 * jQuery.fadeOut("slow")
		 * @function
		 * @name fadeOut
		 * @memberOf sg
		 * @example
		 * sg.fadeOut( 'p' );	//$( 'p' ).fadeOut( 'slow' );
		 * sg.fadeOut( this );	//$( this ).fadeOut( 'slow' );
		 * @param {object} elementOrSelector
		 */
		fadeOut: function( elementOrSelector ){
			$( elementOrSelector ).fadeOut("slow");
		},
		
		/**
		 * Deshabilitar los eventos en el componente, y configura el cursor como puntero. 
		 * @function
		 * @name enabled
		 * @memberOf sg
		 * @example
		 * sg.enabled( this );
		 * sg.enabled( '#myButton' );
		 * sg.enabled( $.getCustomTag( 'sg-btn-hide' ) );
		 * @param {object} elementOrSelector
		 * @returns objeto de jQuery
		 * @type jQuery Object
		 */
		enabled: function ( elementOrSelector ){
			return $(elementOrSelector).each(function(i,e){
				var $this = $(this);
				$this.css("cursor","pointer");
				var options = $this.data("options") || {};
				options.enabled = true;
				$this.data("options", options);
			});
		},
		
		/**
		 * Deshabilitar los eventos en el componente, y configura el cursor por defecto. 
		 * @function
		 * @name disabled
		 * @memberOf sg
		 * @example
		 * sg.disabled( this );
		 * sg.disabled( '#myButton' );
		 * sg.disabled( $.getCustomTag( 'sg-btn-hide' ) );
		 * @param {object} elementOrSelector
		 * @returns objeto de jQuery
		 * @type jQuery Object
		 */
		disabled: function ( elementOrSelector ){		
			return $(elementOrSelector).each(function(i,e){
				var $this = $(this);
				$this.css("cursor","default");
				var options = $this.data("options") || {};
				options.enabled = false;
				$this.data("options", options);
			});
		}
	});
	
	sg.extend({
		/**
		 * En el caso de que se pase la función (callback) como función de inicialización o parámetro, se ejecuta primero la inicialización y luego la función.<br>
		 * En el caso de sg.init(), se ejecuta primero html content(contenido de html) internamente y la inicialización.<br>
		 * Si hay algo que se debe ejecutar después de la inicialización, se pasa la función (callback) al parámetro de init(). 
		 * @function
		 * @name init
		 * @memberOf sg
		 * @example
		 * sg.setStage( "#stage" );
		 * sg.setScaleMode( "showall" );
		 * sg.init();
		 * @example
		 * sg.setStage( "#stage" );
		 * sg.setScaleMode( "showall" );
		 * sg.init( function(){} );
		 * @param {function} [callback=undefined]
		 */
		init: function ( callback ) {
			function _init(){
				//////setting
				//console.log("setting");
				$body = $( document.body );
				
				replaceTagList();
				
				if( setStageFunc ){
					setStageFunc.apply( sg );
					setStageFunc = null;
				}
				
				///compatibility for old versions
				if( "init" in window && sg.isFunction( window[ "init" ] ) ){
					window[ "init" ].apply( window );
				}
				
				if( "initList" in window ){
					initCallbackList = initCallbackList.concat( window[ "initList" ] );
				}
				///
				
				initCallbackList.forEach( function( initFunc ){
					if( sg.isFunction( initFunc ) ) initFunc.apply( window );
				});
				
				
				$("[data-sg-id='progressImg']").remove();
				$content = $("[data-sg-id='content']").css( "visibility", "visible" );
				$stage = $("[data-sg-id='stage']");
				sg.isReady = true;
				
				setTimeout(function(){
					$window.trigger("resize");
				}, 0);
			}
			
			if( $.isReady ){
				_init.apply( window );
				if( sg.isFunction( callback ) ) callback.apply( window );
			}else{
				$( document ).ready(function(e) {
                    _init.apply( window );
					if( sg.isFunction( callback ) ) callback.apply( window );
                });
			}
		}
	});
	
	window.sg = sg;
	
	return sg;
})();