function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function isName(name){
  return /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/ .test(name);
}

export function getPHPSESSION(cookie){
  // return cookie.match(/PHPSESSID=\S+;/)[0];
  return cookie.replace(new RegExp(/expires=.+?HttpOnly/,'gm'),'').replace(new RegExp(/,/,'gm'),'').replace(new RegExp(/path=.+?HttpOnly/,'gm'),'').replace(/path=\//g, '');
}

export default {
  formatNumber,
  formatTime
}
