/**
 * @doc https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html
 */

/**
 * 显示消息提示框
 * @param {String} title 内容
 * @param {String} icon  图标，有效值 "success", "loading", "none"
 */
export function wxShowToast(title, icon = 'none', success) {
    wx.showToast({
        icon: icon,
        title: title,
        duration: 1500,
        success: success
    });
}
// 隐藏消息提示框
export function wxHideToast() {
    wx.hideToast();
}

/**
 * 显示 loading 提示框
 * @param {String} title 内容
 */
export function wxShowLoading(title) {
    wx.showLoading({
        title: title ? title : '',
        mask: true
    });
}
// 隐藏 loading 提示框
export function wxHideLoading() {
    wx.hideLoading();
}

// 获取全局数据
export function wxGetGlobalData() {
    return getApp().globalData;
}
// 获取全局用户信息
export function wxGetUserInfo() {
    return getApp().globalData.userInfo;
}

// 获取身份id
export function wxGetGroupId() {
    return getApp().globalData.userInfo.group;
}

// 获取cookie头
export function wxGetHeaderCookie() {
    let cookie = wx.getStorageSync("cookie");
    return {
        headers: {
            Cookie: cookie
        }
    };
}

/*获取当前页url*/
export function getCurrentPageUrl() {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
}

/*获取当前页带参数的url*/
export function getCurrentPageUrlWithArgs() {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
}
/*获取当前页带参数的url*/
export function getCurrentPageUrlWithArgs2(url, options) {
    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
}

export default {
    wxShowToast, wxHideToast,
    wxShowLoading, wxHideLoading,
    wxGetGlobalData, wxGetHeaderCookie
}
