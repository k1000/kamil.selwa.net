const { webcrypto } = require('crypto');
const crypto = webcrypto;

async function runTest() {
  console.log("Starting WebCrypto Encryption/Decryption Test...");
  const passphrase = "my-secure-password!";
  const originalData = JSON.stringify({ "Sheet1": "a,b,c\n1,2,3" });
  
  // -- ENCRYPT (like encrypt-tool.html) --
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(originalData);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']
  );
  
  const encryptKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: 600000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
  
  const encryptedStr = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv }, encryptKey, dataBuffer
  );
  
  const combined = new Uint8Array(16 + 12 + encryptedStr.byteLength);
  combined.set(salt, 0);
  combined.set(iv, 16);
  combined.set(new Uint8Array(encryptedStr), 28);
  
  const ciphertextBase64 = btoa(String.fromCharCode(...combined));
  console.log("Encryption phase successful. Base64 Payload generated.");

  // -- DECRYPT (like index.html) --
  const combinedDec = Uint8Array.from(atob(ciphertextBase64), c => c.charCodeAt(0));
  const saltDec = combinedDec.slice(0, 16);
  const ivDec = combinedDec.slice(16, 28);
  const ciphertextDec = combinedDec.slice(28);

  const keyMaterialDec = await crypto.subtle.importKey(
    'raw', encoder.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']
  );
  
  const decryptKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltDec, iterations: 600000, hash: 'SHA-256' },
    keyMaterialDec, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
  );
  
  try {
    const decryptedStr = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivDec }, decryptKey, ciphertextDec
    );
    
    const decoder = new TextDecoder();
    const result = decoder.decode(decryptedStr);
    
    if(result === originalData) {
       console.log("✅ TEST PASSED: Decryption successful and data matches precisely.");
    } else {
       console.error("❌ TEST FAILED: Decryption successful but data mismatch.");
       process.exit(1);
    }
  } catch (e) {
    console.error("❌ TEST FAILED: Decryption threw an error:", e);
    process.exit(1);
  }
}

runTest().catch(console.error);
