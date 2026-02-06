// 计算天数（计价单位数）
function days({
    checkin, // 入住时间
    checkout, // 离开时间
    method_code = '0', // 计价方法
    timepoint_hours = 14, // 结算时点
    timepoint_minutes = 0,
    timepoint2_hours = 18, // 第二时点
    timepoint2_minutes = 0
}){
    let checkin0 = new Date(checkin),
        checkout0 = new Date(checkout);
    let count = 0; // 计算天数（计价单位数）

    //时段错误
    if (checkout0 <= checkin0){
        return 1;  // 至少计价1天（1个计价单位）
    }

    if (method_code === "0"){ // 日结
        if (checkin0 === checkout0){ // 当日不考虑结算时点
            return 1;
        }

        // 天数
        count = Math.round((checkout0 - checkin0) / (1000 * 60 * 60 * 24));

        // 半天计价
        if (
            (
                (checkout0.getHours() > timepoint_hours) ||
                (
                    checkout0.getHours() === timepoint_hours &&
                    checkout0.getMinutes() > timepoint_minutes
                )
            ) && (
                (checkout0.getHours() <= timepoint2_hours) ||
                (
                    checkout0.getHours() === timepoint2_hours &&
                    checkout0.getMinutes() <= timepoint2_minutes
                )
            )
        ){
            count = count + 0.5;
        }else if(
            (checkout0.getHours() > timepoint2_hours) ||
            (
                checkout0.getHours() === timepoint2_hours &&
                checkout0.getMinutes() > timepoint2_minutes
            )
        ){
            count = count + 1;
        }

        // 至少 1 天
        count = (count < 1) ? 1 : count;
    }else if(method_code === "1"){ // 小时
        count = Math.round((checkout0 - checkin0) / (1000 * 60 * 60)); // 小时数
        count = (count <= 0) ? 1 : count; // 至少 1 小时
    }else if(method_code === "2"){ // 月结
        let c = (checkout0.getFullYear() - checkin0.getFullYear()) * 12,
            c0 = (checkout0.getMonth() >= checkin0.getMonth())
                ? (checkout0.getMonth() - checkin0.getMonth())
                : (12 - checkin0.getMonth + checkout0.getMonth());

        count = c + c0 >= 1 ? c + c0 : 1; // 至少 1 个月
    }

    return count;
}

// 单房计价
function calculator({
    price,
    checkin, // 入住时间
    checkout, // 离开时间
    method_code = '0', // 计价方法
    timepoint_hours = 14, // 结算时点
    timepoint_minutes = 0,
    timepoint2_hours = 18, // 第二时点
    timepoint2_minutes = 0
}){
    const count = days({
        checkin,
        checkout,
        method_code,
        timepoint_hours,
        timepoint_minutes,
        timepoint2_hours,
        timepoint2_minutes
    })

    return price * count
}

export default {
    days,
    calculator
}