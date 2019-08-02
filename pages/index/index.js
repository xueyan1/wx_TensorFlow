const posenet = require('@tensorflow-models/posenet')
const rr = require('regenerator-runtime')
const tf = require('@tensorflow/tfjs-core')

Page({
  data: {
  },
  async onReady() {
    const camera = wx.createCameraContext(this)
    this.canvas = wx.createCanvasContext("pose", this)
    this.loadPosenet()
    let count = 0
    const lister = camera.onCameraFrame((frame) => {
      count++
      if (count === 10) {
        if(this.net){
         this.drawImg(frame)
        }
        count = 0
        return
      }
    })
    lister.start() // 开始监听camera
  },
  //处理数据
  async deleFrame(frame,net){
    const imgData = {data: new Uint8Array(frame.data),width:frame.width,height:frame.height} // 获取图片的数据
    const imgSlice = tf.tidy(() => { // 此方法用于释放内存
      const imgTensor = tf.browser.fromPixels(imgData, 3)
      return imgTensor.slice([0, 0, 0], [-1, -1, 3])//截取数据
    })
    const pose = await net.estimateSinglePose(imgSlice, {
      flipHorizontal: false // 不反转图片
    });
    imgSlice.dispose()
    return pose
  },
  //异步加载模型数据
  async loadPosenet() {
    const POSENET_URL =
    'https://www.gstaticcnapps.cn/tfjs-models/savedmodel/posenet/mobilenet/float/050/model-stride16.json';
    this.net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 193,
      multiplier: 0.5,
      modelUrl:POSENET_URL //使用的是中国镜像
    })
  },
  //画canvas
  async drawImg(frame){
    const pose = await this.deleFrame(frame, this.net)
    console.log(pose)

    if(pose == null || this.canvas == null ) return

    if(pose.score>=0.3 ){ // 姿势打分的数据
      for(let item in pose.keypoints){
        const point = pose.keypoints[item]
        if (point.score >= 0.5){
          const {x,y} = point.position
          this.drawCircle(this.canvas,x,y)
        }
      }
      // 画线
      const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints,0.5)
      for (let i in adjacentKeyPoints){
        const points = adjacentKeyPoints[i]
        this.drawLine(this.canvas,points[0].position, points[1].position)
      }
      this.canvas.draw()
    }
  },
  drawCircle(canvas,x,y){
    canvas.beginPath()
    canvas.arc(x*0.72,y*0.72,3,0,2*Math.PI)
    canvas.fillStyle = `aqua`
    canvas.fill()
  },
  drawLine(canvas,pos0,pos1){
    canvas.beginPath()
    canvas.moveTo(pos0.x*0.72,pos0.y*0.72)
    canvas.lineTo(pos1.x*0.72,pos1.y*0.72)
    canvas.lineWidth = 2
    canvas.strokeStyle = `aqua`
    canvas.stroke()
  }
})

