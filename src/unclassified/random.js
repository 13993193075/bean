/**
 * 在指定的字符集内生成一个指定长度的随机字符串。
 *
 * @param {number} length - 随机字符串的所需长度。
 * @param {string} characterSet - 用于生成字符串的字符集（如 '0123456789abcdef'）。
 * @returns {string} - 生成的随机字符串。
 * @throws {Error} - 如果长度不是正数或字符集为空。
 */
function random(length, characterSet) {
    // 1. 输入校验
    if (typeof length !== 'number' || length <= 0) {
        throw new Error("长度参数必须是一个大于零的数字。");
    }
    if (typeof characterSet !== 'string' || characterSet.length === 0) {
        throw new Error("字符集参数必须是一个非空字符串。");
    }

    const characterSetLength = characterSet.length;
    let result = '';

    // 2. 循环 'length' 次，每次随机选择一个字符
    for (let i = 0; i < length; i++) {
        // 随机选择字符的索引
        const randomIndex = Math.floor(Math.random() * characterSetLength);

        // 将随机选中的字符添加到结果字符串中
        result += characterSet.charAt(randomIndex);
    }

    return result;
}

/**
 * 随机生成一个符合常见验证码规则（4-8位，数字+大小写字母）的字符串。
 * @returns {string} - 随机生成的验证码字符串。
 */
function vercode() {
    // 定义所有允许的字符集 (数字 0-9, 小写字母 a-z, 大写字母 A-Z)
    const characterSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const characterSetLength = characterSet.length;

    // 随机确定验证码的长度，范围在 [4, 8] 之间
    // Math.random() * (max - min + 1) + min
    const minLength = 4;
    const maxLength = 8;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let result = '';

    // 循环 'length' 次，每次随机从 characterSet 中选择一个字符
    for (let i = 0; i < length; i++) {
        // 随机选择字符的索引
        const randomIndex = Math.floor(Math.random() * characterSetLength);

        // 将随机选中的字符添加到结果字符串中
        result += characterSet.charAt(randomIndex);
    }

    return result;
}

/**
 * 随机生成一个固定 6 位长度、包含数字和大小写字母的验证码字符串。
 * @returns {string} - 随机生成的 6 位验证码字符串。
 */
function vercode6(length = 6) {
    // 定义所有允许的字符集 (数字 0-9, 小写字母 a-z, 大写字母 A-Z)
    const characterSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const characterSetLength = characterSet.length;

    let result = '';
    // 循环 6 次，每次随机从 characterSet 中选择一个字符
    for (let i = 0; i < length; i++) {
        // 随机选择字符的索引
        const randomIndex = Math.floor(Math.random() * characterSetLength);

        // 将随机选中的字符添加到结果字符串中
        result += characterSet.charAt(randomIndex);
    }

    return result;
}

/**
 * 随机生成一个固定 6 位长度、只包含数字的验证码字符串。
 * @returns {string} - 随机生成的 6 位验证码字符串。
 */
function vercode6N(length = 6) {
    // 定义所有允许的字符集 (数字 0-9, 小写字母 a-z, 大写字母 A-Z)
    const characterSet = '0123456789';
    const characterSetLength = characterSet.length;

    let result = '';
    // 循环 6 次，每次随机从 characterSet 中选择一个字符
    for (let i = 0; i < length; i++) {
        // 随机选择字符的索引
        const randomIndex = Math.floor(Math.random() * characterSetLength);

        // 将随机选中的字符添加到结果字符串中
        result += characterSet.charAt(randomIndex);
    }

    return result;
}

export {
    random,
    vercode,
    vercode6,
    vercode6N
}
export default {
    random,
    vercode,
    vercode6,
    vercode6N
}