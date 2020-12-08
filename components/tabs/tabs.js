// component/senior/tabs/tabs.js
const themes = {
  smallBar: 'smallBar'
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array,
      value: ['item1', 'item2', 'item3', 'item4'],
      observer: function (newVal) {
        if (newVal && newVal.length < 5) {
          this.setData({
            itemWidth: (750 / newVal.length) - 60
          })
        }else {
          this.setData({
            itemWidth: 0
          })
        }
      }
    },
    type: {
      type: String,
      value: '0'
    },
    height: {
      type: String,
      value: '120'
    },
    textColor: {
      type: String,
      value: '#666666'
    },
    backGroungColor: {
      type: String,
      value: ''
    },
    textSize: {
      type: String,
      value: '32'
    },
    selectFontSize: {
      type: String,
      value: '12'
    },
    itemPadding:{
      type: String,
      value: '25'
    },
    selectColor: {
      type: String,
      value: '#FE9036'
    },
    selected: {
      type: String,
      value: '0',
      observer: function (newVal) {
        this.setData({
          mSelected: newVal
        })
        this.onItemTap({
          currentTarget: {
            dataset: {
              index: newVal
            }
          }
        })
      }
    },
    theme: {
      type: String,
      value: 'default',
      observer: function (newVal) {
        if (this.data.theme == themes.smallBar) {
          this.setData({
            bottom: this.data.height / 2 - this.data.textSize - 8,
            scrollStyle: ''
          })
        }
      }
    },
    dataCus: {
      type: Array,
      value: '',
      observer: function (newVal) {
        this.setData({
          mDataCus: newVal
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    backGroungImg: '',
    type: '',
    selectFontColor: '#000000FF', // 选中的字颜色
    itemWidth: 0,
    itemPadding:25,
    isScroll: true,
    scrollStyle: 'border-bottom: 1px solid #e5e5e5;',
    left: '0',
    right: '750',
    bottom: '0',
    mSelected: '0',
    lastIndex: 0,
    transition: 'left 0.5s, right 0.2s',
    windowWidth: 375,
    domData: [],
    textDomData: [],
    mDataCus: []
  },

  externalClasses: ['cus'],

  /**
   * 组件的方法列表
   */
  methods: {
    barLeft: function (index, dom) {
      let that = this;
      /**
       * 根据组件传值不同的type 来更改布局 
       * 0 是全部展览页面
       * 1 文创商店
       * 2 导览
       */
      // console.log('type', that.data.type)
      if (that.data.type == 0) {
        this.setData({
          backGroungImg: 'https://kmycapp.jb.mil.cn/uploadfiles/xcxar/changJinLake/bgi.png'
        })
        dom[index] && this.setData({
          left: dom[index].left - 12
        })
      } else if (that.data.type == 1) {
        if (index == 0) {
          dom[index] && this.setData({
            left: dom[index].left
          })
        } else if (index == 2) {
          dom[index] && this.setData({
            left: dom[index].left - 30
          })
        } else {
          dom[index] && this.setData({
            left: dom[index].left - 15
          })
        }
      } else if(that.data.type == 2) {
        this.setData({
          left: (dom[index].right + dom[index].left) * 0.5
        })
      }
    },
    barRight: function (index, dom) {
      let that = this;
      this.setData({
        right: that.data.windowWidth - (dom[index] && dom[index].right),
      })
    },
    onItemTap: function (e) {
      const index = e.currentTarget.dataset.index;
      this.triggerEvent("sendEvent", index); // sendEvent自定义名称事件
      // console.log(index)
      let str = this.data.lastIndex < index ? 'left 0.5s, right 0.2s' : 'left 0.2s, right 0.5s';
      this.setData({
        transition: str,
        lastIndex: index,
        mSelected: index
      })
      if (this.data.theme == themes.smallBar) {
        this.barLeft(index, this.data.textDomData);
        this.barRight(index, this.data.textDomData);
      } else {
        this.barLeft(index, this.data.domData);
        this.barRight(index, this.data.domData);
      }
      this.triggerEvent('itemtap', index);
    }
  },

  lifetimes: {
    ready: function () {
      let that = this;
      const sysInfo = wx.getSystemInfoSync();
      this.setData({
        windowWidth: sysInfo.screenWidth
      })
      const query = this.createSelectorQuery();
      query.in(this).selectAll('.item').fields({
        dataset: true,
        rect: true,
        size: true
      }, function (res) {
        that.setData({
          domData: res,
        })
        that.barLeft(that.data.mSelected, that.data.domData);
        that.barRight(that.data.mSelected, that.data.domData);
      }).exec()
      query.in(this).selectAll('.text').fields({
        dataset: true,
        rect: true,
        size: true
      }, function (res) {
        that.setData({
          textDomData: res,
        })
        if (that.data.theme == themes.smallBar) {
          that.barLeft(that.data.mSelected, that.data.textDomData);
          that.barRight(that.data.mSelected, that.data.textDomData);
        }
      }).exec()
    },
  },
})