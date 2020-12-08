var app = getApp();
const bgMusic = wx.getBackgroundAudioManager();
// import {
//   add_play_nums
// } from '../../apis/api_index.js';
Component({
  properties: {
    // 数据
    audioDatas: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal.length > 0) {
          for (let i = 0; i < newVal.length; i++) {
            if (newVal[i].audio.indexOf("http") == -1) {
              newVal[i].audio = newVal[i].audio
            }
          }
        }
      }
    }
  },
  options: {
    styleIsolation: 'apply-shared', //页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面
  },
  data: {
    base_url: app.globalData.base_url,
    opt: '',
    sort: 1, //排序 1正序 2倒叙
    cur: {
      index: null, //音频索引
      playing: 3, //是否正在播放 1正在播放 2暂停  3停止
      duration: "", //语音长度
      currentTime: "", //剩余播放时间
      audio: '',
      id: '',
      title: '',
      ext_group_image: '', //所在展厅图片
      language_id: '', //语音id
    },
  },
  pageLifetimes: {
    show() {
      this.audioMonitor(); //背景音乐监听事件
    },
    hide() {
      // 页面被隐藏
      bgMusic.stop()
      bgMusic.seek(0)
    },
  },

  methods: {
    paixu() {
      let that = this;
      that.setData({
        sort: that.data.sort == 1 ? 2 : 1,
        audioDatas: that.data.audioDatas.reverse(),
        [`cur.index`]: that.data.audioDatas.length - 1 - that.data.cur.index
      })
    },
    audioMonitor() {
      let that = this;
      bgMusic.onPlay(() => {
        // console.log('开播了');
        that.data.cur.playing = 1
        that.setData({
          cur: that.data.cur
        })
      });

      bgMusic.onStop(() => {
        that.data.cur.playing = 3
        that.setData({
          cur: that.data.cur
        })
        wx.removeStorage({
          key: 'bjaudioId',
          success(res) {
            console.log(res)
          }
        })
      })
      bgMusic.onPause(() => {
        that.data.cur.playing = 2
        that.setData({
          cur: that.data.cur
        })
      })

      //播放进度
      bgMusic.onTimeUpdate(() => {
        let bjaudioId = wx.getStorageSync('bjaudioId');
        if (!bgMusic.paused) {
          if (bgMusic.src == that.data.cur.audio && bjaudioId.id == that.data.cur.id) {
            // console.log(Math.round(bgMusic.currentTime))
            that.data.cur.playing = 1
            that.data.cur.currentTime = Math.round(that.data.cur.duration) - Math.round(bgMusic.currentTime)
            that.setData({
              cur: that.data.cur
            })
          } else {
            if (that.data.audioDatas.length > 0) {
              let activeAudio = that.data.audioDatas.findIndex(o => o.id === bjaudioId.id);
              if (activeAudio == -1) {
                // 当前页没有找到播放的音频

                // bgMusic.stop();
                // that.initAudio(0)
              } else {
                that.initAudio(activeAudio)
                that.playAudio()
              }
            }
          }
        }
      })
      //播放结束
      bgMusic.onEnded(() => {
        // console.log("onEnded")

        that.data.cur.playing = 3
        that.setData({
          cur: that.data.cur
        })
        wx.removeStorage({
          key: 'bjaudioId',
          success(res) {
            console.log(res)
          }
        })

        //连播下一曲
        that.playNext()

      })
      //播放错误
      bgMusic.onError((res) => {
        that.data.cur.playing = 3
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
    //全部播放
    allPlay() {
      let that = this;
      that.data.cur.playing == 1 ? that.pauseAudio() : that.playAudio();
    },
    // 重置初始化音频
    initAudio(num) {
      var that = this;
      var index = num || 0;
      // console.log(index)
      that.data.cur.index = index;
      that.data.cur.playing = 3;
      if (that.data.audioDatas[index]) {
        that.data.cur.ext_group_image = that.data.audioDatas.ext_group_image
        that.data.cur.id = that.data.audioDatas[index].id
        that.data.cur.title = that.data.audioDatas[index].title
        that.data.cur.audio = that.data.audioDatas[index].audio
        that.data.cur.duration = that.data.audioDatas[index].audio_time;
        that.data.cur.currentTime = that.data.audioDatas[index].audio_time;
        that.data.cur.language_id = that.data.audioDatas[index].language_id;
      }
      that.setData({
        cur: that.data.cur
      });
    },
    // 点击按钮播放、暂停
    toggleList(e) {
      var that = this;
      var tar_idx = e.currentTarget.dataset.index //目标音频
      var cur_idx = that.data.cur.index //当前音频
      var playing = that.data.cur.playing
      if (cur_idx == tar_idx) {
        playing == 1 ? that.pauseAudio() : that.playAudio();
      } else {
        that.initAudio(tar_idx)
        that.playAudio()
      }
    },
    // 播放
    playAudio() {
      var that = this;
      //bug ios 播放时必须加title 不然会报错导致音乐不播放 
      var index = that.data.cur.index || 0;
      if (that.data.audioDatas[index].audio) {
        bgMusic.title = that.data.audioDatas[index].title;
        bgMusic.src = that.data.audioDatas[index].audio;
        bgMusic.coverImgUrl = that.data.audioDatas[index].list_img;
        bgMusic.play()
        that.data.cur.playing = 1
        that.setData({
          cur: that.data.cur,
        })
        wx.setStorage({
          key: 'bjaudioId',
          data: that.data.audioDatas[index],
        })

        // 播放量+1接口
        console.log('看这里----', that.data.cur)
        // if(that.data.cur.language_id!=='') {
        //   add_play_nums(that.data.cur.language_id)
        // }
      }
    },
    //暂停播放
    pauseAudio() {
      var that = this
      bgMusic.pause()
      that.data.cur.playing = 2
      that.setData({
        cur: that.data.cur,
      })
      // console.log('暂停')
    },

    //上
    playPrev() {
      var that = this;
      var index = parseInt(that.data.cur.index);
      if (index == 0) {
        wx.showToast({
          title: '这已是第一个了',
          icon: 'none'
        })
      } else {
        that.initAudio(index - 1)
        setTimeout(() => {
          that.playAudio()
        }, 500)
      }
    },
    // 下
    playNext() {
      var that = this;
      var index = parseInt(that.data.cur.index)
      if (index + 1 == that.data.audioDatas.length) {
        wx.showToast({
          title: '这已是最后一个了',
          icon: 'none'
        })
      } else {
        that.initAudio(index + 1)
        setTimeout(() => {
          that.playAudio()
        }, 500)
      }
    },
  }
});