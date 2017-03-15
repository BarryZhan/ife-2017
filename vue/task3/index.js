function Observer(data) {
    this.data = data
    // 事件队列
    this.handlers = {}
    this.walk(data)
}


Observer.prototype.emit = function (handlerType) {
    let args = Array.prototype.slice.call(arguments, 1)
    this.handlers[handlerType] && this.handlers[handlerType].forEach((handler) => {
        handler(...args)
    })
}

Observer.prototype.on = function (handlerType, handler) {
    if (!this.handlers[handlerType]) {
        this.handlers[handlerType] = []
    }
    this.handlers[handlerType].push(handler)
}

Observer.prototype.walk = function (obj) {
    // 遍历出所有可枚举的key
    Object.keys(obj).forEach(key => {
        let val = obj[key]

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
            that.emit(key, newVal, val)
            val = newVal
            // 如果新赋的值是个对象，就递归他，加上get/set
            if (typeof val === 'object') {
                new Observer(val)
            }
        }
    })
}

Observer.prototype.$watch = function (arrt, callback) {
    this.on(arrt, callback)
}

let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。