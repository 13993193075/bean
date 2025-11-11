/**
 * 对一个由简单数据类型的值（数值、字符串、日期等）组成的数组进行排序。
 *
 * @param {Array<any>} arr 待排序的简单数据类型数组。
 * @param {'asc' | 'desc'} direction 排序方向：'asc'（升序）或 'desc'（降序）。
 * @param {'locale' | 'natural'} sortType 排序类型：
 * - 'locale': 字典顺序排序。
 * - 'natural': 自然顺序排序。
 * @returns {Array<any>} 排序后的新数组。
 */
function sortSimpleArray(arr, direction, sortType) {
    // 1. 参数校验 (简化)
    if (!Array.isArray(arr)) {
        console.error("第一个参数必须是一个数组。");
        return [];
    }
    const validDirections = ['asc', 'desc'];
    const validSortTypes = ['locale', 'natural'];

    if (!validDirections.includes(direction) || !validSortTypes.includes(sortType)) {
        console.error("排序方向或排序类型参数无效。");
        return [...arr];
    }

    // 2. 创建数组副本
    const sortedArr = arr.slice();

    // 3. 定义类型处理和排序分组规则
    // JavaScript 的 sort() 方法会将 undefined 和 null 移到末尾，
    // 但为了确保排序稳定性和一致性，我们在这里显式处理它们。
    const comparator = (a, b) => {
        const isNullA = (a === null || typeof a === 'undefined');
        const isNullB = (b === null || typeof b === 'undefined');

        // 规则 A: 将 null/undefined 分组到末尾（默认行为）
        if (isNullA && !isNullB) return 1;
        if (!isNullA && isNullB) return -1;
        if (isNullA && isNullB) return 0;

        // 规则 B: 统一转换为字符串进行比较
        // Date 对象会转为 ISO 字符串，Boolean 会转为 'true'/'false'
        const strA = String(a);
        const strB = String(b);

        let comparison = 0;

        // --- 内部比较逻辑 ---
        if (sortType === 'locale') {
            // 字典顺序
            if (strA < strB) {
                comparison = -1;
            } else if (strA > strB) {
                comparison = 1;
            }
        } else if (sortType === 'natural') {
            // 自然顺序 (处理数字串和字母数字串)
            comparison = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
        }

        // 4. 根据排序方向调整结果
        return direction === 'asc' ? comparison : -comparison;
    };

    // 5. 执行排序
    sortedArr.sort(comparator);

    return sortedArr;
}

/**
 * 对一个由对象组成的数组进行多级排序。
 *
 * @param {Object[]} arr 待排序的对象数组。
 * @param {Array<{field: string, direction: 'asc'|'desc', sortType: 'locale'|'natural'}>} sortRules 排序规则数组。
 * - field: 用于排序的对象属性名称（字符串）。
 * - direction: 排序方向，'asc'（升序）或 'desc'（降序）。
 * - sortType: 排序类型，'locale'（字典/字母顺序）或 'natural'（自然顺序）。
 * @returns {Object[]} 排序后的新数组。
 */
function sortObjectArrayMultiLevel(arr, sortRules) {
    // 1. 参数校验
    if (!Array.isArray(arr) || !Array.isArray(sortRules) || sortRules.length === 0) {
        // 如果数组无效或规则为空，则返回数组副本
        return [...arr];
    }

    // 2. 创建数组副本，以确保函数是纯函数（不修改原始数组）
    const sortedArr = arr.slice();

    // 3. 定义多级比较器
    const multiLevelComparator = (a, b) => {
        // 遍历所有排序规则，按顺序进行比较
        for (const rule of sortRules) {
            const { field, direction, sortType } = rule;

            // 检查规则的有效性
            if (!field || !['asc', 'desc'].includes(direction) || !['locale', 'natural'].includes(sortType)) {
                console.warn(`跳过无效的排序规则: ${JSON.stringify(rule)}`);
                continue; // 跳过当前规则，尝试下一个
            }
            
            // 获取待比较的字段值
            const valA = a[field];
            const valB = b[field];

            let comparison = 0;
            
            // --- 核心比较逻辑 ---
            
            // 为了实现自然排序和字典排序的一致性，我们将值统一转换为字符串进行比较
            const strA = String(valA);
            const strB = String(valB);
            
            if (sortType === 'locale') {
                // 字典顺序 (Lexicographical Order)
                if (strA < strB) {
                    comparison = -1;
                } else if (strA > strB) {
                    comparison = 1;
                }
            } else if (sortType === 'natural') {
                // 自然顺序 (Natural Sort Order)
                // 使用 localeCompare 配合 { numeric: true } 选项
                comparison = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
            }

            // --- 调整排序结果并返回 ---
            
            // 如果 comparison 不为 0，说明在当前字段上找到了差异，可以直接返回结果
            if (comparison !== 0) {
                // 根据排序方向调整比较结果
                return direction === 'asc' ? comparison : -comparison;
            }

            // 如果 comparison 为 0 (值相等)，则继续循环，使用下一个规则进行比较
        }

        // 如果所有规则都比较完了，值仍然相等，则认为它们的相对顺序不重要
        return 0;
    };

    // 4. 执行排序
    sortedArr.sort(multiLevelComparator);

    return sortedArr;
}

