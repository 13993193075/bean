/**
 * 将Date对象格式化为指定的字符串格式
 *
 * @param {Date} d - 要格式化的日期对象
 * @param {string} f - 目标格式字符串，例如："yyyy年MM月dd日", "yyyy/MM/dd HH:mm:ss", "MM-dd HH:mm"
 * @returns {string} 格式化后的日期字符串
 */
function dateFormat(d, f){
    if(! d){ return "" }
    let d0 = new Date(d), d1 = "", f0 = f || "";

    let year = d0.getFullYear();
    let year0 = "" + year;
    let month = d0.getMonth() + 1;
    let month0 = "" + month;
    let month1= month < 10 ? "0" + month0 : month0;
    let date = d0.getDate();
    let date0 = "" + date;
    let date1= date < 10 ? "0" + date0 : date0;
    let hours = d0.getHours();
    let hours0 = "" + hours;
    let hours1= hours < 10 ? "0" + hours0 : hours0;
    let minutes = d0.getMinutes();
    let minutes0 = "" + minutes;
    let minutes1= minutes < 10 ? "0" + minutes0 : minutes0;

    switch(f0){
        case "yyyy年MM月dd日" :
            d1 = year0 + "年" + month1 + "月" + date1 + "日";
            break;
        case "yyyy年M月d日" :
            d1 = year0 + "年" + month0 + "月" + date0 + "日";
            break;
        case "yyyy-MM-dd" :
            d1 = year0 + "-" + month1 + "-" + date1;
            break;
        case "yyyy-M-d" :
            d1 = year0 + "-" + month0 + "-" + date0;
            break;
        case "yyyy/MM/dd" :
            d1 = year0 + "/" + month1 + "/" + date1;
            break;
        case "yyyy/M/d" :
            d1 = year0 + "/" + month0 + "/" + date0;
            break;
        case "yyyy/MM/dd HH:mm" :
            d1 = year0 + "/" + month1 + "/" + date1
                + " " + hours1 + ":" + minutes1;
            break;
        case "yyyy/M/d H:m" :
            d1 = year0 + "/" + month0 + "/" + date0
                + " " + hours0 + ":" + minutes0;
            break;
        default :
            d1 = year0 + "/" + month1 + "/" + date1
                + " " + hours1 + ":" + minutes1;
    }

    return d1;
}

/**
 * 计算两个日期之间相差的天数
 *
 * @param {Date} dFrom - 开始日期 (Date 对象)
 * @param {Date} dTo - 截止日期 (Date 对象)
 * @returns {number} 相差的天数
 */
function days(dFrom, dTo){
    let dFrom0 = new Date(new Date(dFrom).toDateString ());
    let dTo0 = new Date(new Date(dTo).toDateString ());
    if(dFrom0 >= dTo0){
        return 0
    }
    return Math.floor((dTo0 - dFrom0)/(1000 * 60 * 60 * 24)) + 1;
}

export {
    dateFormat,
    days
}
export default {
    dateFormat,
    days
}