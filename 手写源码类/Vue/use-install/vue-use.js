Vue.use = function (plugin) {
  // 1. 检查是否安装过此插件 如果已安装 返回this
  const installedPlugins = this._installedPlugins || (this._installedPlugins = []);
  if (installedPlugins.indexOf(plugin) > -1) {
    return this;
  }

  // 2. 整理要传递给install的参数：将args拿过来 【不要第一个】   然后将this添加到args的第一位
  const args = toArray(arguments, 1);
  args.unshift(this);

  // 3. 执行install函数，将args作为餐参数传递过去
  if (typeof plugin.install === "function") {
    plugin.install.apply(plugin, args);
  } else if (typeof plugin === "function") {
    plugin.apply(null, plugin, args);
  }
  // 4. 添加到【已安装插件内】，做查重处理，避免重复安装
  installedPlugins.push(plugin);

  // 5. 返回this
  return this;
};