/**
 * 对一个由简单数据类型组成的数组进行去重。
 * 使用 Set 对象，这是现代 JavaScript 中最推荐和最简洁的方法。
 *
 * @param {Array<any>} arr 待去重的数组（可包含数值、字符串、布尔值、null、undefined 等）。
 * @returns {Array<any>} 包含唯一元素的新数组。
 */
const uniqueSimpleArray = (arr) => {
    // 1. 检查输入是否为数组
    if (!Array.isArray(arr)) {
        console.error("输入必须是一个数组。");
        return [];
    }

    // 2. 创建一个 Set 对象，Set 会自动过滤重复的值
    // 3. 使用扩展运算符 (...) 将 Set 转换回数组
    return [...new Set(arr)];
}

/**
 * 对一个由对象组成的数组进行去重，根据多个指定的字段判断重复。
 * 优化：在判断重复时，同时考虑字段的值和数据类型。
 *
 * @param {Object[]} arr 待去重的对象数组。
 * @param {string[]} fields 用于判断重复的字段名数组。当所有指定字段的值和类型都相同时，视为重复。
 * @returns {Object[]} 包含唯一元素的新数组，保留第一次出现的记录。
 */
function uniqueObjectArrayByFields(arr, fields) {
    // 1. 参数校验
    if (!Array.isArray(arr) || arr.length === 0) {
        return [];
    }
    if (!Array.isArray(fields) || fields.length === 0) {
        console.warn("未指定用于判断重复的字段，将返回原始数组副本。");
        return [...arr];
    }

    // 用于存储已见过的唯一键
    const seenKeys = new Set();
    const uniqueArray = [];
    const DELIMITER = "|||";

    // 2. 遍历原始数组
    for (const item of arr) {
        // 3. 构建唯一键 (同时包含值和类型)
        const keyParts = [];
        
        for (const field of fields) {
            const value = item[field];
            const type = typeof value;

            let valueString;
            
            // 确保复杂类型（如对象、日期）也能被正确且唯一地表示
            if (type === 'object' && value !== null) {
                // 对于对象/数组/日期，使用 JSON 序列化
                valueString = JSON.stringify(value);
            } else if (type === 'undefined' || value === null) {
                // 明确区分 undefined 和 null
                valueString = String(value);
            } else {
                // 对于简单类型（string, number, boolean），直接转换为字符串
                valueString = String(value);
            }

            // 键结构: [值字符串] + [DELIMITER] + [数据类型]
            // 例如： '1|||number' 或 '1|||string'
            keyParts.push(valueString + DELIMITER + type);
        }
        
        // 最终键由所有字段的键结构连接而成
        const uniqueKey = keyParts.join(DELIMITER);

        // 4. 检查是否重复
        if (!seenKeys.has(uniqueKey)) {
            // 如果这个键是第一次出现，则保留
            seenKeys.add(uniqueKey);
            uniqueArray.push(item);
        }
    }

    return uniqueArray;
}

export {
    sortSimpleArray,
    sortObjectArrayMultiLevel,
    uniqueSimpleArray,
    uniqueObjectArrayByFields
}
export default {
    sortSimpleArray,
    sortObjectArrayMultiLevel,
    uniqueSimpleArray,
    uniqueObjectArrayByFields
}