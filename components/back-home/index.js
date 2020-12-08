const app = getApp()
import deviceUtil from '../../utils/components_tools/device-util';
Component({
  properties: {
    navName: String,
    returnFlag: String,   // 根据传的参数判断返回逻辑
    backGroungImg: String, // 花纹背景图 不传的话就是白色背景
    // 胶囊按钮颜色
    capsuleColor: {
      type: String,
      value: 'black',
      options: ['white', 'black']
    },
  },
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'shared',//关闭组件样式隔离
  },
  data: {
    // 标题栏高度（单位px）
    titleBarHeight: deviceUtil.getTitleBarHeight(),
    height: '',
    bgiFlag: '',
    backGroungImg: '',
    returnFlag: '0', // 根据传的参数判断返回逻辑
    back: 'https://www.hymuseum.org.cn/wxmini/back.png',
    home: 'https://www.hymuseum.org.cn/wxmini/home.png',
  },
  lifetimes: {
    attached: function () {
      // 定义导航栏的高度   方便对齐
      let that = this;
      that.setData({
        height: app.globalData.topHeight,
        infos: app.globalData.infosButton
      });
    },
  },
  pageLifetimes:{
    show: function () {
      if (!app.navFirsts) {
        setTimeout(function () {
          let insBtn = wx.getMenuButtonBoundingClientRect();
          if (insBtn) {
            app.navFirsts = true;
            app.globalData.infosButton = insBtn;
          }
        }, 500)
      }
    },
  },
  methods: {
    // 返回上一页面
    navback() {
      if (getCurrentPages().length == 1){
        this.backhome();
      } else {
        wx.navigateBack();
      }
    },
    //返回到首页
    backhome() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }

}) 