const watermark = require('../../utils/watermark.js');
/* 
 * 使用注意事项：
 * 从page中传入的width、height只在图片缩略图中使用，不会控制图片的显示宽高。
 * 从page中传入的src 确保完整拼全是再渲染，wx:if 控制 。否则缩略图 也会进行请求，因异步可能造成图片传入正常值后也无法显示
 * page中img设置的 class 应使用 img-class="***"
 * wxss中控制图片宽高时，权重至少加一级
 */

/* 
 * 图片剪裁类型：
 * 31：按缩放比小的一边等比缩放
 * 32：按比例缩放后填充
 * 33：等比缩放后居中剪切（推荐）
 * 34：左上剪切
 * 35：右下剪切
 * 36：固定尺寸，图片可能变形
 */

/* 
 * 名称	含义
 * contain	保持宽高缩放图片，使图片的长边能完全显示出来
 * cover	保持宽高缩放图片，使图片的短边能完全显示出来，裁剪长边
 * fill	拉伸图片，使图片填满元素
 * widthFix	缩放模式，宽度不变，高度自动变化，保持原图宽高比不变
 * heightFix	缩放模式，高度不变，宽度自动变化，保持原图宽高比不变
 * none	保持图片原有尺寸
 */

Component({
  properties: {
    src: String,
    mode: {
      type: String,
      value: 'fill'
    },
    isAuto: { //是否启用缩略图
      type: Boolean,
      value: true
    },
    cutMode: {
      type: String,
      value: '33'
    },
    width: {
      type: String,
      value: '0'
    },
    height: {
      type: String,
      value: '0'
    },
  },
  /**
   * 组件的外部样式类
   */
  externalClasses: ['img-class'],
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared', //页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面
  },
  data: {
    showLoading: true,
    yes: true,
  },
  observers: {
    'mode': function (mode) {
      // console.log(src);
      let m = '';
      switch (mode) {
        case 'scaleToFill':
          m = 'fill'
          break;

        case 'aspectFit':
          m = 'contain'
          break;

        case 'aspectFill':
          m = 'cover'
          break;

        case 'widthFix':
          m = 'widthFix'
          break;

        case 'heightFix':
          m = 'heightFix'
          break;

        default:
          m = 'fill'

      };
      this.setData({
        m,
      })
    },

    'src': function (src) {
      let that = this;
      if (src && src.indexOf(".auto.") < 0) {
        if (that.data.isAuto) {

          setTimeout(res => {
            that.setData({
              newSrc: watermark.toThumbsimg(src, that.data.cutMode, that.data.width, that.data.height),
            })
          }, 500)
        } else {
          that.setData({
            newSrc: src,
          })
          
        }
      }
    },
  },
  lifetimes: {
    attached: function () {},
  },
  pageLifetimes: {
    show: function () {},
  },
  methods: {
    onTap() {
      let that = this;
      that.triggerEvent('myevent')
    },
    onError() {
      let that = this;
      that.setData({
        yes: false,
      })
    },
  }

})