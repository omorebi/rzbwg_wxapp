
const app = getApp()
const onfire = require("../beacon/onfire1.0.6.js")
var beaconArray = []

module.exports = {
  startReceivingBeacons: startReceivingBeacons,
  stopReceivingBeacons: stopReceivingBeacons,
}



//开始收号
function startReceivingBeacons() {
  var that = this;
  //console.log("开始收号");
  startBeaconDiscovery();

  //蓝牙状态监控
  wx.onBeaconServiceChange(function (res) {
    //console.log("onBeaconServiceChange", res)
    if (res.available) {
      let kaiqi = setTimeout(function () {
        startBeaconDiscovery();
      }, 1000)

    } else if (!res.available) {
      //console.log("收号功能不可用");
    }
  });

}

//关闭蓝牙收号
function stopReceivingBeacons() {
  wx.stopBeaconDiscovery({
    success: function (res) {
      //console.log("关闭蓝牙收号", res);
      // clearTimeout(kaiqi);
    }
  })
}


//开始搜索附近的iBeacon并获取收到的更新数据
function startBeaconDiscovery() {
  var that = this;
  wx.startBeaconDiscovery({
    uuids: ['e2c56db5-dffb-48d2-b060-d0f5a71096e0', 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0', 'fda50693-a4e2-4fb1-afcf-c6eb07647825', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825'],
    success: function (res) {

      //监听 iBeacon 设备更新事件
      wx.onBeaconUpdate(function (res) {
        //console.log("返回beacons：", res.beacons);
        if (res && res.beacons) {

          var devices = res.beacons;
          if (app.globalData.platformType == "ios") {
            devices = format(res.beacons);
            devices.splice(4, devices.length - 1);// 取前五个数据发送给连续定位
            onfire.fire('arroundBeaconsOnfire', devices);
            var oldDevices = devices;
            console.log("排序后的beacons:", oldDevices)
            if (oldDevices.length > 0) {
              var firstBeacon = oldDevices[0];
              pipeBeaconForFive(firstBeacon);
            }
          } else {
            devices = formats(res.beacons);
            devices.splice(4, devices.length - 1);// 取前五个数据发送给连续定位
            onfire.fire('arroundBeaconsOnfire', devices);
            var oldDevices = devices;
            console.log("排序后的beacons:", oldDevices)
            if (oldDevices.length > 0) {
              var firstBeacon = oldDevices[0];
              pipeBeacon(firstBeacon);
            }
          }

        }
      });
    },
    fail: function (res) {
      //console.log("失败：", res.errMsg, res.errCode);
      if (res.errCode == 11001) {//蓝牙服务不可用
        wx.showModal({
          title: '提示',
          content: "请开启手机蓝牙及位置。",
          showCancel: false,
          confirmText: '我知道了',
          success: function (res) {
            if (res.confirm) { }
          }
        })
      } else if (res.errCode == 11003) {//已经开始搜索

      } else {

      }
    }
  })
}

//accuracy
function formats(data) {
  var that = this;
  var newDatas = [];
  var acc = 3.0;
  if (app.globalData.platformType == "ios") {
    acc = 1.5;
  }
  //console.log("acc:" + acc);

  for (var i = 0; i < data.length; i++) {
    if (data[i].major < 90000 && data[i].accuracy <= acc) {
      newDatas.push(data[i]);
    }
  };
  newDatas = newDatas.sort(pauxi("accuracy"));
  return newDatas
}

//rssi
function format(data) {
  var that = this;
  var newDatas = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].rssi !== 0 && data[i].accuracy > 0 && data[i].major && data[i].rssi > -70) {
      var newDataObj = {};
      newDataObj.major = data[i].major;
      newDataObj.rssi = data[i].rssi;
      newDataObj.accuracy = data[i].accuracy;
      newDatas.push(newDataObj);
    }
  };
  newDatas = newDatas.sort(pauxi1("rssi"));
  // newDatas.sort(function(a, b) {
  //   return Number(a.accuracy) > Number(b.accuracy)
  // });
  return newDatas
}

function pauxi(property) {
  return function (obj1, obj2) {
    var value1 = obj1[property];
    var value2 = obj2[property];
    return value1 - value2;     // 升序
  }
}

function pauxi1(property) {
  return function (obj1, obj2) {
    var value1 = obj1[property];
    var value2 = obj2[property];
    return value2 - value1;     // 升序
  }
}

//管道流3取2触发
function pipeBeacon(e) {
  var that = this;
  var major = e.major;
  beaconArray.push(major);//添加到原数组末尾
  // //console.log("beaconArray:", that.data.beaconArray)
  if (beaconArray.length > 3) {
    beaconArray.shift();//删除第一项
    //console.log("beaconArray123:", beaconArray)
    for (var i = 0; i < beaconArray.length - 1; i++) {
      if (e.major == beaconArray[i]) {
        //console.log("autoNum:", e.major, e.accuracy, e.rssi)
        // that.autoGuide(e.major);
        onfire.fire('beaconOnfire', e.major);
      }
    };
  }
}

//管道流5取3触发
function pipeBeaconForFive(e) {
  var that = this;
  var major = e.major;
  beaconArray.push(major);//添加到原数组末尾
  // //console.log("beaconArray:", that.data.beaconArray)
  if (beaconArray.length > 5) {
    beaconArray.shift();//删除第一项
    //console.log("beaconArray123:", beaconArray)
    var count = 0;
    for (var i = 0; i < beaconArray.length; i++) {
      if (e.major == beaconArray[i]) {
        count++;
        if (count == 3) {
          //console.log("autoNum:", e.major, e.accuracy, e.rssi)
          // that.autoGuide(e.major);
          onfire.fire('beaconOnfire', e.major);
        }
      }
    };
  }
}

