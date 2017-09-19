(function (sg) {

    /*
     * custom attribute : sg-draggalbe
     */


    //if( !("ui" in jQuery) ) throw new Error("require jQuery-ui for sg-draggable");
    if (typeof jQuery.ui == 'undefined') throw new Error("require jQuery-ui for sg-draggable");

    if (typeof $.fn.hitTestPoint == 'undefined') {
        /*	
         *	jQuery hitTest plugin
         *	Demo and documentation:
         *	http://e-smartdev.com/#!jsPluginList/hittestJQuery
         *
         *	Copyright (c) 2012 Damien Corzani
         *	http://e-smartdev.com/
         *
         *	Dual licensed under the MIT and GPL licenses.
         *	http://en.wikipedia.org/wiki/MIT_License
         *	http://en.wikipedia.org/wiki/GNU_General_Public_License
         */
        //custom by tj
        (function ($) {

            /**
             * get the visible rect containing the jquery element
             * return a rectangle object => ({x,y,width,height}) properties
             */



            $.fn.getRect = function () {
                var offset = this.offset();
                if (!offset)
                    return null;
                var formX = offset.left;
                var formY = offset.top;
                return new Rectangle(formX, formY, this.outerWidth(), this.outerHeight());
            };



            /**
             * test if a jquery element hittest with a given coodinate
             * @param {Object} options = {'x': Xcoordinate to test
             * 						   'y': Ycoordinate to test
             * 						   'transparency' : manage images and canvas elements transparency
             * 						  }
             */
            $.fn.hitTestPoint = function (options) {
                // Create some defaults, extending them with any options that were provided
                var settings = $.extend({
                    'x': 0,
                    'y': 0,
                    'transparency': false,
                    'scaleX': 1,
                    'scaleY': 1
                }, options);

                var chk = false;
                this.each(function (i, e) {
                    if (chk) return;
                    var objectRect = $(this).getRect();
                    //console.log(objectRect);
                    applyRectScale(objectRect, settings.scaleX, settings.scaleY);
                    /*
			console.log(this.getBoundingClientRect());
			console.log(objectRect);
			console.log(settings.x, settings.y);
			*/
                    var rectHitTest = objectRect.rectContainsPoint(settings.x, settings.y);

                    var elementTarget = this; //[0];

                    // if we don't whant to check the transparency we return just the rectangle test'
                    if (!settings.transparency || (!($(elementTarget).is("img")) && !($(elementTarget).is("canvas")))) {
                        chk = rectHitTest ? $(this) : false; //rectHitTest;
                        return;
                    }
                    // if the object rectangle don't hitTest return false
                    if (!rectHitTest)
                        return;

                    var canvas = getCanvasFromElement(elementTarget);
                    if (canvas == null) { // the browser is not compatible with canvas element 
                        chk = $(this);
                        return;
                    }

                    var ctx = canvas.getContext('2d');
                    var imageData = ctx.getImageData(settings.x - objectRect.x, settings.y - objectRect.y, 1, 1);

                    chk = (imageData.data[3] != 0) ? $(this) : false;
                    return;
                });

                return chk;
            };

            /**
             * test if a jquery element hittest with a given coodinate
             * @param {Object} options = {'object': object to hittest width
             * 						   'transparency' : manage images and canvas elements transparency
             * 						  }
             */
            $.fn.hitTestObject = function (options) {
                // Create some defaults, extending them with any options that were provided
                var settings = $.extend({
                    'selector': null,
                    'transparency': false,
                    'scaleX': 1,
                    'scaleY': 1
                }, options);

                if (settings.selector == null) // si the object to test is not set
                    return false;

                var $object = $(settings.selector);
                if ($object.length == 0) return false;

                //this.each(function(i,e){
                var i, j, k;
                var klen = this.length;
                var $this, ilen,
                    objectRect,
                    objectToTestRect,
                    rectsInstersects,
                    objectCanvas,
                    objectToTestCanvas,
                    ctxObject,
                    ctxObjectToTest,
                    intersectionRect,
                    objectImageData,
                    objectToTestImageData,
                    objectPix,
                    objectToTestPix,
                    nbPixels,
                    chk, $target;

                for (k = 0; k < klen; k++) {
                    $this = this.eq(k);
                    objectRect = $this.getRect();
                    applyRectScale(objectRect, settings.scaleX, settings.scaleY);
                    ilen = $object.length;
                    chk = false;
                    //console.log($this);
                    console.log($object.length);
                    for (i = 0; i < ilen; i++) {
                        $target = $object.eq(i);
                        objectToTestRect = $target.getRect();
                        applyRectScale(objectToTestRect, settings.scaleX, settings.scaleY);
                        rectsInstersects = objectRect.intersects(objectToTestRect);

                        // if we don't whant to check the transparency we return just the rectangle test'
                        if (!settings.transparency || (!($this.is("img")) && !($this.is("canvas")))) {
                            //return rectsInstersects;
                            if (rectsInstersects) {
                                chk = true;
                                break;
                            } else continue;
                        }
                        // if the object rectangle don't hitTest return false
                        if (!rectsInstersects) {
                            continue;
                            //break;//return false;
                        }

                        objectCanvas = getCanvasFromElement(this);
                        objectToTestCanvas = getCanvasFromElement($object[i]);

                        if (objectCanvas == null || objectToTestCanvas == null) { // the browser is not compatible with canvas element 
                            //return true;
                            chk = true;
                            break;
                        }

                        ctxObject = objectCanvas.getContext('2d');
                        ctxObjectToTest = objectToTestCanvas.getContext('2d');

                        intersectionRect = objectRect.intersection(objectToTestRect);

                        if (!intersectionRect) { // should not append
                            //return true;
                            chk = true;
                            break;
                        }

                        // get the intersectionRect bitmap of the 2 objects to test  
                        objectImageData = ctxObject.getImageData(intersectionRect.x - objectRect.x, intersectionRect.y - objectRect.y, intersectionRect.width > 0 ? intersectionRect.width : 1, intersectionRect.height > 0 ? intersectionRect.height : 1);
                        objectToTestImageData = ctxObjectToTest.getImageData(intersectionRect.x - objectToTestRect.x, intersectionRect.y - objectToTestRect.y, intersectionRect.width > 0 ? intersectionRect.width : 1, intersectionRect.height > 0 ? intersectionRect.height : 1);

                        objectPix = objectImageData.data;
                        objectToTestPix = objectToTestImageData.data;

                        nbPixels = objectImageData.width * objectImageData.height * 4;
                        // if one pixel is not transparent in both object : collision append
                        for (j = 0; j < nbPixels; j += 4) {
                            if (objectPix[j + 3] != 0 && objectToTestPix[j + 3] != 0) {
                                //return true;
                                chk = true;
                                break;
                            }
                        }
                        if (chk) break;
                    }
                    if (chk) return $target;
                }


                return false;
            };



            function applyRectScale(rect, sx, sy) {
                //console.log(rect.width);
                rect.width *= sx;
                //console.log(rect.width, sx);
                rect.height *= sy;
            }


            /**
             * return a canvas of an image or a canvas element
             * if the given element is not a canvas or an image return null
             */
            function getCanvasFromElement(jqElement) {

                var isImg = $(jqElement).is("img");

                if (!isImg && !($(jqElement).is("canvas")))
                    return null;

                var canvas = isImg ? document.createElement('canvas') : jqElement;

                if (!canvas.getContext) // the browser is not compatible with canvas element 
                    return null;

                var ctx;
                if (isImg) {
                    canvas.setAttribute('width', $(jqElement).outerWidth());
                    canvas.setAttribute('height', $(jqElement).outerHeight());
                    ctx = canvas.getContext('2d');
                    ctx.drawImage(jqElement, 0, 0, $(jqElement).outerWidth(), $(jqElement).outerHeight());
                }
                return canvas;
            }

            /**
             * Rectangle Class
             */
            function Rectangle(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                /*
                 * return rectangle informations into a string
                 */
                this.toString = function () {
                    return '(x=' + this.x + ', y=' + this.y + ', width=' + this.width + ', height=' + this.height + ')';
                };
                /*
                 * check if a given point is contain into the rectangle
                 */
                this.rectContainsPoint = function (pointX, pointY) {
                        return (pointX >= this.x && pointX <= this.x + this.width && pointY >= this.y && pointY <= this.y + this.height);
                    }
                    /*
                     * check if a rectangle intersect with another ome
                     */
                this.intersects = function (rect) {
                        return (this.x <= rect.x + rect.width && rect.x <= this.x + this.width && this.y <= rect.y + rect.height && rect.y <= this.y + this.height);
                    }
                    /*
                     * return the intersection of two rectangle as a rectangle
                     * return null if there is not intersection
                     */
                this.intersection = function (rect) {
                    var highestX = Math.max(this.x, rect.x);
                    var lowestX = Math.min(this.x + this.width, rect.x + rect.width);

                    if (highestX <= lowestX) {
                        var highestY = Math.max(this.y, rect.y);
                        var lowestY = Math.min(this.y + this.height, rect.y + rect.height);

                        if (highestY <= lowestY) {
                            return new Rectangle(highestX, highestY, lowestX - highestX, lowestY - highestY);
                        }
                    }
                    return null;
                }
            }

        })(jQuery);
    }
    //if( !("hitTestPoint" in $( document )) ) throw new Error("require jQuery plugin [jquery.hittest.js] for sg-draggable");


    //#150211	
    /*
	****getTargetOffset function option type****
	//target left top value
	{
		left:
		top:
	}
	//
	"#targetSelector"
	//
	$targetVariable
	//
	targetElement
	*/

    /**
     *
     * 스케일이 계산된 offset을 반환
     * @function
     * @name getTargetOffset
     * @memberOf jQuery.fn
     * @example
     * $("#drag").offset( $("#drop").getTargetOffset("#drag"));
     * @param {object} offset or offsetTarget
     * @returns Objeto de object
     * @type object
     *
     */
    jQuery.fn.extend({
        getTargetOffset: function (options) {
            var f, a, b, s, left, top, cf;
            if (typeof options === "string" || options instanceof HTMLElement || options instanceof jQuery) {
                f = jQuery(options).eq(0).offset();
            } else if (typeof options === "object" && options.left != null && options.top != null) {
                f = options;
            } else {
                throw new Error("[getTargetOffset] This arguments does not fit the format.");
            }

            cf = this.offset();
            a = f.left;
            b = cf.left;
            s = sg.scaleX;
            left = (a - b) / s + b;

            a = f.top;
            b = cf.top;
            s = sg.scaleY;
            top = (a - b) / s + b;

            return {
                left: left,
                top: top
            };
        }
    });




    //////////////////////////////////////////////////////////////////////////////////////////
    var zidx = 100;
    var isDrag = false;

    function setDraggable(selector, options) {

        var options = options || {};

        function b(bstr) {
            switch (typeof bstr) {
            case "string":
                return bstr == "true" ? true : false;
                break;
            case "boolean":
                return bstr;
                break;
            default:
                return false;
            }
        }

        $(selector).each(function (i, e) {
            sg.setOption(this);
            var $this = $(this);
            var draggableOptions = {
                dropSelector: options.dropSelector || $this.attr("data-sg-drop-selector"),
                revert: b(options.revert || $this.attr("data-sg-revert")),
                fail: options.fail || $this.attr("data-sg-drop-fail"),
                success: options.success || $this.attr("data-sg-drop-success"),
                clone: b(options.clone || $this.attr("data-sg-clone"))
            };

            $this
                .attr("data-sg-drop-selector", draggableOptions.dropSelector)
                .attr("data-sg-revert", draggableOptions.revert)
                .attr("data-sg-drop-fail", typeof draggableOptions.fail === "string" ? draggableOptions.fail : "")
                .attr("data-sg-drop-success", typeof draggableOptions.success === "string" ? draggableOptions.success : "")
                .attr("data-sg-clone", draggableOptions.clone)
                .data("draggableOptions", draggableOptions);


            $this.css({
                //잔상 제거 위함
                "overflow": "hidden",
                //draggable에서 cursor속성으로 설정할 경우 상속값 때문에 다른값으로 바뀌어 적용 되는 경우가 있기 때문에 이곳에서 처리.
                "cursor": "pointer"
            });

            ///////////////////////////draggable////////////////////////////////////
            $this.draggable({
                helper: (function () {
                    return draggableOptions.clone ? "clone" : undefined;
                })(),
                //cursor: 'pointer',  //Since inherit the value of the parent
                revert: function () {
                    isDrag = false;

                    var options = this.data("draggableOptions"),
                        failAction = options.fail,
                        successAction = options.success,
                        dropselector = options.dropSelector,
                        bool = options.revert,
                        isClone = options.clone,
                        hit = false,
                        helper = this.data("helper") || this,
                        rect = helper.getRect(),
                        callReturn;

                    if (dropselector) {
                        //checking, center point of drag object
                        $(dropselector).each(function (i, e) {
                            if (hit) return;
                            hit = $(this).hitTestPoint({
                                x: rect.x + rect.width * 0.5 * sg.scaleX,
                                y: rect.y + rect.height * 0.5 * sg.scaleY,
                                transparency: false,
                                scaleX: sg.scaleX,
                                scaleY: sg.scaleY
                            });
                        });
                    }

                    console.log(this.data("originPos"));

                    if (hit) {
                        //disconnect to previous connection
                        var tempHit = this.data("hit");
                        if (tempHit) {
                            var tempDragObjs = tempHit.data("dragObjs");
                            //remove 'this' from array
                            if (tempDragObjs) sg.splice(tempDragObjs, this);
                        }

                        //save new hit
                        this.data("hit", hit);

                        var dragObjs = hit.data("dragObjs") || [];

                        sg.splice(dragObjs, this);
                        dragObjs.push(this);
                        hit.data("dragObjs", dragObjs);

                        bool = false;

                        //when hitting update origin position for revert
                        //this.offset( f );
                        //this.offset( this.getTargetOffset(hit) );
                        //this.animate( this.getTargetOffset(this.data( "originPos" )) );

                        var newOriginPos;

                        if (this.css("position") == "absolute") {
                            var nop = {
                                left: hit[0].offsetLeft + (hit.width() - this.width()) * 0.5,
                                top: hit[0].offsetTop + (hit.height() - this.height()) * 0.5
                            };

                            //#150211					
                            //this.css( nop ).data( "originPos", nop );
                            this.data("originPos", nop);

                        } else {
                            //position이 'relative'일 경우의 drop처리
                            //newOriginPos는 revert처리시 사용할 새로운 위치
                            var or = this.data("originPos");
                            newOriginPos = {
                                left: hit[0].offsetLeft - or.left + (hit[0].offsetWidth - this[0].offsetWidth) * 0.5,
                                top: hit[0].offsetTop - or.top + (hit[0].offsetHeight - this[0].offsetHeight) * 0.5
                            };
                            this.data("newOriginPos", newOriginPos);

                            //#150211
                            /*
							if( isClone ){
								this.css( "position", "relative" ).css( newOriginPos );
							}else{
								this.css( newOriginPos );
							}
							*/

                        }

                        //#150211
                        this.offset(this.getTargetOffset(hit));


                        if (successAction) {
                            if (sg.isFunction(successAction)) {
                                callReturn = successAction.apply(this[0]);
                            } else {
                                callReturn = eval(successAction);
                            }
                        }

                        if (typeof callReturn === "boolean") bool = callReturn;

                    } else if (!hit && failAction) {
                        if (sg.isFunction(failAction)) {
                            callReturn = failAction.apply(this[0]);
                        } else {
                            callReturn = eval(failAction);
                        }
                        if (typeof callReturn === "boolean") bool = callReturn;
                    }

                    if (bool) {
                        var nop;
                        if (isClone) {
                            console.log("clone revert");
                            bool = false;
                            if (this.data("newOriginPos")) {
                                nop = {
                                        left: this[0].offsetLeft,
                                        top: this[0].offsetTop
                                    }
                                    //this.data("originPos", nop);
                                this.data("newOriginPos", nop);
                            } else {
                                nop = this.data("originPos");
                            }
                            helper.clone().appendTo(helper.parent()).animate(nop, {
                                complete: function () {
                                    this.remove()
                                }
                            });
                        } else {
                            console.log("revert");
                            if (this.css("position") == "absolute") {
                                bool = false;
                                this.animate(this.data("originPos"));
                            } else if (nop = this.data("newOriginPos")) {
                                //drop이후에는 revert 위치를 다르게.
                                bool = false;
                                this.animate(nop);
                            }
                        }
                    }
                    return bool;
                },

                start: function (e, ui) {
                    var $this = $(this);

                    ////#150211 moved from revert function
                    $this.data("_originPos", {
                        left: this.offsetLeft,
                        top: this.offsetTop
                    }).data("originPos", {
                        left: this.offsetLeft,
                        top: this.offsetTop
                    });
                    ////

                    isDrag = true;
                    sg.$body.css("overflow-y", "hidden");

                    var op = $this.data("draggableOptions");

                    if ($this.css("position") != "absolute" && !op.clone) {
                        ui.position.left *= sg.scaleX;
                        ui.position.top *= sg.scaleY;
                    }

                    $this
                        .data("disPos", {
                            left: ui.position.left - e.clientX,
                            top: ui.position.top - e.clientY
                        }).css("z-index", zidx++);


                    if (op && op.clone) {
                        $this.data("helper", ui.helper);
                        //#150211
                        ui.helper.css("z-index", zidx++);
                    }
                },

                stop: function (e) {
                    if (!isDrag) sg.$body.css("overflow-y", "auto");

                },

                drag: function (e, ui) {
                    var disPos = $(this).data("disPos");
                    ui.position = {
                        left: (disPos.left + e.clientX) / sg.scaleX,
                        top: (disPos.top + e.clientY) / sg.scaleY
                    };
                }
            });

        })

    }

    function resetDragPosition(selector, isAnimate) {
        $(selector).each(function (i, e) {
            var $this = $(this);
            var _op = $this.data("_originPos");
            var _rp = {
                left: 0,
                top: 0
            };

            //reset position
            if ($this.css("position") == "relative") {
                if (isAnimate) $this.animate(_rp);
                else $this.css(_rp);
            } else {
                if (_op) {
                    if (isAnimate) $this.animate(_op);
                    else $this.css(_op);
                }
            }
        });
    }


    function resetDraggable(selector, isAnimate) {
        resetDragPosition(selector);

        /*Se corrige que se enlace correctamente denuevo el drag
         * @Author Jorge lozano
         * @Date 04/03/2015
         */
        $(selector).each(function (i, e) {

            var $this = $(this);
            var _op = $this.data("_originPos");
            //reset originPos and newOriginPos
            $this.data("newOriginPos", null);
            if (_op) $this.data("originPos", _op);

            //hit disconnect
            var hit = $this.data("hit");
            if (hit) {
                var dragObjs = hit.data("dragObjs");
                if (dragObjs) {
                    sg.splice(dragObjs, this);
                }
            }
            $this.data("hit", null);
        });
    }

    function destroyDraggable(selector) {
        sg.resetDraggable(selector);
        $(selector).draggable("disable");
    }

    //drop check
    function dropCheck(dropObj, dragObj) {
        var $dropObj = $(dropObj);
        var $dragObj = $(dragObj);
        var dragObjs = $dropObj.data("dragObjs");

        if (!(dragObjs && dragObjs.length > 0)) return false;

        for (var k = 0; k < dragObjs.length; k++) {
            if (dragObjs[k][0] == $dragObj[0]) return true;
        }
        return false;
    }

    //Removed from the array
    function splice(arr, target) {
        for (var k = 0; k < arr.length; k++) {
            if (arr[k].jquery) {
                if (arr[k][0] == $(target)[0]) {
                    arr.splice(k, 1);
                }
            } else {
                if (arr[k] == target) {
                    arr.splice(k, 1);
                }
            }
        }
        return arr;
    }

    sg.extend({
        splice: splice,
        dropCheck: dropCheck,
        setDraggable: setDraggable,
        resetDragPosition: resetDragPosition,
        resetDraggable: resetDraggable,
        destroyDraggable: destroyDraggable
    });

    sg.addCustomAttr({
        name: "sg-draggable",
        init: function () {
            sg.setDraggable("[data-sg-draggable]");
        },
        applyAll: true
    });

})(sg)