

// template/component/audio-progress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    progressWidth:{
      type:String,
      value:'220px'
    },

    progress:{
      type:[Number,String],
      value:0
    }
  },

  observers:{
    'progress':function(pro){
      this.drawProgressbg()
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    persentText:'',
  },

  attached: function() {
    
    // this.setData({
    //   progress:40,
    // })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    drawProgressbg: function () {
      var that = this
      const ctx = wx.createCanvasContext('canvasProgressbg', that)
      ctx.setLineWidth(4);// 设置圆环的宽度
      ctx.setStrokeStyle('#20183b'); // 设置圆环的颜色
      ctx.setLineCap('round') // 设置圆环端点的形状
      ctx.beginPath();//开始一个新的路径
      ctx.arc(110, 110, 100, 0, 2 * Math.PI * parseFloat(this.data.progress) / 100, false);
      //设置一个原点(110,110)，半径为100的圆的路径到当前路径
      ctx.stroke();//对当前路径进行描边
      ctx.draw(false, () => {
        console.log('绘制完成')
      });
    },

    tapAction:function(){
      this.drawProgressbg();
    },
  }
})


/*

*/ 