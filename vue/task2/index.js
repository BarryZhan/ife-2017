function PubSub() {
    this.handlers = {}
}

PubSub.prototype = {
    on (handlerType, handler) {
        if (!this.handlers.hasOwnProperty(handlerType)) {
            this.handlers[handlerType] = []
        }
        this.handlers[handlerType].push(handler)
    },
    emit (handlerType) {
        let args = Array.prototype.slice.call(arguments, 1)
        this.handlers[handlerType] && this.handlers[handlerType].forEach((handler) => {
            handler(...args)
        })
    }
}


function Observer(data) {
    this.data = data
    this.pubsub = new PubSub()
    this.walk(data)
}

Observer.prototype.walk = function (obj) {
    // 遍历出所有可枚举的key
    Object.keys(obj).forEach(key => {
        let val = obj[key]
        this.pubsub.emit(key, val)

        // 如果值是个对象，就递归它，get/set
        if (typeof val === 'object') {
            new Observer(val)
        }
        // 为属性增加上get/set
        this.convert(key, val)
    })
}

Observer.prototype.convert = function (key, val) {
    var that = this
    Object.defineProperty(this.data, key, {
        enumerable: true,  // 可枚举
        configurable: true, // 可配置
        get () {
            console.log(`你访问了${key}`)
            return val
        },
        set (newVal) {
            console.log(`你设置了${key}，新的值为${newVal}`)
            that.pubsub.emit(key, val, newVal)
            val = newVal
            // 如果新赋的值是个对象，就递归他，加上get/set
            if (typeof val === 'object') {
                new Observer(val)
            }
        }
    })
}

Observer.prototype.$watch = function (arrt, callback) {
    this.pubsub.on(arrt, callback)
}


let app1 = new Observer({
    name: 'yougwind',
    age: 25
})


app1.data.name = {
    lastName: 'libin',
    firstName: 'zhan'
}

// 输出 '你访问了 lastName'
app1.data.name.lastName

// 输出'你设置了firstName，新的值为lalala'
app1.data.name.firstName = 'lalala'

// 实现 $watch 这个 API
app1.$watch('age', function (val, newVal) {
    console.log(`我的年纪变了，从${newVal}变到了${val}`)
})

app1.data.age = 20