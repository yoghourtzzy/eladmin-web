export function  getUrlWithPara(baseUrl,para){
  baseUrl+='?';
  for(var key in para){
    if(Array.isArray(para[key])){
      for(var item of para[key]){
        baseUrl+=key;
        baseUrl+='=';
        baseUrl+=item;
        baseUrl+='&'
      }
    }else{
      baseUrl+=key;
      baseUrl+='=';
      baseUrl+=para[key];
      baseUrl+='&'
    }
  }
  baseUrl = baseUrl.substr(0, baseUrl.length - 1);
  console.log(baseUrl);
  return baseUrl;
}
