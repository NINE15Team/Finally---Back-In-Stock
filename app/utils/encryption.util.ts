import { scryptSync, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

type EncryptedData = {
    iv: string;
    encryptedData: string;
};

const ALGORITHM: string = 'aes-256-cbc';
class EncryptionUtil {
    private static salt: string = 'salt';

    static encrypt(text: string, secretKey: string): string {
        const iv = randomBytes(16);
        const keyDerivation = scryptSync(secretKey, 'salt', 32);
        const cipher = createCipheriv(ALGORITHM, keyDerivation, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + encrypted;
    }

    static decrypt(encrypted: string, secretKey: string): string {
        const iv = Buffer.from(encrypted.substring(0, 32), 'hex');
        const keyDerivation = scryptSync(secretKey, 'salt', 32);
        const encryptedText = encrypted.substring(32);
        const decipher = createDecipheriv(ALGORITHM, keyDerivation, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

export default EncryptionUtil;
