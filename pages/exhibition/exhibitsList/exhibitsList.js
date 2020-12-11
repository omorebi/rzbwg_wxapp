// pages/exhibition/exhibitsList/exhibitsList.js
const app = getApp()
import {
    get_exhibit_list
} from '../../../apis/api_index.js';
Page({
    data: {
        base_url: app.globalData.base_url,
        navbarHeight: 0,
        time: 0,
        page: 1,
        limit: 10,
        list: [],
        currentIndex: null,
        canvasList: null,
        notMore: false, // 加载更多
        backgroundAuidoStatus: false, // false - paused; true - playing;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.backgroundAudioManager = wx.getBackgroundAudioManager();

        this.getExhibitList();
        this.loadMore();
        this._time = 0;
        this._playingCanvas = null;
    },

    onUnload() {
        this._observer && this._observer.disconnect();
        this._animateId && clearInterval(this._animateId);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.queryCanavs('canvas');
    },
    onHide: function () {
        this.backgroundAudioManager.stop();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.backgroundAudioManager.onEnded(() => {
            this.setData({
                backgroundAuidoStatus: false
            });
            console.log('播放完成');
        });

        this.backgroundAudioManager.onPlay(() => {
            this.setData({
                backgroundAuidoStatus: true
            });
        });

        this.backgroundAudioManager.onPause(() => {
            this.setData({
                backgroundAuidoStatus: false
            });
            this.pauseAudio();
            console.log('暂停');
        });

        this.backgroundAudioManager.onTimeUpdate(() => {});

        this.backgroundAudioManager.onStop(() => {
            console.log('stop');
            const playingCanvas = this._playingCanvas;
            if (playingCanvas) {
                const width = playingCanvas.width;
                const height = playingCanvas.height;
                clearInterval(this._animateId);
                this.initCanvas(width, height, playingCanvas);
            }

            this.setData({
                backgroundAuidoStatus: false,
                currentIndex: null
            });
            this._playingCanvas = null;
            this._time = 0;
        });
    },

    /**
     * 获取展品列表  (museum_id,page,limit,exhibition_id
     */
    getExhibitList() {
        let that = this
        let museum_id = app.globalData.museum_id
        const {
            page,
            limit,
            list
        } = this.data;
        get_exhibit_list(museum_id, page, limit, 1).then(res => {
            var data = res.data
            console.log('藏品列表', res.data)
            if (limit > data.length) {
                this.setData({
                    page: page + limit,
                    list: [...list, ...data], // es6合并数组
                    bannerList: res.data.top_list,
                    notMore: true,
                });
                this._observer && this._observer.disconnect();
            } else {
                this.setData({
                    page: page + limit,
                    list: [...list, ...data],
                    bannerList: res.data.top_list,
                    notMore: false,
                });
            }

        });
    },
    /**
     * 跳转至具体展品页
     */
    toDetails(e) {
        console.log(e.currentTarget.dataset.id)
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/exhibition/detailExhibits/detailExhibits?id=' + id,
        })
    },
    /**
     * 获取全部指定选择器的canavs
     * @param {string} selector 选择器
     */
    queryCanavs(selector) {
        const query = wx.createSelectorQuery();

        query
            .selectAll(selector)
            .fields({
                node: true,
                size: true
            })
            .exec(res => {
                const dpr = wx.getSystemInfoSync().pixelRatio;
                res[0].forEach(item => {
                    // this.initCanvas(item.width * dpr, item.height * dpr, item.node);
                });
            });
    },

    /**
     * 初始化播放按钮
     * @param {number} width - canvas width rpx
     * @param {number} height - canvas height rpx
     * @param {CanvasRenderingContext2D} canvas
     */
    initCanvas(width, height, canvas) {
        if (!canvas) return;
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        this.setData({
            currentIndex: null,
        });
        this._time = 0;
        this._playingCanvas = null;
        return;

        // 下面的fill() 方法在真机上存在bug
        ctx.fillStyle = '#BC4018';
        ctx.beginPath();
        ctx.arc(Math.round(width / 2), Math.round(height / 2), Math.round(width / 2), 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(Math.round(width / 2) + 8 * dpr, Math.round(height / 2));
        ctx.lineTo(Math.round(width / 2) - 5 * dpr, Math.round(height / 2) - 8 * dpr);
        ctx.lineTo(Math.round(width / 2) - 5 * dpr, Math.round(height / 2) + 8 * dpr);
        ctx.fillStyle = '#ffffff';
        ctx.closePath();
        ctx.fill();
    },

    /**
     * 播放进度条业务逻辑
     * @param {CanvasRenderingContext2D} canvas
     * @param {number} width - width
     * @param {number} height - height
     * @param {number} rpx - rpx
     * @param {number} [time] - duration
     */
    playCanvas(canvas, width, height, time = 60) {
        if (!canvas) return;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const rpx = wx.getSystemInfoSync().pixelRatio;
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1 * rpx;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2 - ctx.lineWidth, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = '#BC4018';
        ctx.save();

        /**
         * 音乐暂停时的显示
         */
        if (this.data.backgroundAuidoStatus) {
            this.renderPlaying(ctx, width, height, rpx);
            ctx.restore();
            ctx.save();
        } else {
            this.renderPaused(ctx, width, height, rpx);
            ctx.restore();
            ctx.save();
        }

        ctx.beginPath();
        const calc = ((Math.PI / 180) * 360) / time;
        const run =
            calc * this._time > 60 ? calc * this._time : calc * this._time - (Math.PI / 180) * 60;
        ctx.lineWidth = 2 * rpx;
        ctx.arc(width / 2, height / 2, width / 2 - ctx.lineWidth, (-Math.PI / 180) * 60, run, false);
        ctx.stroke();
    },

    /**
     * 播放进度条动画
     * @param {CanvasRenderingContext2D} canvas
     * @param {number} width - canvas width rpx
     * @param {number} height - canvas height rpx
     * @param {number} time - audio duration
     */
    animate(canvas, width, height, time) {
        this._playingCanvas = canvas;
        this._animateId = setInterval(() => {
            this._time = this._time + 0.1;

            this.playCanvas(canvas, width, height, time);

            if (this._time >= time) {
                clearInterval(this._animateId);
                this.nextAudio(true);
            }
        }, 100);
    },

    /**
     * handler click
     * @param {Event} event - eventhandle
     */
    handlerClick(event) {
        console.log('hhh')
        const {
            index
        } = event.currentTarget.dataset;
        const query = wx.createSelectorQuery();
        /** 播放中的处理 */
        if (this.data.backgroundAuidoStatus) {
            if (index === this.data.currentIndex) {
                this.backgroundAudioManager.pause();
                this._animateId && clearInterval(this._animateId);
            } else {
                this.setAudio(index);
                progressHandler.call(this);
            }

            return;
        }

        /** 暂停中或刚刚初始化时的处理 */
        if (!this.data.backgroundAuidoStatus) {
            if (index === this.data.currentIndex) {
                this.backgroundAudioManager.play();
                progressHandler.call(this);
            } else {
                this.setAudio(index);
                progressHandler.call(this);
            }
            return;
        }

        /**
         * 进度条业务逻辑
         */
        function progressHandler() {
            query
                .select(`#${event.currentTarget.id}`)
                .fields({
                    size: true,
                    node: true
                })
                .exec(res => {
                    const canvas = res[0].node;
                    const {
                        duration
                    } = this.data.list[index];
                    const rpx = wx.getSystemInfoSync().pixelRatio;
                    const width = res[0].width * rpx;
                    const height = res[0].height * rpx;

                    if (this._playingCanvas) {
                        const playingCanvas = this._playingCanvas;
                        if (this.data.currentIndex === index) {
                            this._animateId && clearInterval(this._animateId);
                        } else {
                            this._animateId && clearInterval(this._animateId);
                            this.initCanvas(width, height, playingCanvas);
                        }
                    }

                    this.setData({
                        currentIndex: index
                    });
                    this.animate(canvas, width, height, duration);
                });
        }
    },

    /**
     * 设置背景音频的播放src
     * @param {number} index - 列表的index
     */
    setAudio(index) {
        const exhibition = this.data.list[index];
        if (exhibition) {
            const {
                audio,
                exhibit_list_img,
                exhibit_name
            } = exhibition;
            this.backgroundAudioManager.title = exhibit_name;
            this.backgroundAudioManager.string = '奉化博物馆';
            this.backgroundAudioManager.src = audio;
            this.backgroundAudioManager.coverImgUrl = exhibit_list_img;
        }
    },

    /**
     * 选择播放中的状态 - 中间的不妨按钮
     * @param {CanvasRenderingContext2D} ctx canvas2d
     * @param {number} width - canvas width
     * @param {number} height - canvas height
     * @param {number} rpx - rpx
     */
    renderPlaying(ctx, width, height, rpx) {
        ctx.beginPath();
        ctx.lineWidth = 2 * rpx;
        ctx.lineCap = 'round';
        ctx.arc(width / 2.4, height / 2, width / 4, (-Math.PI / 180) * 60, (Math.PI / 180) * 60, false);
        // ctx.strokeStyle = '#BC4018';
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2 * rpx;
        ctx.arc(width / 2.8, height / 2, width / 6, (-Math.PI / 180) * 60, (Math.PI / 180) * 60, false);
        // ctx.strokeStyle = '#BC4018';
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2 * rpx;
        ctx.arc(width / 3, height / 2, 1 * rpx, (-Math.PI / 180) * 60, (Math.PI / 180) * 60, false);
        // ctx.strokeStyle = '#BC4018';
        ctx.stroke();
    },

    /**
     * 选择播放中的状态 - 中间的不妨按钮
     * @param {CanvasRenderingContext2D} ctx canvas2d
     * @param {number} width - canvas width
     * @param {number} height - canvas height
     * @param {number} rpx - rpx
     */
    renderPaused(ctx, width, height, rpx) {
        ctx.beginPath();
        ctx.lineWidth = 3 * rpx;
        // ctx.lineCap = 'round';
        ctx.moveTo(width / 2 - 3 * rpx, height / 3);
        ctx.lineTo(width / 2 - 3 * rpx, height - height / 3);
        // ctx.strokeStyle = '#BC4018';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width / 2 + 3 * rpx, height / 3);
        ctx.lineTo(width / 2 + 3 * rpx, height - height / 3);
        // ctx.strokeStyle = '#BC4018';
        ctx.stroke();
    },

    /**
     * 暂停正在播放的展项的回调
     */
    pauseAudio() {
        const playingCanvas = this._playingCanvas;
        const {
            currentIndex,
            list
        } = this.data;
        console.log(currentIndex);
        if (playingCanvas) {
            const rpx = wx.getSystemInfoSync().pixelRatio;
            const duration = list[currentIndex].duration;
            const {
                width,
                height
            } = playingCanvas;
            this.playCanvas(playingCanvas, width, height, duration);
        }
    },

    /**
     * 自动播放下一首或者重新初始化音频播放
     * @param {boolean} [isOpenNextAudio] - 是否开启循环播放
     */
    nextAudio(isOpenNextAudio) {
        const {
            list,
            currentIndex
        } = this.data;
        if (isOpenNextAudio && list.length !== 1) {
            let nextIndex;
            if (currentIndex < list.length - 1) {
                nextIndex = currentIndex + 1;
            } else {
                nextIndex = 0;
            }
            const event = {
                currentTarget: {
                    dataset: {
                        index: nextIndex,
                    },
                    id: `play_controll_${list[nextIndex].exhibit_id}`,
                },
            };
            this.initCanvas(this._playingCanvas.width, this._playingCanvas.height, this._playingCanvas);
            this.handlerClick(event);
        } else {
            this.setData({
                currentIndex: null,
            });
        }

        this._playingCanvas &&
            this.initCanvas(this._playingCanvas.width, this._playingCanvas.height, this._playingCanvas);
    },


    /**
     * 滚动到底部加载更多
     */
    loadMore() {
        this._observer = wx.createIntersectionObserver(this);
        this._observer.relativeToViewport().observe('.observer-el', res => {
            console.log(res);
            // 下来到底部
            if (res.intersectionRatio > 0) {
                this.getExhibitionList();
            }
        });
    },

    /**
     * 格式化音频的时间显示
     * @param {number} time - 秒数
     */
    formatAudioTime(time) {
        if (time && typeof time === 'number') {
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time - hours * 3600) / 60);
            const seconds = time % 60;

            return hours ?
                `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` :
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        if (!time) {
            return '00:00';
        }

        return time;
    },
})