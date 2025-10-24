/**
 * 将Date对象格式化为指定的字符串格式
 *
 * @param {Date} date - 要格式化的日期对象
 * @param {string} format - 目标格式字符串，例如："yyyy年MM月dd日", "yyyy/MM/dd HH:mm:ss", "MM-dd HH:mm"
 * @returns {string} 格式化后的日期字符串
 */
function dateFormat(date, format) {
    if (!(date instanceof Date) || isNaN(date)) {
        // 如果不是有效的Date对象，返回空字符串或抛出错误
        return '';
    }

    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
        'H+': date.getHours(), // 24小时制
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };

    // 替换年份 'yyyy'
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    // 替换 'AM/PM'
    if (/(A|a)/.test(format)) {
        const ampm = date.getHours() < 12 ? 'AM' : 'PM';
        format = format.replace(RegExp.$1, RegExp.$1 === 'a' ? ampm.toLowerCase() : ampm);
    }

    // 替换其他时间单位 'MM', 'dd', 'HH' 等
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            const value = o[k];
            // $1 匹配到的字符串，例如 'MM'
            // 如果是毫秒 'S'，则不补零
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (value) : (("00" + value).substr(("" + value).length)));
        }
    }

    return format;
}

/**
 * 计算两个日期之间相差的天数
 *
 * @param {Date} startDate - 开始日期 (Date 对象)
 * @param {Date} endDate - 结束日期 (Date 对象)
 * @returns {number | null} 相差的天数（向下取整）。如果日期无效，则返回 null。
 * 结果为正数表示 endDate 在 startDate 之后；负数表示 startDate 在 endDate 之后。
 */
function days(startDate, endDate) {
    // 1. 验证输入是否为有效的 Date 对象
    if (!(startDate instanceof Date) || isNaN(startDate) ||
        !(endDate instanceof Date) || isNaN(endDate)) {
        console.error("输入参数必须是有效的 Date 对象。");
        return null;
    

    // 2. 计算两个日期的时间戳差值 (毫秒)
    // Date.getTime() 返回从 1970 年 1 月 1 日 00:00:00 UTC 至今的毫秒数
    const timeDifference = endDate.getTime() - startDate.getTime();

    // 3. 定义一天对应的毫秒数
    const msPerDay = 1000 * 60 * 60 * 24;

    // 4. 将毫秒差值转换为天数
    // Math.floor() 用于向下取整，确保得到完整的经过天数
    const dayDifference = Math.floor(timeDifference / msPerDay);

    return dayDifference;
}

const bean = {
    dateFormat,
    days
}
export default bean