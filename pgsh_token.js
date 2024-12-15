/**
 * 脚本名称：取Token脚本
 * 功能：拦截 `https://userapi.qiekj.com/slot/get` 请求并提取 token
 */

const $ = new Env('取Token脚本');

(async () => {
  if (typeof $request !== "undefined") {
    // 获取请求体
    const body = $request.body; 
    if (!body) {
      $.msg('取Token失败', '请求体为空', '');
      $.done();
      return;
    }

    // 匹配并提取 token
    const match = body.match(/token=([a-f0-9]{32})/i); // 匹配32位十六进制 token
    if (match && match[1]) {
      const token = match[1];
      // 保存 token
      $.setdata(token, 'qiekj_token');
      $.msg('取Token成功', `已提取 token: ${token}`, '');
    } else {
      $.msg('取Token失败', '未找到 token 字段', '');
    }
  }
  $.done();
})();

// 通用工具函数封装
function Env(name) {
  this.name = name;
  this.setdata = (value, key) => {
    if ($persistentStore) {
      $persistentStore.write(value, key);
    } else if ($prefs) {
      $prefs.setValueForKey(value, key);
    }
  };
  this.msg = (title, subtitle = '', body = '') => {
    if ($notification) {
      $notification.post(title, subtitle, body);
    }
  };
  this.done = () => {
    if (typeof $done !== 'undefined') $done();
  };
}
