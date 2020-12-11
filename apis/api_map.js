const api = require('./request.js')
module.exports = {
  // 地图列表
  getMapList: (museum_id) => api.request('/api/map/map_list', 'get', {
    p: 'wxmini',
    museum_id: museum_id
  }),

  getMapDetail: (mapId) => api.request('/api/road/map_detail', 'get', {
    p: 'wx',
    language:'1',
    map_id:mapId
  }),

  getServiceList: (cateId) => api.request('/api/road/service_list', 'get', {
    p: 'wx',
    cate_id:cateId
  },false,false),

  getMapExhibitDetail:(language,floor) => api.request('/api/road/map_exhibit', 'get', {
    p: 'wx',
    language:language,
    floor:floor
  }),

  getMapRoadInfo:() => api.request('/api/road/info', 'get', {
    p: 'wx',
    language:"1",
  }),

  getAutonumFloor:(autonum) => api.request('/api/road/auto_to_floor', 'get', {
    p: 'wx',
    autonum:autonum,
  },false, false,false),

  getNearbyExhibit:(autonumList) => api.request('/api/road/nearby_exhibit', 'get', {
    p: 'wx',
    'auto_num_list':autonumList,
  }),

  getExhibitPosition:(id) => api.request('/api/exhibit/exhibit_position', 'get', {
    p: 'wx',
    'exhibit_id':id,
    'language':1,
  }),

}


