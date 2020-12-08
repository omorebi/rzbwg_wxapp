// pages/user/question/question.js
Page({
    data: {
        // radio: '1',
        questionList:[
            {
                id: 1,
                title: '您最近三个月是否有出游计划？（单选）',
                options: [
                    {
                        id: '12',
                        option_info: "是"
                    },
                    {
                        id: '13',
                        option_info: "否"
                    }
                ],
                answer: '0'
            },
            {
                id: 2,
                title: '请问您计划什么时候出游（单选）',
                options: [
                    {
                        id: '14',
                        option_info: "周末"
                    },
                    {
                        id: '15',
                        option_info: "节假日"
                    },
                    {
                        id: '16',
                        option_info: "平时"
                    }
                ],
                answer: ''
            },
            {
                id: 3,
                title: '请问您这次出行的原因（单选）',
                options: [
                    {
                        id: '17',
                        option_info: "公务出差"
                    },
                    {
                        id: '18',
                        option_info: "家庭外出"
                    },
                    {
                        id: '19',
                        option_info: "单位统一安排"
                    },
                    {
                        id: '20',
                        option_info: "其他"
                    }
                ],
                answer: ''
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    onChange(event) {
        let index = event.currentTarget.dataset.index
        let id = event.detail
        console.log(index)
        let list = "questionList[" + index + "].answer";
        this.setData({
            [list]: event.detail
        })
        console.log(this.data.questionList)
    },
})