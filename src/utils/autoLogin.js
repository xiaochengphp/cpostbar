import Api from '@/utils/api';

export function autoLogin(_this, store) {
    return new Promise((resolve, reject) => {
        if (wx.getStorageSync("cookie")) {
            store.commit("setCookie", wx.getStorageSync("cookie"));
        }
        if (!store.state.login) {
            _this.$http.post(Api.info, {}, {
                headers: {
                    Cookie: store.state.cookie
                }
            }).then((response) => {
                let res = response.data;
                console.log(res)
                if (res.code) {
                    store.commit("setUserInfo", res.result);
                    store.commit("setLogin", true);
                    wx.setStorage({
                        key: "userInfo",
                        data: store.state.userInfo
                    });
                    // console.log(store.state.userInfo)
                    resolve({
                        code: res.code,
                        msg: res.msg
                    })
                } else {
                    _login();
                    reject({
                        code: res.code,
                        msg: res.msg
                    });
                }
            })
        } else {
            resolve({
                code: 1,
                msg: 'res.msg'
            })
        }

    })
}

function _login() {
    wx.navigateTo({
        url: "/pages/login/main"
    });
}