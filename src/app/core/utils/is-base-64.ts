const isBase64 = (encodedString) => {
  var regexBase64 =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return regexBase64.test(encodedString); // return TRUE if its base64 string.
};
export default isBase64;
