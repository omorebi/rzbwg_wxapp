//获取应用实例
const app = getApp()
import {
    get_question,
    get_question_list,
    post_question
} from '../../../apis/api_user.js';

Page({
    data: {
        base_url: app.globalData.base_url,
        list: [],
        total: '',
        flag: true,
        currentQuestion: [], // 当前显示的问题
        type: 1, // 默认是1显示题目 2- 提交成功显示，成功页
        questions: [], // 所有问卷数据 全部！！
        index: 0, // 记录索引
        postData: [], // 要提交的问卷数据
        questionBankId: 0, // 题库id 
    },

    onLoad: function () {
        this.getData()
    },
    /**
     * 获取第一个接口
     */
    getData() {
        let that = this
        let museum_id = app.globalData.museum_id
        get_question(museum_id).then(res => {
            console.log('get_question_list返回数据', res.data)
            that.data.questionId = res.data.question_id
            // console.log(that.data.questionId)
            /**
             * 拿到第一个questionId
             */
            that.getAllQuestionByQuestionId()
        })
    },
    /**
     * 获取所有问题
     */
    getAllQuestionByQuestionId() {
        let that = this
        let question_id = that.data.questionId
        get_question_list(question_id).then(res => {
            console.log('get_question_list返回数据', res.data.info)
            // let questionBankId = res.data.ques.id // 题库id
            that.setData({
                questions: res.data.info,
                // questionBankId: questionBankId
            })
            var num = res.data.info.length
            if (num < 10) {
                var str = '0' + num
                that.setData({
                    total: str
                })
            } else {
                that.setData({
                    total: num
                })
            }
            console.log('所有问题', that.data.questions)
            // 处理第一道问题
            const index = that.data.index
            that.setData({
                currentQuestion: that.data.questions[index]
            })
            console.log("第一题", that.data.currentQuestion)
            // 处理要提交的数据 postData
            that.data.questions.forEach(item => {
                that.data.postData.push({
                    ques_type: item.type,
                    id: item.id,
                    option_ids: [],
                    ques_option: [],
                });
            });
            that.setData({
                postData: that.data.postData
            })
        });
    },

    /**
     * 选择题目
     */
    selectOption(e) {
        var option = e.currentTarget.dataset.option;
        var that = this
        var currentQuestion = that.data.currentQuestion
        var myData = JSON.parse(JSON.stringify(that.data.postData))

        myData.forEach(item => {
            if (currentQuestion.id === item.id) {
                const index = item.option_ids.indexOf(option.id);
                // console.log('存在吗？', index)
                const obj = {
                    option_id: option.id,
                    option_type: option.option_type,
                    ques_option_text: '',
                };
                if (currentQuestion.type === 1) {
                    item.ques_option = [];
                    item.option_ids = [];
                    if (index !== -1) {
                        // console.log('存在的话去掉')
                        item.option_ids.splice(index, 1);
                        item.ques_option.splice(index, 1);
                    } else {
                        // console.log('没有的话push')
                        item.option_ids.push(option.id);
                        item.ques_option.push(obj);
                    }
                } else if (currentQuestion.type === 2) {
                    if (index !== -1) {
                        item.option_ids.splice(index, 1);
                        item.ques_option.splice(index, 1);
                    } else {
                        item.option_ids.push(option.id);
                        item.ques_option.push(obj);
                    }
                }
            }
        });

        that.setData({
            postData: myData
        })
        var data = that.data.postData
        var i = that.data.index
        that.setData({
            list: data[i].option_ids
        })
    },

    /**
     * 上一题
     */
    previousQuestion() {
        // console.log('上一题')
        var that = this
        var newIndex = that.data.index - 1
        if (!that.data.questions.length) return;
        that.setData({
            index: newIndex
        })
        that.setData({
            currentQuestion: that.data.questions[newIndex]
        })
        var data = that.data.postData
        var i = that.data.index
        that.setData({
            list: data[i].option_ids
        })
    },

    /**
     * 下一题
     */
    nextQuestion() {
        // console.log('下一题')
        var that = this
        var indx = that.data.index
        var newIndex = that.data.index + 1
        if (!that.data.questions.length) return;
        if (that.data.postData[indx].option_ids.length) {
            that.setData({
                index: newIndex
            })
            that.setData({
                currentQuestion: that.data.questions[newIndex]
            })
            var data = that.data.postData
            var i = that.data.index
            that.setData({
                list: data[i].option
            })
        } else {
            wx.showToast({
                title: "请选择选项",
                icon: 'none'
            })
        }
    },
    /**
     * 提交问卷
     */
    submitQuestion() {
        let indx = this.data.index
        let id = this.data.questionBankId //题库id
        let data = this.data.postData
        let that = this
        if (this.data.postData[indx].option_ids.length) {
            console.log('提交问卷=========', this.data.postData)
            post_question(id, data).then(res => {
                console.log('提交成功')
                that.setData({
                    type: 2
                })
            });
        } else {
            wx.showToast({
                title: "请选择选项",
                icon: 'none'
            })
        }
    },

    /**
     * 返回
     */
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    }
})