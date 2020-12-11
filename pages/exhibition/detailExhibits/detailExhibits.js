// pages/exhibition/detailExhibits/detailExhibits.js
const app = getApp()
const bgMusic = wx.getBackgroundAudioManager();
import {
  get_exhibit_detail,
  get_exhibit_comment,
  do_like,
  do_comment,
  do_collect
} from '../../../apis/api_index.js';

Page({
  data: {
    type: '', //默认为空  map-为导览模块来的不需要销毁背景音乐
    id: 1, // 当前展品Id
    title: '', // 展品名称
    list_img: '', // 用于播放音频的封面图
    prev_id: 0, //上一个展品id
    next_id: 0, //下一个展品id
    base_url: app.globalData.base_url,
    languages: [], // 存储最大的语种包
    detailData: {}, // 最终显示的单一语种数据
    languageList: [], // 语种编码：1中文 2英文 3日文 4韩文 10繁体   ['中文', 'English', '日本語', '한국어.','繁體']
    languageCurrent: 1, //选中的语言index
    isset_english: 0, //此展品有没有英文资源 1 有 0没有
    scrollTop: 0, // 用于锚点定位到留言评论
    // 音频对象参数
    cur: {
      playing: false, //是否正在播放
      list_img: '',
      exhibit_id: '',
      exhibit_name: '',
      audio: '',
      duration: '', //语音长度
      currentTime: '0', //已经播放时间
      currentTimeS: '', //剩余播放时间
      slideX: 0, //滑块x坐标
      progress: 0, //播放进度 百分比
    },

    audioTouch: false, //是否在拖拽进度条
    shareWindowFlag: false, // 控制分享弹窗
    isPlay: false,
    isFolded: true, // 展开收起
    isFolded2: true, // 扩展阅读的展开收起
    carousel: [], // 轮播图
    currentIndex: 1, //当前轮播图索引
    list: [], //留言列表
    commentContent: '', // '我'的留言内容    
    exhibitInfo: {}, // 最大的数据对象
    commentNum: 0, // 评论总数
    icollected: 0, // 本人是否收藏  1是0否
    iliked: 0, // 本人是否喜欢  1是0否
    like_num: 0, // 喜欢人数
    notMore: false, // 加载更多
    page: 1,
    limit: 3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      this.data.type = 'map'
    } else {
      bgMusic.stop()
      bgMusic.seek(0)
    }
    if (options.id) {
      console.log('展品Id', options.id)
      this.data.id = options.id
      this.getExhibitDetail(); //展品详情
      this.getExhibitComment(); //展品相关评论
      this.initAudio();
    } else {
      console.log('没有展品id')
      wx.navigateBack();
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.audioMonitor(); //背景音乐监听事件
    this.reGetData()
  },

  /**
   * 页面卸载
   */
  onUnload: function () {
    if (this.data.type !== 'map') {
      bgMusic.stop()
      bgMusic.seek(0)
    }

  },
  /**
   * 获取展品详情 ===000000
   */
  getExhibitDetail() {
    let that = this
    let id = that.data.id
    let language = that.data.languageCurrent
    let api_token = wx.getStorageSync('api_token') || ''
    get_exhibit_detail(id, language, api_token).then(res => {
      console.log('展品详情====', res.data)

      that.setData({
        exhibitInfo: res.data, // 最大数据包
        carousel: res.data.exhibit_imgs,
        list_img: res.data.exhibit_imgs[0], // 背景音乐封面图
        title: res.data.exhibit_name,
        detailData: res.data,
        prev_id: res.data.previous_exhibit_id, // 上一个
        next_id: res.data.next_exhibit_id, //下一个
        icollected: res.data.is_collection, // 本人是否收藏  1是0否
        iliked: res.data.is_like, // 本人是否喜欢  1是0否
        like_num: res.data.collection_num, // 喜欢人数
        isset_english: res.data.isset_english, //有没有英文资源 1有 0没有
      })

      //   /** 处理好默认播放的音频 */
      let newCur = {
        playing: this.data.playType, //是否正在播放
        list_img: this.data.list_img,
        exhibit_id: this.data.id,
        exhibit_name: this.data.title,
        audio: this.data.exhibitInfo.audio,
        duration: this.data.exhibitInfo.audio_time_long, //语音长度
        currentTime: "0", //已经播放时间
        currentTimeS: "", //剩余播放时间
        slideX: 0, //滑块x坐标
        progress: 0, //播放进度 百分比
      }
      this.setData({
        cur: newCur,
      })
        if (this.data.playType == true) {
          this.autoPlay() // 新增单独一个用于自动播放的方法
        }

    });
  },
  /**
   * onshow时再查一遍有没有点赞
   */
  reGetData() {
    let that = this
    let id = that.data.id
    let language = that.data.languageCurrent
    let api_token = wx.getStorageSync('api_token') || ''
    get_exhibit_detail(id, language, api_token).then(res => {
      console.log('再查展品详情====', res.data)
      that.setData({
        icollected: res.data.is_collection, // 本人是否收藏  1是0否
        iliked: res.data.is_like, // 本人是否喜欢  1是0否
        like_num: res.data.collection_num, // 喜欢人数
      })
    });
  },
  /**
   * 音频监听
   */
  audioMonitor() {
    var that = this;
    bgMusic.autoplay = false
    bgMusic.onPlay(() => {
      // console.log('开播了');
      that.data.cur.playing = true
      that.setData({
        cur: that.data.cur
      })
    });

    bgMusic.onStop(() => {
      wx.removeStorage({
        key: 'bjaudioId',
        success(res) {
          console.log(res)
          that.data.cur.playing = false
          that.setData({
            cur: that.data.cur
          })
          that.initAudio()
        }
      })
    })
    bgMusic.onPause(() => {
      that.data.cur.playing = false
      that.setData({
        cur: that.data.cur
      });
    })
    //播放进度
    bgMusic.onTimeUpdate(() => {
      let bjaudioId = wx.getStorageSync('bjaudioId');
      if (!bgMusic.paused) {
        // if (bjaudioId.exhibit_id == that.data.cur.exhibit_id) {

        // } else {
        //   console.log('当前页没有找到播放的音频');
        //   bgMusic.stop();
        //   bgMusic.seek(0)
        // }
        if (!that.data.audioTouch) {
          that.data.cur.playing = true
          that.data.cur.currentTimeS = Math.round(that.data.cur.duration) - Math.round(bgMusic.currentTime)
          that.data.cur.currentTime = Math.round(bgMusic.currentTime)
          that.data.cur.progress = bgMusic.currentTime / that.data.cur.duration * 100
          that.data.cur.slideX = 610 * bgMusic.currentTime / that.data.cur.duration / 750 * wx.getSystemInfoSync().windowWidth
          that.setData({
            cur: that.data.cur
          })
        }
      }
    })
    //播放结束
    bgMusic.onEnded(() => {
      // console.log("onEnded")
      wx.removeStorage({
        key: 'bjaudioId',
        success(res) {
          console.log(res)
          that.data.cur.playing = false
          that.setData({
            cur: that.data.cur
          })
          that.initAudio()
        }
      })
      if (that.data.loop == true) {
        //连播下一曲
        that.playNext()
      }

    })
    //播放错误
    bgMusic.onError((res) => {
      that.data.cur.playing = false
      that.setData({
        cur: that.data.cur
      })
      wx.showToast({
        title: '播放错误~',
        icon: 'none'
      })
    })

    //监听用户在系统音乐播放面板点击下一曲事件
    bgMusic.onNext((res) => {
      that.playNext()
    })

    //监听用户在系统音乐播放面板点击上一曲事件
    bgMusic.onPrev((res) => {
      that.playPrev()
    })
  },
  // 重置初始化音频
  initAudio() {
    var that = this;
    that.data.cur.currentTime = 0;
    that.data.cur.slideX = 0;
    that.data.cur.progress = 0;
    that.setData({
      cur: that.data.cur
    });
  },

  /**
   * 新写一个用于自动播放的方法
   */
  autoPlay() {
    console.log('进入自动播放方法')
    let that = this
    that.data.cur.playing = false
    that.setData({
      cur: that.data.cur
    })
  
    bgMusic.title = that.data.title; // 用全局title ok
    bgMusic.src = that.data.cur.audio;
    bgMusic.coverImgUrl = that.data.list_img; // 全局的展品封面图 ok
    that.data.cur.playing = true
    that.data.cur.isPause = false
    that.setData({
      cur: that.data.cur,
    })
    bgMusic.play(); // 执行播放背景音乐
    /**
     * 把当前cur缓存起来
     */
    wx.setStorage({
      key: 'bjaudioId',
      data: that.data.cur,
    })
  },

  /**
   * 重新改写播放逻辑  !!!!!! 新的
   * 功能介绍： 1. 当前是播放状态的话点击后就执行暂停
   *           2. 正常的播放- -
   */
  playAudio() {
    var that = this;
    /**
     * 如果当前是播放状态的话点击后就执行暂停
     */
    if (that.data.cur.playing) {
      that.pauseAudio();
      return
    }
    /**
     * 正常的播放逻辑----
     */
    /**
     * bug日记：  
     * 1. ios 播放时必须加title 不然会报错导致音乐不播放        
     * 2. 设置完倍速会从头播放，需要保存处理好当前进度
     */
    if (that.data.cur.audio) {
      /**
       * 背景音乐基本数据设置
       */
      /**
       * 背景音乐与当前cur.audio不一致，需要重新播放
       */
      if (bgMusic.src !== that.data.cur.audio) {
        bgMusic.title = that.data.title; // 用全局title ok
        bgMusic.src = that.data.cur.audio;
        bgMusic.coverImgUrl = that.data.list_img; // 全局的展品封面图 ok
        that.data.cur.playing = true
        that.data.cur.isPause = false
        that.setData({
          cur: that.data.cur,
        })
        this.initAudio()
        bgMusic.play(); // 执行播放背景音乐
        /**
         * 把当前cur缓存起来
         */
        wx.setStorage({
          key: 'bjaudioId',
          data: that.data.cur,
        })
      } else {
        /**
         * 背景音乐和当前cur的音频路径一致，不需要做多余的处理，直接继续播放就行
         */
        bgMusic.play(); // 执行播放背景音乐
      }
    }
  },
  /**
   * 暂停
   */
  pauseAudio() {
    var that = this
    bgMusic.pause()
    that.data.cur.playing = false
    that.setData({
      cur: that.data.cur,
    })
  },


  /**
   * 获取展品相关评论
   */
  getExhibitComment() {
    let that = this
    let id = that.data.id
    const {
      page,
      limit,
      list
    } = this.data;
    get_exhibit_comment(page, limit, id).then(res => {
      console.log('评论====', res.data)
      that.setData({
        commentNum: res.data.comment_num, // 留言总数
      })
      /**
       * 处理分页的评论
       */
      let commentsData = res.data.comment_list
      if (limit > commentsData.length) {
        that.setData({
          page: that.data.page * 1 + 1,
          list: [...list, ...commentsData], // es6合并数组
          notMore: true,
        });
      } else {
        that.setData({
          page: that.data.page * 1 + 1,
          list: [...list, ...commentsData],
          notMore: false,
        });
      }
    });
  },

  /**
   * 上一个
   */
  playPre() {
    let prev_id = this.data.prev_id
    if (prev_id == '') {
      wx.showToast({
        title: '已经是第一个了',
        icon: 'none',
      });
    } else {
      this.setData({
        id: prev_id,
        playType: true
      })
      this.getExhibitDetail(); //展品详情
      this.getExhibitComment(); //展品相关评论
      this.initAudio();
    }

  },
  /**
   * 下一个
   */
  playNext() {
    let next_id = this.data.next_id
    if (next_id == '') {
      wx.showToast({
        title: '已经是最后一个了',
        icon: 'none',
      });
    } else {
      this.setData({
        id: next_id,
        playType: true
      })
      this.getExhibitDetail(); //展品详情
      this.getExhibitComment(); //展品相关评论
      this.initAudio();
    }
  },

  /**
   * 切换语言
   */
  changelanguage(e) {
    var index = e.currentTarget.dataset.index //现在选中的
    if (index !== this.data.languageCurrent) {
      this.setData({
        languageCurrent: index
      })
      /**
       * 重新查询新的语种资源
       */
      this.getExhibitDetail()
      /** 切换语种之后，改变音频 */
      let newCur = {
        playing: true, //是否正在播放
        list_img: this.data.list_img,
        exhibit_id: this.data.id,
        list_img: this.data.list_img,
        exhibit_id: this.data.id,
        exhibit_name: this.data.title,
        audio: this.data.exhibitInfo.audio,
        duration: this.data.exhibitInfoaudio_time_long, //语音长度
        currentTime: "0", //已经播放时间
        currentTimeS: "", //剩余播放时间
        slideX: 0, //滑块x坐标
        progress: 0, //播放进度 百分比
      }
      this.setData({
        cur: newCur
      })
      // 初始化音频
      this.initAudio()
      bgMusic.title = this.data.title; // 用全局title ok
      bgMusic.src = this.data.cur.audio;
      bgMusic.coverImgUrl = this.data.list_img; // 全局的展品封面图 ok
      this.data.cur.playing = true
      this.data.cur.isPause = false
      wx.setStorage({
        key: 'bjaudioId',
        data: this.data.cur,
      })
    } else {
      return
    }
  },


  /**
   * 移动音频滑块，此处不能设置moveable-view 的x值，会有冲突延迟
   */
  seekTouchMove(e) {
    var that = this
    if (e.detail.source == "touch") {
      that.setData({
        audioTouch: true
      })
      var progress = Math.round(e.detail.x / (610 / 750 * wx.getSystemInfoSync().windowWidth) * 100)
      that.data.cur.progress = progress
      that.data.cur.slideX = e.detail.x
      that.data.cur.currentTime = Math.round(progress * that.data.cur.duration / 100)
      that.setData({
        cur: that.data.cur
      })
    }
  },
  //移动结束再setData，否则真机上会产生 “延迟重放” 
  seekTouchEnd(e) {
    var that = this
    bgMusic.seek(bgMusic.duration * (that.data.cur.progress / 100))
    setTimeout(function () {
      that.setData({
        audioTouch: false
      })
      if (!that.data.cur.playing) {
        that.playAudio()
      }
    }, 100)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    return {
      title: that.data.title,
      imageUrl: that.data.exhibitInfo.list_img
    }
  },
  /**
   * 页面滚动距离
   */
  onPageScroll: function (e) {
    this.data.scrollTop = e.scrollTop
  },
  /**
   * 锚点定位到留言评论
   */
  toComment() {
    if (this.data.commentNum >= 1) {
      var scrollTop;
      var top = this.data.scrollTop
      const query = wx.createSelectorQuery(); //创建节点查询器
      query.select('#comment').boundingClientRect() //选择toViewid获取位置信息
      query.selectViewport().scrollOffset() //获取页面查询位置的
      query.exec(function (res) {
        scrollTop = res[0].top
        res[1].scrollTop
        wx.createSelectorQuery().select('.page').boundingClientRect(function (rect) {
          wx.pageScrollTo({
            scrollTop: scrollTop + top,
            duration: 0
          })
        }).exec()
      })
    }

  },
  /**
   * 查看更过评论
   */
  moreComment() {
    console.log('查看更多评论');
    this.getExhibitComment()
  },
  /**
   * 标记喜欢 or 不喜欢
   */
  toLike() {
    let that = this
    let id = that.data.id
    let like_num = that.data.like_num
    let api_token = wx.getStorageSync('api_token')
    if (api_token) {
      do_like(1, id, api_token).then(res => {
        // console.log('res====', res)
        if (res.msg == '点赞成功') {
          that.setData({
            iliked: 1,
            like_num: like_num + 1
          })
        } else {
          that.setData({
            iliked: 0,
            like_num: like_num - 1
          })
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }
  },
  /**
   * 收藏 or 取消收藏
   */
  onCollect() {
    let that = this
    let id = that.data.id
    let api_token = wx.getStorageSync('api_token')
    if (api_token) {
      do_like(2, id, api_token).then(res => {
        // console.log('res====', res)
        if (res.msg == '收藏成功') {
          that.setData({
            icollected: 1
          })
        } else {
          that.setData({
            icollected: 0
          })
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }
  },
  /**
   * 输入留言板
   */
  inputContent(e) {
    this.setData({
      commentContent: e.detail.value,
    })
  },
  /**
   * 提交留言
   */
  commentSumbit() {
    let that = this
    let comment = this.data.commentContent
    let id = this.data.id
    let api_token = wx.getStorageSync('api_token')
    if (api_token) {
      if (comment.length < 1) {
        wx.showToast({
          title: '留言内容不可为空',
          icon: 'none'
        })
      } else {
        do_comment(api_token, id, comment).then(res => {
          that.setData({
            commentContent: ''
          })
          wx.showToast({
            title: '评论成功，审核通过后会显示在列表中',
            icon: 'none'
          });
        });
      }

    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }

  },
  /**
   * 生成分享卡
   */
  toShareCard() {
    let id = this.data.exhibitInfo.id
    // wx.navigateTo({
    //   url: '/pages/index/exhibitionDeatils/shareCard?id=' + id,
    // })
    wx.showToast({
      title: '建设中...',
      icon: 'none'
    })
  },
  /**
   * 点击轮播图查看大图
   */
  showZtsj(e) {
    let {
      i
    } = e.currentTarget.dataset
    let that = this;
    let newArr = [...that.data.carousel]
    for (let i = 0; i < newArr.length; i++) {
      newArr[i] = newArr[i]
    }
    wx.previewImage({
      current: newArr[i],
      urls: newArr
    })
  },
  // 展开更多
  toggleFold: function (e) {
    this.setData({
      isFolded: !this.data.isFolded,
    });
  },

  /**
   * 切换轮播图
   */
  swiperChange: function (e) {
    var that = this;
    var current = e.detail.current + 1;
    that.setData({
      currentIndex: current
    });
  },
  /**
   * 打开分享弹窗
   */
  openShareWindow() {
    this.setData({
      shareWindowFlag: true
    })
  },
  /**
   * 关闭分享弹窗
   */
  closeShareWindow() {
    this.setData({
      shareWindowFlag: false
    })
  },

  /**
   *  【展品视频】 、【三维环视】跳转到webView
   *   1 - 展品视频
   *   2 - 三维
   */
  toWebView(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index)
    if (index == 1) {
      let mp4_path = this.data.exhibitInfo.mp4_path
      let title = this.data.exhibitInfo.exhibit_name
      if (mp4_path !== '') {
        wx.navigateTo({
          url: '/pages/exhibition/webView/webView?url=' + mp4_path+ '&title='+title,
        })
      }
    } else {
      let web3d_url = this.data.exhibitInfo.url3d
      if (web3d_url !== '') {
        wx.navigateTo({
          url: '/pages/exhibition/webView/webView?url=' + web3d_url+ '&title=三维环视',
        })
      }
    }

  },
  /**
   * 查看位置 带着id去导览页
   */
  toGuide() {
    let id = this.data.exhibitInfo.id
    wx.navigateTo({
      url: '/pages/guide/position?id=' + id,
    })
  }
})