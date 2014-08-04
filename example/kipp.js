/*jslint browser:true */
/*jslint nomen:true */
/*jslint plusplus: true */
/*global kipp,RSVP,Router,Handlebars,snack,CKEDITOR,FileReader,App,console,alert,*/

/*!
  * kipp.js (c) Eduard Moldovan
  * https://github.com/edimoldovan/kipp
  * MIT License
*/

console.log("e");

if (typeof Object.create !== "function") {
	Object.create = function(o) {
		"use strict";
		function F() {}
		F.prototype = o;
		return new F();
	};
}
// core
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
					if (!proto[i] || typeof ext[i] !== "function") {
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
		},

		each: function (obj, fn, context) {
			var key,
				i,
				l;

			if (obj.length === undefined) {
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						fn.call(context, obj[key], key, obj);
					}
				}
					
				return obj;
			}

			for (i = 0, l = obj.length; i < l; i++) {
				fn.call(context, obj[i], i, obj);
			}

			return obj;
		},

		isArray: function (obj) {
			return obj instanceof Array || toString.call(obj) === "[object Array]";
		},

		indexOf: indexOf ? function(item, array) {
				return indexOf.call(array, item);
			} : function (item, array) {
				var i,
					l;

				for (i = 0, l = array.length; i < l; i++) {
					if (array[i] === item) {
						return i;
					}
			}

			return -1;
		}

	});

}(window));

// ajax
(function(kipp, window, document) {
	"use strict";

	kipp.JSONP = function(params, callback){
		// adapted from Zepto
		var jsonpString = "jsonp" + kipp.id(), 
			script = document.createElement("script"),
			running = false,
			publik;

		kipp.JSONP[jsonpString] = function(data){
			running = false;
			delete kipp.JSONP[jsonpString];
			callback(data);
		};

		if (typeof params.data === "object") {
			params.data = kipp.toQueryString(params.data);
		}

		publik = {
			send: function () {
				running = true;
				script.src = params.url + "?" + params.key + "=kipp.JSONP." + jsonpString + "&" + params.data;
				document.getElementsByTagName("head")[0].appendChild(script);
			},

			cancel: function () {
				running && script.parentNode && script.parentNode.removeChild(script);
				running = false;
				kipp.JSONP[jsonpString] = function () {
				  delete kipp.JSONP[jsonpString];
				};
			}
		};

		if (params.now !== false) {
			publik.send();
		}

		return publik;
	};

} (kipp, window, document));












