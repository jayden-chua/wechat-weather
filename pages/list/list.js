const cnDays = {
  0: '星期一',
  1: '星期二',
  2: '星期三',
  3: '星期四',
  4: '星期五',
  5: '星期六',
  6: '星期日',
};

Page({

  /**
   * Page initial data
   */
  data: {
    weekWeather: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getWeekWeather();
  },

  onPullDownRefresh() {
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh();
    });
  },
  
  getWeekWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        time: new Date().getTime(),
        city: '上海市'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        let result = res.data.result;
        this.setData({
          weekWeather: result.map((item) => {
            let date = new Date();
            date.setDate(date.getDate() + item.id);

            return {
              day: item.id === 0 ? '今天' : cnDays[date.getDay()],
              date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
              temp: `${item.minTemp}° - ${item.maxTemp}°`,
              iconPath: `/images/${item.weather}-icon.png`
            }
          })
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        callback && callback();
      }
    })
  }
})