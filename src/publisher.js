!function (kipp){
  kipp.publisher = function (obj){
    var channels = {}
    obj = obj || {}

    kipp.extend(obj, {
      subscribe: function (channel, handler, context){
        var subscription = {
          fn: handler,
          ctxt: (context || {})
        }

        if (!channels[channel])
          channels[channel] = []

        var publik = {
          attach: function (){
            channels[channel].push(subscription)
          },
          detach: function (){
            channels[channel].splice(kipp.indexOf(handler, channels[channel]), 1)
          }
        }
        publik.attach()
        return publik
      },

      publish: function (channel, argsArray){
        if (!channels[channel])
          return false

        kipp.each(channels[channel], function (subscription){
          subscription.fn.apply(subscription.ctxt, argsArray || [])
        })

        return channels[channel].length
      }
    })

    return obj
  }

  kipp.publisher(kipp)
}(kipp);
