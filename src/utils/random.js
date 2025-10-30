/**
 * 随机生成一个符合常见验证码规则（4-8位，数字+大小写字母）的字符串。
 * @returns {string} - 随机生成的验证码字符串。
 */
function vercode() {
    // 定义所有允许的字符集 (数字 0-9, 小写字母 a-z, 大写字母 A-Z)
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;

    // 随机确定验证码的长度，范围在 [4, 8] 之间
    // Math.random() * (max - min + 1) + min
    const minLength = 4;
    const maxLength = 8;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let result = '';

    // 循环 'length' 次，每次随机从 characters 中选择一个字符
    for (let i = 0; i < length; i++) {
        // 随机选择字符的索引
        const randomIndex = Math.floor(Math.random() * charactersLength);

        // 将随机选中的字符添加到结果字符串中
        result += characters.charAt(randomIndex);
    }

    return result;
}

/**
 * 随机生成一个固定 6 位长度、包含数字和大小写字母的验证码字符串。
 * @returns {string} - 随机生成的 6 位验证码字符串。
 */
function vercode6(length = 6) {
    // 定义所有允许的字符集 (数字 0-9, 小写字母 a-z, 大写字母 A-Z)
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;

    let result = '';
    // 循环 6 次，每次随机从 characters 中选择一个字符
    for (let i = 0; i < length; i++) {
        // 随机选择字符的索引
        const randomIndex = Math.floor(Math.random() * charactersLength);

        // 将随机选中的字符添加到结果字符串中
        result += characters.charAt(randomIndex);
    }

    return result;
}

const bean = {
    vercode,
    vercode6
}
export default bean