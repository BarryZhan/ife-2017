// 观察者构造函数
function Observer(data) {
    this.data = data
    this.walk(data)
}

let p = Observer.prototype

p.walk = function (obj) {
    // 遍历出所有可枚举的key
    Object.keys(obj).forEach(key => {
        let val = obj[key]
        // 为属性增加上get/set
        this.convert(key, val)
    })
}

p.convert = function (key, val) {
    Object.defineProperty(this.data, key, {
        enumerable: true,  // 可枚举
        configurable: true, // 可配置
        get () {
            console.log(`你访问了${key}`)
            return val
        },
        set (newVal) {
            console.log(`你设置了${key}，新的值为${newVal}`)
        }
    })
}

let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

let app2 = new Observer({
    university: 'bupt',
    major: 'computer'
});

app1.data.name // 你访问了 name
app1.data.age = 100  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science