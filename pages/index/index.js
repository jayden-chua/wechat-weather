const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
};

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
    forecast: []
  },
  
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '上海市'
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let result = res.data.result;
        this.set3HourlyForecast(result);
        this.setCurrentWeather(result);
        this.setCurrentWeatherDetails(result);
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  setCurrentWeather(result) {
    let weather = result.now.weather;
    let temp = result.now.temp;

    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    });

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  set3HourlyForecast(result) {
    let nowHour = new Date().getHours();
    let forecast = result.forecast.map(item => {
      return {
        time: item.id === 0 ? '现在' : ((3 * item.id + nowHour) % 24) + '时',
        temp: item.temp + '°',
        icon: '/images/' + item.weather + '-icon.png'
      }
    });
    this.setData({
      forecast: forecast
    });
  },
  setCurrentWeatherDetails(result) {
    let currentDate = new Date();
    
    this.setData({
      currentDate: `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDay()} 今天`,
      currentTempRange: result.today.minTemp + '° - ' + result.today.maxTemp + '°'
    });
  },
  onLoad() {
    this.getNow();
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    });
  },
  onTapWeatherDetails() {
    wx.showToast();
    wx.navigateTo({
      url: '/pages/list/list',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
});