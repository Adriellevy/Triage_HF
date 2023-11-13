"""from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
def encrypt_data(key, data):
    cipher = Cipher(algorithms.AES(key), modes.GCM(nonce=b''), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(data) + encryptor.finalize()
    tag = encryptor.tag
    return ciphertext, tag

def decrypt_data(key, ciphertext, tag):
    cipher = Cipher(algorithms.AES(key), modes.GCM(nonce=b'', tag=tag), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_data = decryptor.update(ciphertext) + decryptor.finalize()
    return decrypted_data"""