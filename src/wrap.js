!function (kipp, document){
  var proto = {}
    , query

  kipp.wrap = function (nodes, context){
    // passed in a CSS selector
    if (typeof nodes == 'string')
      nodes = query(nodes, context)

    // passed in single node
    if (!nodes.length)
      nodes = [nodes]

    var wrapper = Object.create(proto)
      , i = 0
      , l = nodes.length

    for (; i < l; i++)
      wrapper[i] = nodes[i]

    wrapper.length = l
    wrapper.id = kipp.id()
    return wrapper
  }

  kipp.extend(kipp.wrap, {
    define: function(name, fn){
      if (typeof name != 'string'){
        for (var i in name)
          kipp.wrap.define(i, name[i])
        return
      }
      proto[name] = fn
    },

    defineEngine: function (fn){
      query = fn
    }
  })

  // QSA default selector engine, supports real browsers and IE8+
  kipp.wrap.defineEngine(function (selector, context){
    if (typeof context == 'string')
      context = document.querySelector(context)

    return (context || document).querySelectorAll(selector)
  })
}(kipp, document)
