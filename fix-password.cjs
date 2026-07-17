// 使用 pbkdf2 包生成与 Web Crypto API 兼容的密码哈希
const { pbkdf2Sync } = require('crypto');

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const password = 'hrywxhn0721';
const salt = Buffer.from('d99693e2f85093e502f1b77863284c54', 'hex');
const iterations = 100000;
const keylen = 32;

// 使用 SHA-256 算法，与 Web Crypto API 保持一致
const derivedKey = pbkdf2Sync(password, salt, iterations, keylen, 'sha256');
const hash = bufferToHex(derivedKey);

console.log('密码:', password);
console.log('盐:', salt.toString('hex'));
console.log('迭代次数:', iterations);
console.log('生成的哈希:', hash);
console.log('完整格式:', `$pbkdf2$${iterations}$${salt.toString('hex')}$${hash}`);

// 生成 SQL 更新语句
const sql = `UPDATE users SET password_hash = '$pbkdf2$${iterations}$${salt.toString('hex')}$${hash}' WHERE username = 'hrywxhn0721';`;
console.log('\nSQL 更新语句:');
console.log(sql);
