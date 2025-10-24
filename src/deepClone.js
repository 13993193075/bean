/**
 * 深度拷贝函数
 *
 * @param {any} obj 需要拷贝的对象、数组或基本类型值
 * @param {WeakMap} [cache=new WeakMap()] 用于处理循环引用的缓存
 * @returns {any} 深度拷贝后的新对象/新值
 */
function deepClone(obj, cache = new WeakMap()) {
    // 1. 基本类型值（包括 null）和函数，直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // 处理函数（尽管技术上函数是对象，但我们通常不克隆它，而是直接引用）
    if (typeof obj === 'function') {
        return obj;
    }

    // 2. 检查循环引用
    // 如果缓存中已存在该对象，说明遇到了循环引用，直接返回缓存中的克隆对象
    if (cache.has(obj)) {
        return cache.get(obj);
    }

    // 3. 处理特定内置对象（Date 和 RegExp）
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
        // g: global, i: ignoreCase, m: multiline, u: unicode, y: sticky
        const flags = obj.global ? 'g' : ''
                    + obj.ignoreCase ? 'i' : ''
                    + obj.multiline ? 'm' : ''
                    + obj.unicode ? 'u' : ''
                    + obj.sticky ? 'y' : '';
        return new RegExp(obj.source, flags);
    }

    // 4. 初始化克隆对象
    // 如果是数组，则初始化为空数组；否则初始化为空对象
    const clone = Array.isArray(obj) ? [] : {};

    // 将克隆对象放入缓存，以处理接下来的递归调用中可能遇到的循环引用
    cache.set(obj, clone);

    // 5. 递归拷贝属性
    for (const key in obj) {
        // 确保只处理对象自身的属性，排除原型链上的属性
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = deepClone(obj[key], cache);
        }
    }

    // 6. 拷贝 Symbol 属性 (ES6/ES2015+)
    if (typeof Object.getOwnPropertySymbols === 'function') {
        Object.getOwnPropertySymbols(obj).forEach(sym => {
            clone[sym] = deepClone(obj[sym], cache);
        });
    }

    return clone;
}

const bean = {
    deepClone
}
export default bean