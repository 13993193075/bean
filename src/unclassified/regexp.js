/**
 * 校验字符串是否为有效的中国大陆手机号码（宽松校验）
 * 规则：以 1 开头，后面跟 10 个数字，共 11 位。
 *
 * @param {string} str - 需要校验的字符串
 * @returns {boolean} - 如果是有效的手机号格式，返回 true；否则返回 false。
 */
function cellphone(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return false;
    }
    
    // 正则表达式：
    // ^      -> 匹配字符串的开始
    // 1      -> 匹配数字 1
    // \d{10} -> 匹配任何数字 (0-9) 十次
    // $      -> 匹配字符串的结束
    const regex = /^1\d{10}$/;
    
    return regex.test(str);
}

/**
 * 校验字符串是否为有效的电子邮件地址格式。
 * * 这个正则是一个常用的、相对宽松但有效的校验模式。
 * 它覆盖了：
 * 1. 局部部分（@符号之前）：允许字母、数字、点号(.)、下划线(_)、连字符(-)。
 * 2. 域名部分（@符号之后）：至少包含一级域名和顶级域名，允许字母、数字、连字符。
 * 3. 顶级域名（最后一段）：必须是至少两位字母（如 .com, .cn, .co.uk）。
 *
 * @param {string} str - 需要校验的字符串
 * @returns {boolean} - 如果是有效的电子邮箱格式，返回 true；否则返回 false。
 */
function email(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return false;
    }

    // 正则表达式解释：
    // ^                           -> 匹配字符串的开始
    // [a-zA-Z0-9._-]+             -> 局部部分：匹配一个或多个字母、数字、点(.)、下划线(_)或连字符(-)
    // @                           -> 必须包含 @ 符号
    // [a-zA-Z0-9.-]+              -> 域名部分：匹配一个或多个字母、数字、点(.)或连字符(-)
    // \.                          -> 必须包含一个点号（用于分隔域名和顶级域名）
    // [a-zA-Z]{2,6}               -> 顶级域名：匹配 2 到 6 个字母 (如 com, cn, info, museum)
    // (?:\.[a-zA-Z]{2,6})?        -> (可选) 匹配二级或多级域名（如 .co.uk）
    // $                           -> 匹配字符串的结束
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(?:\.[a-zA-Z]{2,6})?$/;
    
    return emailRegex.test(str);
}

/**
 * 校验字符串是否符合中等强度的登录密码要求。
 * 规则：
 * 1. 长度在 8 到 16 位之间。
 * 2. 必须包含大小写字母、数字、特殊符号 (@ $ ! % * # ? &) 中的至少两种组合。
 *
 * @param {string} str - 需要校验的密码字符串
 * @returns {boolean} - 如果符合密码要求，返回 true；否则返回 false。
 */
function password(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return false;
    }

    // --- 1. 长度校验 ---
    // 匹配 8 到 16 位任何非换行符的字符
    const lengthRegex = /^.{8,16}$/;
    if (!lengthRegex.test(str)) {
        // console.log("密码长度不符合要求（需 8-16 位）。");
        return false;
    }

    // --- 2. 字符组合校验（使用正向预查 Lookaheads） ---
    
    // 正向预查的定义：
    // (?=.*[a-z]) : 必须包含小写字母
    // (?=.*[A-Z]) : 必须包含大写字母
    // (?=.*\d)    : 必须包含数字
    // (?=.*[@$!%*#?&]) : 必须包含特殊符号
    
    // 构造四个组合的正则，只要满足任意两个即可

    let count = 0;

    // 检查是否包含小写字母
    if (/(?=.*[a-z])/.test(str)) {
        count++;
    }

    // 检查是否包含大写字母
    if (/(?=.*[A-Z])/.test(str)) {
        count++;
    }

    // 检查是否包含数字
    if (/(?=.*\d)/.test(str)) {
        count++;
    }

    // 检查是否包含特殊符号
    if (/(?=.*[@$!%*#?&])/.test(str)) {
        count++;
    }
    
    // 最终判断：至少包含两种类型的字符
    const isCombinationValid = count >= 2;

    // console.log(`满足的字符类型数量: ${count}`);
    return isCombinationValid;
}

/**
 * 验证一个字符串是否符合常见的验证码规则。
 * 规则：长度在 4 到 8 位之间，内容只包含数字和大小写字母。
 * * @param {string} str - 需要验证的字符串。
 * @returns {boolean} - 如果符合规则返回 true，否则返回 false。
 */
function vercode(str) {
    // 1. 检查输入是否为字符串
    if (typeof str !== 'string') {
        return false;
    }

    // 2. 正则表达式解释：
    // ^ 表示字符串的开始
    // [0-9a-zA-Z] 表示字符必须是数字（0-9）或大小写字母（a-z, A-Z）
    // {4,8} 表示字符的长度必须在 4 到 8 位之间（包含 4 和 8）
    // $ 表示字符串的结束
    const Regex = /^[0-9a-zA-Z]{4,8}$/;

    // 3. 执行匹配
    return Regex.test(str);
}

/**
 * 验证一个字符串是否符合固定的 6 位验证码规则。
 * 规则：长度必须是 6 位，内容只包含数字和大小写字母。
 * @param {string} str - 需要验证的字符串。
 * @param {number} length - 验证码必须具备的固定长度
 * @returns {boolean} - 如果符合规则返回 true，否则返回 false。
 */
function vercode6(str, length=6) {
    // 1. 检查输入是否为字符串（可选，但推荐）
    if (typeof str !== 'string') {
        return false;
    }

    // 2. 正则表达式解释：
    // ^ 表示字符串的开始
    // [0-9a-zA-Z] 表示字符必须是数字（0-9）或大小写字母（a-z, A-Z）
    // {6} 表示字符的长度必须恰好是 6 位
    // $ 表示字符串的结束
    const Regex = new RegExp('^[0-9a-zA-Z]{' + length + '}$');

    // 3. 执行匹配
    return Regex.test(str);
}

export {
    cellphone,
    email,
    password,
    vercode,
    vercode6
}
export default {
    cellphone,
    email,
    password,
    vercode,
    vercode6
}