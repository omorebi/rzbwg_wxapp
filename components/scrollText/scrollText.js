// component/scrollText/scrollText.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: '0'
    },
    size: {
      type: String,
      value: '14'
    },
    windowWidth: {
      type: String,
      value: '400'
    },
  },

  /**
   * 组件的初始数据 
   */
  data: {
    content: '',
    size: 14, //字体大小
    windowWidth: '', //屏幕宽度
    length: '', //当前字体所占的长度
    interval: 20, //时间
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 0,
    timer: '',
  },

  attached() {
    var that = this;
    var windowWidth = wx.getSystemInfoSync().screenWidth; //获取当前屏幕宽度
    var length = that.data.content.length * that.data.size; //文字长度
    console.log(length);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    clearInterval(that.data.timer); //清除计时器，一定要清除
    that.scrolltxt(); // 第一个字消失后立即从右边出现
  },

  detached() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrolltxt: function () {
      var that = this;
      var length = that.data.length; //滚动文字的宽度
      var windowWidth = that.data.windowWidth; //屏幕宽度
      if (length > windowWidth) { //如果文字宽度大于屏幕宽度
        that.data.timer = setInterval(function () { //创建函数
          var maxscrollwidth = length + that.data.marquee_margin; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
          var crentleft = that.data.marqueeDistance; //获取初始滚动距离
          if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
            that.setData({
              marqueeDistance: crentleft + that.data.marqueePace //滚动的距离为当前滚动的距离+滚动速度（1）
            })
          } else { //到最大宽度
            that.setData({
              marqueeDistance: 0 // 直接重新滚动
            });
            clearInterval(that.data.timer); //清除计时器
            setTimeout(() => {
              that.scrolltxt();
            }, 1000);
          }
        }, that.data.interval); //设定时间
      }
      // else {
      //   that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
      // }
    },
  }
})