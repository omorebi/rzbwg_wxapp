import zIndex from '../../utils/components_tools/zIndex';
import validator from '../../utils/components_tools/validator';
import eventUtil from '../../utils/components_tools/event-util';
Component({
  behaviors: [zIndex, validator],
  externalClasses: ["l-bg-class", "l-panel-class", "l-class"],
  properties: {
    show: {
      type: Boolean,
      value: !1
    },
    animation: {
      type: Boolean,
      value: !0
    },
    transition: {
      type: Boolean,
      value: null
    },
    contentAlign: {
      type: String,
      value: "center",
      options: ["top", "right", "left", "bottom", "center"]
    },
    direction: {
      type: String,
      value: null,
      options: ["top", "right", "left", "bottom", "center"]
    },
    locked: {
      type: Boolean,
      value: !1
    }
  },
  attached() {
    this._init()
  },
  pageLifetimes: {
    show() {
      this._init()
    }
  },
  data: {
    status: "show"
  },
  methods: {
    _init() {
      wx.lin = wx.lin || {}, wx.lin.showPopup = t => {
        const {
          zIndex: e = 99,
          animation: o = !0,
          contentAlign: i = "center",
          locked: a = !1
        } = {
          ...t
        };
        this.setData({
          zIndex: e,
          animation: o,
          contentAlign: i,
          locked: a,
          show: !0
        })
      }, wx.lin.hidePopup = () => {
        this.setData({
          status: "hide"
        }), setTimeout(() => {
          this.setData({
            show: !1
          })
        }, 300)
      }
    },
    doNothingMove() {},
    doNothingTap() {},
    onPopupTap() {
      !0 !== this.data.locked && (this.data.show ? (this.setData({
        status: "hide"
      }), setTimeout(() => {
        this.setData({
          show: !1,
          status: "show"
        })
      }, 300)) : this.setData({
        show: !0,
        status: "show"
      })), eventUtil.emit(this, "lintap", !0)
    }
  }
});