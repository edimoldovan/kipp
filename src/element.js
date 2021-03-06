!function(kipp, document){
  kipp.wrap.define({
    data: function (){
      // API inspired by jQuery
      var storage = {}

      return function (key, value){
        var data = storage[this.id]

        if (!data)
          data = storage[this.id] = {}

        if (value === void+1)
          return data[key]

        return data[key] = value
      }  
    }(),

    each: function (fn, context){
      return kipp.each(this, fn, context)
    },
  
    addClass: function (className){
      // adapted from MooTools
      return this.each(function (element){
        if (clean(element.className).indexOf(className) > -1)
          return
        element.className = clean(element.className + ' ' + className)
      })
    },

    removeClass: function (className){
      // adapted from MooTools
      return this.each(function (element){
        element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1')
      })
    },

    attach: function (event, handler, /* internal */ delegation){
      var split = event.split('.')
        , listeners = []

      if (split[1])
        listeners = this.data(split[1]) || []

      this.each(function(node){
        var params = {
          node: node,
          event: split[0]
        }

        if (delegation)
          params.delegate = delegation

        listeners.push(kipp.listener(params, handler))
      })

      if (split[1])
        this.data(split[1], listeners)

      return this
    },

    detach: function (namespace){
      listenerMethod(this, 'detach', namespace, null, true)
      this.data(namespace, null)
      return this
    },

    fire: function (namespace, args){
      return listenerMethod(this, 'fire', namespace, args)
    },

    delegate: function (event, delegation, handler){
      return this.attach(event, handler, delegation)
    }
  })

  function clean(str){
    return str.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '')
  }

  function listenerMethod(wrapper, method, namespace, args){
    var data = wrapper.data(namespace)

    if (data)
      kipp.each(data, function (listener){
        listener[method].apply(wrapper, args)
      })

    return wrapper
  }
}(kipp, document);
