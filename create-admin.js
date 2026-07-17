const crypto = require('crypto');

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hashPassword(password) {
  const PBKDF2_ITERATIONS = 100000;
  const salt = crypto.randomBytes(16);

  const derivedBits = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    32,
    'sha256'
  );

  return `$pbkdf2$${PBKDF2_ITERATIONS}$${bufferToHex(salt)}$${bufferToHex(derivedBits)}`;
}

const email = 'hrywxhn0721@qq.com';
const password = 'hrywxhn0721';
const username = email.split('@')[0];
const hashedPassword = hashPassword(password);

console.log('用户名:', username);
console.log('邮箱:', email);
console.log('密码哈希:', hashedPassword);
console.log('\n请运行以下命令：');
console.log(`wrangler d1 execute kldns-db --remote --command="INSERT INTO users (username, email, password_hash, role, created_at, updated_at) VALUES ('${username}', '${email}', '${hashedPassword}', 'admin', datetime('now'), datetime('now'))"`);
