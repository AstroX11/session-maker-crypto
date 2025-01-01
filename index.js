import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { dirname, join } from 'node:path';

function encryptSession(initSession = 'creds.json') {
	const baseDir = dirname(initSession);
	const credsData = JSON.parse(readFileSync(initSession, 'utf8'));
	const appStateKeyId = credsData.myAppStateKeyId;
	const syncKeyPath = join(baseDir, `app-state-sync-key-${appStateKeyId}.json`);
	const syncKeyData = JSON.parse(readFileSync(syncKeyPath, 'utf8'));
	const mergedData = {
		creds: credsData,
		syncKey: syncKeyData,
	};
	const algorithm = 'aes-256-cbc';
	const key = randomBytes(32);
	const iv = randomBytes(16);
	const cipher = createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(JSON.stringify(mergedData), 'utf8', 'hex');
	encrypted += cipher.final('hex');
	const sessionData = {
		data: encrypted,
		key: key.toString('hex'),
		iv: iv.toString('hex'),
	};
	const encryptedPath = join(process.cwd(), 'session.json');
	writeFileSync(encryptedPath, JSON.stringify(sessionData));
	return sessionData;
}

function decryptSession(sessionSource = 'session.json', outputDir = './session') {
	const encryptedData = JSON.parse(readFileSync(sessionSource, 'utf8'));
	const algorithm = 'aes-256-cbc';
	const key = Buffer.from(encryptedData.key, 'hex');
	const iv = Buffer.from(encryptedData.iv, 'hex');
	const decipher = createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	const data = JSON.parse(decrypted);
	mkdirSync(outputDir, { recursive: true });
	writeFileSync(join(outputDir, 'creds.json'), JSON.stringify(data.creds, null, 2));
	writeFileSync(join(outputDir, `app-state-sync-key-${data.creds.myAppStateKeyId}.json`), JSON.stringify(data.syncKey, null, 2));
	return data;
}

export { encryptSession, decryptSession };
