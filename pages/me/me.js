import Switch from "../../bower_components/zanui-weapp/dist/switch/index";
import { formatTime, getToken } from "../../utils";

Page(
  Object.assign({}, Switch, {
    data: {
      verified: false,
    },
    handleZanSwitchChange(e) {
      // For switch
      this.setData({
        [e.componentId]: e.checked
      });
      getApp().globalData[e.componentId] = e.checked;
      wx.setStorage({
        key: e.componentId,
        data: e.checked
      });
    },
    onReady() {
      this.getData();
    },
    getData() {
      getToken(() => {
        const app = getApp()
        const { hasTail, messagePushEnabled } = app.globalData;
        this.setData({ hasTail, messagePushEnabled, verified: true });

        const { loginname } = app.globalData;
        wx.showToast({
          title: "加载中",
          icon: "loading"
        });
        wx.requestCNode({
          url: `/user/${loginname}`,
          success: res => {
            const json = res.data.data;
            this.setData({
              user: json,
              time: formatTime(json.create_at)
            });
            wx.hideToast();

            // Set recent topics and replies to global data
            app.globalData.recent_topics = json.recent_topics;
            app.globalData.recent_replies = json.recent_replies;
          }
        });
      });
      const app = getApp();
    },
    exit() {
      wx.showModal({
        title: "是否退出？",
        content: "退出登录后，如需再次登录请重新扫码",
        success: function(res) {
          if (res.confirm) {
            const app = getApp();
            delete app.globalData.token;
            wx.removeStorage({
              key: "token",
              complete: function() {
                wx.reLaunch({
                  url: "/pages/index/index"
                });
              }
            });
          } else if (res.cancel) {
          }
        }
      });
    }
  })
);
