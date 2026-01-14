/**
 * 将Date对象格式化为指定的字符串格式
 *
 * @param {Date} date - 要格式化的日期对象
 * @param {string} format - 目标格式字符串，例如："yyyy年MM月dd日", "yyyy/MM/dd HH:mm:ss", "MM-dd HH:mm"
 * @returns {string} 格式化后的日期字符串
 */
function dateFormat(date, format) {
    let result = ''
    if(!date){
        return ''
    }
    const format0 = format || 'yyyy/MM/dd HH:mm:ss'

    // 有效的 Date 对象一致性
    const Date0 = new Date(date);

    const o = {
        'M+': Date0.getMonth() + 1, // 月份
        'd+': Date0.getDate(), // 日
        'h+': Date0.getHours() % 12 === 0 ? 12 : Date0.getHours() % 12, // 12小时制
        'H+': Date0.getHours(), // 24小时制
        'm+': Date0.getMinutes(), // 分
        's+': Date0.getSeconds(), // 秒
        'q+': Math.floor((Date0.getMonth() + 3) / 3), // 季度
        'S': Date0.getMilliseconds() // 毫秒
    };

    // 替换年份 'yyyy'
    if (/(y+)/.test(format0)) {
        result = format0.replace(RegExp.$1, (Date0.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    // 替换 'AM/PM'
    if (/(A|a)/.test(format0)) {
        const ampm = Date0.getHours() < 12 ? 'AM' : 'PM';
        result = format0.replace(RegExp.$1, RegExp.$1 === 'a' ? ampm.toLowerCase() : ampm);
    }

    // 替换其他时间单位 'MM', 'dd', 'HH' 等
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format0)) {
            const value = o[k];
            // $1 匹配到的字符串，例如 'MM'
            // 如果是毫秒 'S'，则不补零
            result = format0.replace(RegExp.$1, (RegExp.$1.length === 1) ? (value) : (("00" + value).substr(("" + value).length)));
        }
    }

    return result;
}

/**
 * 计算两个日期之间相差的天数
 *
 * @param {Date} dateFrom - 开始日期 (Date 对象)
 * @param {Date} dateTo - 结束日期 (Date 对象)
 * @returns {number | null} 相差的天数（向下取整）。如果日期无效，则返回 null。
 * 结果为正数表示 dateTo 在 dateFrom 之后；负数表示 dateFrom 在 dateTo 之后。
 */
function days(dateFrom, dateTo) {
    // 1. 有效的 Date 对象一致性
    const DateFrom0 = new Date(dateFrom);
    const DateTo0 = new Date(dateTo);

    // 2. 计算两个日期的时间戳差值 (毫秒)
    // Date.getTime() 返回从 1970 年 1 月 1 日 00:00:00 UTC 至今的毫秒数
    const timeDifference = DateTo0.getTime() - DateFrom0.getTime();

    // 3. 定义一天对应的毫秒数
    const msPerDay = 1000 * 60 * 60 * 24;

    // 4. 将毫秒差值转换为天数
    // Math.floor() 用于向下取整，确保得到完整的经过天数
    const dayDifference = Math.floor(timeDifference / msPerDay);

    return dayDifference;
}

export {
    dateFormat,
    days
}
export default {
    dateFormat,
    days
}