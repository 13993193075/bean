import bean from './index.js';

console.log("测试 - 日期格式: ", bean.dateFormat.dateFormat(new Date(), 'yyyy-MM-dd'));
console.log("测试 - 相差天数: ", bean.dateFormat.days(new Date('2025-01-01'), new Date('2025-01-31')));
console.log("测试 - 深度拷贝: ", bean.deepClone.deepClone({ name: '张三', age: 50 , son: [{ name: '李四', age: 20 }, { name: '王五', age: 20 }]}));