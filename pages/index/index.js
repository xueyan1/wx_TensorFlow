Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onLoad: function (options) {
    const camera = wx.createCameraContext(this)
    let count = 0
    const lister =  camera.onCameraFrame((frame) => {
      count++
      if(count === 4){
        console.log(frame)
        count = 0 
        return
      }
    })
    // lister.start()
    this.canvas = wx.createCanvasContext("pose", this)
  },
  onReady: function () {
    
  },

  onShow: function () {
    
  },

  onHide: function () {
    
  },

  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})