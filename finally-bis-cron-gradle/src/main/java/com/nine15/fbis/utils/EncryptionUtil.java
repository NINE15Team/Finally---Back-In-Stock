package com.nine15.fbis.utils;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;

public class EncryptionUtil {
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final String KEY_ALGORITHM = "PBKDF2WithHmacSHA256";
    private static final String SALT = "salt";
    private static final int ITERATION_COUNT = 65536;
    private static final int KEY_LENGTH = 256;

    public static String encrypt(String text, String secretKey) throws Exception {
        SecureRandom random = new SecureRandom();
        byte[] iv = new byte[16];
        random.nextBytes(iv);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);

        SecretKeySpec secretKeySpec = generateSecretKey(secretKey, SALT);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] encrypted = cipher.doFinal(text.getBytes());
        return Base64.getEncoder().encodeToString(iv) + Base64.getEncoder().encodeToString(encrypted);
    }

    public static String decrypt(String encryptedData, String secretKey) throws Exception {
        byte[] ivAndCipherText = Base64.getDecoder().decode(encryptedData);
        byte[] iv = new byte[16];
        System.arraycopy(ivAndCipherText, 0, iv, 0, 16);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);

        byte[] cipherText = new byte[ivAndCipherText.length - 16];
        System.arraycopy(ivAndCipherText, 16, cipherText, 0, cipherText.length);

        SecretKeySpec secretKeySpec = generateSecretKey(secretKey, SALT);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] decrypted = cipher.doFinal(cipherText);
        return new String(decrypted);
    }

    private static SecretKeySpec generateSecretKey(String password, String salt) throws Exception {
        KeySpec spec = new PBEKeySpec(password.toCharArray(), salt.getBytes(), ITERATION_COUNT, KEY_LENGTH);
        SecretKeyFactory factory = SecretKeyFactory.getInstance(KEY_ALGORITHM);
        byte[] secretKey = factory.generateSecret(spec).getEncoded();
        return new SecretKeySpec(secretKey, "AES");
    }

}
