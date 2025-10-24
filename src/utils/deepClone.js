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

/**
 * 深度拷贝函数，并在拷贝叶节点值时应用一个转换函数。
 *
 * @param {any} obj - 需要拷贝的对象、数组或基本类型值。
 * @param {function} valueMapper - 接收叶节点值作为参数，并返回新值的转换函数。
 * @param {WeakMap} [cache=new WeakMap()] - 用于处理循环引用的缓存。
 * @returns {any} 深度拷贝并转换后的新对象/新值。
 */
function deepCloneAndMap(obj, valueMapper, cache = new WeakMap()) {
    // 1. 基本类型值（包括 null）和函数，**应用 valueMapper**
    
    // 如果是基本类型值（包括 null），则认为是叶节点，应用 valueMapper
    if (obj === null || typeof obj !== 'object') {
        // 对基本类型值应用转换函数
        return valueMapper(obj);
    }
    
    // 如果是函数，通常我们不克隆它，也不转换它的值，直接返回
    if (typeof obj === 'function') {
        return obj;
    }

    // 2. 检查循环引用 (与原函数逻辑相同)
    if (cache.has(obj)) {
        return cache.get(obj);
    }

    // 3. 处理特定内置对象（Date 和 RegExp），**应用 valueMapper**
    
    // 对于 Date 和 RegExp 这种对象实例，我们通常将它们的**值**视为叶节点，
    // 克隆实例本身后，再对这个克隆实例应用 valueMapper。
    let clone;
    
    if (obj instanceof Date) {
        clone = new Date(obj.getTime());
    } else if (obj instanceof RegExp) {
        // 提取 flags
        const flags = (obj.global ? 'g' : '')
                    + (obj.ignoreCase ? 'i' : '')
                    + (obj.multiline ? 'm' : '')
                    + (obj.unicode ? 'u' : '')
                    + (obj.sticky ? 'y' : '');
        clone = new RegExp(obj.source, flags);
    } 
    
    // 检查是否是内置对象（Date/RegExp），如果是，对克隆后的实例应用转换
    if (clone) {
        return valueMapper(clone);
    }

    // 4. 初始化克隆对象 (普通对象和数组)
    clone = Array.isArray(obj) ? [] : {};

    // 将克隆对象放入缓存
    cache.set(obj, clone);

    // 5. 递归拷贝属性
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // 递归调用自身，对子属性进行深拷贝和转换
            clone[key] = deepCloneAndMap(obj[key], valueMapper, cache);
        }
    }

    // 6. 拷贝 Symbol 属性
    if (typeof Object.getOwnPropertySymbols === 'function') {
        Object.getOwnPropertySymbols(obj).forEach(sym => {
            // 递归调用自身，对 Symbol 属性的值进行深拷贝和转换
            clone[sym] = deepCloneAndMap(obj[sym], valueMapper, cache);
        });
    }

    // 7. 返回深度克隆并转换后的对象/数组
    return clone;
}

/**
 * 健壮的数据类型判断函数
 *
 * @param {any} value 需要判断类型的值
 * @returns {string} 小写的类型字符串，例如：'string', 'number', 'array', 'function', 'object', 'null', 'undefined'
 */
function typeOfValue(value) {
    // 1. 处理基本类型值（typeof 准确的部分）
    const type = typeof value;

    // 'string', 'number', 'boolean', 'symbol', 'bigint', 'function', 'undefined'
    if (type !== 'object') {
        return type;
    }

    // 2. 处理 null (typeof 的缺陷：typeof null === 'object')
    if (value === null) {
        return 'null';
    }

    // 3. 处理对象类型值 (使用 Object.prototype.toString.call() 获取内部 [[Class]] 属性)
    // 结果格式为：[object Class]
    const classString = Object.prototype.toString.call(value);

    // 提取 'Array', 'Date', 'RegExp', 'Map', 'Set', 'Object' 等 Class 名称
    const className = classString.slice(8, -1);

    // 4. 特殊处理 Array.isArray() 
    // 虽然 className 已经是 'Array'，但 Array.isArray 更快且明确
    if (className === 'Array') {
        return 'array';
    }

    // 5. 将其他内置对象和普通对象名称转为小写返回
    return className.toLowerCase();
}

/**
 * 判断一个字符串是否是有效的 JSON 格式
 *
 * @param {string} strValue - 要检查的字符串值
 * @returns {boolean} 如果字符串是有效的 JSON 格式则返回 true，否则返回 false
 */
function isJsonString(strValue) {
    // 1. 确保输入是一个字符串，如果不是，则直接返回 false
    // JSON 格式只能是字符串
    if (typeof strValue !== 'string') {
        return false;
    }

    // 2. 尝试解析字符串
    try {
        // 使用 JSON.parse() 尝试解析。
        // 如果解析成功，它就会返回解析后的对象或值。
        // 如果解析失败，就会抛出 SyntaxError 错误。
        JSON.parse(strValue);
        
        // 3. 额外的检查 (可选但推荐): 
        // 确保解析结果不是原始类型值，例如 "123" 或 "true"
        // 某些场景下，用户希望 JSON 字符串必须是对象或数组的字符串表示
        // const parsed = JSON.parse(strValue);
        // if (typeof parsed !== 'object' || parsed === null) {
        //     // 如果你想排除 "123", "null", "true" 这些原始值的 JSON 字符串，可以取消注释
        //     // return false; 
        // }

    } catch (e) {
        // 捕获任何解析错误（通常是 SyntaxError），表示格式不符合 JSON 规范
        return false;
    }

    // 4. 解析成功，返回 true
    return true;
}

