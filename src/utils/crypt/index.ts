import CryptoJS from "crypto-js";
// const secret_key = CryptoJS.AES.encrypt(import.meta.env.VITE_APP_TOKEN_KEY as string, 'xdzn').toString()
const secret_key = "xdzn";

/**
 * 加密数据
 * @param content 需要加密的数据
 * @param isReferenceDataType 是否对引用数据类型加密？默认为false
 * @returns 密文或报错
 */
const encrypt = (
  content: any,
  isReferenceDataType: boolean = false,
): string | undefined | never => {
  if (content !== null && typeof content != "undefined") {
    if (isReferenceDataType) {
      return CryptoJS.AES.encrypt(
        JSON.stringify(content),
        secret_key,
      ).toString();
    }
    return CryptoJS.AES.encrypt(content, secret_key).toString();
  } else {
    throw new Error("需要被加密的数据不能是 null 或 undefined");
  }
};

/**
 * 解密数据
 * @param secret 密文
 * @param isObj 是否对对象解密
 * @returns 明文
 */
const decrypt = (secret: string, isReferenceDataType: boolean = false): any => {
  const bytes = CryptoJS.AES.decrypt(secret, secret_key);
  const originContent = bytes.toString(CryptoJS.enc.Utf8);
  return isReferenceDataType ? JSON.parse(originContent) : originContent;
};

export { encrypt, decrypt };
