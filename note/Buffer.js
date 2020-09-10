// Buffer的三种声明方式 [1.通过长度来声明(大小)]
const buffer = Buffer.alloc(5);
// console.log(buffer);  <Buffer 00 00 00 00 00> 开发中数字都是字节为单位 不具备扩展push shift这些方法
// console.log(buffer.slice(0, 1));  这样是可以的，是‘浅拷贝’。类似Objec.assign()

const buffer1 = Buffer.from('哈哈');
// console.log(buffer1); <Buffer e7 8e 8b e7 90 b3> 根据汉字来转换Buffer
// console.log(buffer1.length); 6 一个汉字是3个字节

const buffer2 = Buffer.from([0x16, 0x32]); // 不常用
// console.log(buffer2); <Buffer 16 32>

// -------------------
/**
 * Buffer 常用方法
 *  slice()
 *  length 可以获取buffer的字节长度
 *  Buffer.isBuffer(buffer) 判断是否为Buffer类型
 *  copy 拷贝
 *  concat 实现两个buffer的拼接
 */

// -------------------
/**
 * 文件操作 索引修改 更改内部内容 拼接buffer
 */