/**
 * 遍历树形结构（对象或数组）的所有叶节点，将叶节点的值收集到数组中。
 *
 * 叶节点被定义为：值不是普通对象或数组的节点。
 *
 * @param {object|Array} tree - 要扁平化处理的树形结构对象或数组。
 * @param {Array<any>} [result=[]] - 存储叶节点值的数组（递归内部使用）。
 * @returns {Array<any>} 包含所有叶节点值的数组。
 */
function flattenTreeValues(tree, result = []) {
    // 确保输入是对象或数组。如果不是，或者为 null，则直接返回结果数组。
    if (typeof tree !== 'object' || tree === null) {
        return result;
    }

    // 遍历对象的键（如果是数组，键就是索引）
    for (const key in tree) {
        // 确保只处理对象自身的属性，排除原型链上的属性
        if (Object.prototype.hasOwnProperty.call(tree, key)) {
            const value = tree[key];

            // 判断当前值是否为“叶节点”
            // 检查：值不是对象，且值不是 null
            if (typeof value !== 'object' || value === null) {
                // 1. 如果是基本类型值（叶节点），则将其压入结果数组
                result.push(value);
            } else {
                // 2. 如果是对象或数组（非叶节点），则进行递归调用
                // 注意：这里没有处理 Date, RegExp, Set, Map 等特殊对象，
                // 默认将它们视为非叶节点，直到它们内部的值被遍历完（这通常是不对的）
                // 
                // 为了更精确地实现“叶节点”概念，我们将 Date, RegExp 等内置对象视为叶节点：
                const isArray = Array.isArray(value);
                const isPlainObject = !isArray && Object.prototype.toString.call(value) === '[object Object]';
                
                if (isArray || isPlainObject) {
                    // 如果是普通数组或普通对象，则递归
                    flattenTreeValues(value, result);
                } else {
                    // 如果是像 Date, RegExp, Map, Set 等特殊内置对象，
                    // 我们将其视为叶节点的值（而不是继续遍历其内部结构）
                    result.push(value);
                }
            }
        }
    }

    return result;
}

/**
 * 将扁平化的对象数组转换为树形结构数据，并在每个节点中保留原始数据。
 *
 * @param {Object[]} flatArray 待转化的扁平数组。
 * @param {Object} inputFields 描述输入数组中字段名的对象。
 * @param {string} inputFields.idField 节点代码字段名。
 * @param {string} inputFields.textField 节点文本字段名。
 * @param {string} inputFields.parentField 父节点代码字段名。
 * @param {Object} outputFields 描述输出树形结构中字段名的对象。
 * @param {string} outputFields.idField 输出节点代码字段名 (接收 inputFields.idField 的值)。
 * @param {string} outputFields.textField 输出节点文本字段名 (接收 inputFields.textField 的值)。
 * @param {string} outputFields.childrenField 子节点数组字段名。
 * @param {string} outputFields.originDataField 原始数据字段名 (用于存储原始的 item 对象)。
 * @returns {Object[]} 转换后的树形结构数组。
 */
function arrayToTree(flatArray, inputFields, outputFields) {
    // 1. 参数校验和字段提取
    if (!Array.isArray(flatArray) || flatArray.length === 0) {
        return [];
    }

    // 提取输入字段名
    const {
        idField: inputId,
        textField: inputText,
        parentField: inputParent
    } = inputFields;

    // 提取输出字段名
    const {
        idField: outputId,
        textField: outputText,
        childrenField: outputChildren,
        originDataField: outputRawData // 新增：用于存储原始数据的字段名
    } = outputFields;

    // 2. 初始化辅助数据结构
    const tree = [];
    const childrenMap = new Map(); // 存储所有节点，键为节点ID
    const rootCandidates = new Set(); // 存储所有可能的根节点ID

    // 3. 第一次遍历：创建所有节点并建立 ID-Node 映射
    for (const item of flatArray) {
        // 关键：创建一个只包含转换后字段和子节点的结构
        const newNode = {
            // 映射输入字段到输出字段
            [outputId]: item[inputId],
            [outputText]: item[inputText],
            [outputChildren]: [], // 初始化子节点数组
            [outputRawData]: item // 新增：存储原始数据对象
        };
        
        childrenMap.set(newNode[outputId], newNode);
        rootCandidates.add(newNode[outputId]); // 假设所有节点都是根节点
    }

    // 4. 第二次遍历：连接父子关系
    for (const node of childrenMap.values()) {
        const parentId = node[outputRawData][inputParent]; // 从原始数据中获取父ID

        // 查找父节点
        const parentNode = childrenMap.get(parentId);

        if (parentNode) {
            // 如果找到了父节点，则将当前节点添加到父节点的子节点列表中
            parentNode[outputChildren].push(node);

            // 如果当前节点有父节点，它就不是根节点，从根节点候选中移除
            rootCandidates.delete(node[outputId]);
        }
    }
    
    // 5. 组装最终树结构
    // 最终的树结构由所有仍在 rootCandidates 列表中的节点组成
    for (const rootId of rootCandidates) {
        const rootNode = childrenMap.get(rootId);
        if (rootNode) {
             tree.push(rootNode);
        }
    }

    return tree;
}

const bean = {
    deepClone,
    deepCloneAndMap,
    typeOfValue,
    isJsonString,
    flattenTreeValues,
    arrayToTree
}
export default bean