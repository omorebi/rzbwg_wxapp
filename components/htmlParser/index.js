const WxParse = require('../../vendor/wxParse/wxParse.js');

Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  properties: {
    html: { //文字内容
      type: String,
      value: ''
    },
    rich: { //文字内容
      type: Boolean,
      value: false
    },
    isNoStyle:{//是否过滤style
      type:Boolean,
      value:false,
    }
  },
  observers: {
    "html": function (html) {
      let that = this;
      WxParse.wxParse('content', 'html', html, that,that.data.isNoStyle);
    }
  }
})
