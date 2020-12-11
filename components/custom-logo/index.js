// component/customTitle.js
const app = getApp() 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:""
    },
    textColor:{
      type:String,
      value:"#FEE29B"
    },
    background:{
      type:String,
      value:"#ffffff"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    base_url: app.globalData.base_url,
    titleTop:app.globalData.titleTop,
    topHeight:app.globalData.titleLineHeight + 10,
    titleLineHeight:app.globalData.titleLineHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
