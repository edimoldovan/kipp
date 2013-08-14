/*jslint browser:true */
/*jslint nomen:true */
/*jslint plusplus: true */
/*global RSVP,Router,Handlebars,snack,CKEDITOR,FileReader,App,console,alert,*/

/*!
  * kipp.js (c) Eduard Moldovan
  * https://github.com/edimoldovan/kipp
  * MIT License
*/


if (typeof Object.create !== "function") {
	Object.create = function(o) {
		"use strict";
		function F() {}
		F.prototype = o;
		return new F();
	};
}

(function(window) {
	"use strict";
	var kipp = window.kipp = {},
		guid = 0,
    	toString = Object.prototype.toString,
    	indexOf = [].indexOf,
    	push = [].push;

    kipp.extend = function() {
    	var target,
    		key,
    		i;

		if (arguments.length === 1) {
			return kipp.extend(kipp, arguments[0]);
		}

		target = arguments[0];

		for (i = 1; i < arguments.length; i++) {
			for (key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					target[key] = arguments[i][key];
				}
			}
		}

		return target;
	};

	kipp.extend({

		bind: function(fn, context, args) {
			args = args || [];
			return function() {
				push.apply(args, arguments);
				return fn.apply(context, args);
			};
		},

		punch: function (obj, method, fn, auto){
			var old = obj[method];

			obj[method] = auto ? function (){
				old.apply(obj, arguments);
				return fn.apply(obj, arguments);
			} : function (){
				var args = [].slice.call(arguments, 0);
				args.unshift(kipp.bind(old, obj));
				return fn.apply(obj, args);
			};
		},

		create: function (proto, ext){
			var obj = Object.create(proto),
				i;

			if (!ext) {
				return obj;
			}
			
			for (i in ext) {
				if (ext.hasOwnProperty(i)) {			
					if (!proto[i] || typeof ext[i] !== 'function') {
						obj[i] = ext[i];
						continue;
					}

					kipp.punch(obj, i, ext[i]);
				}
			}

			return obj;
		},

		id: function (){
			return ++guid;
		}

	});

}(window));















