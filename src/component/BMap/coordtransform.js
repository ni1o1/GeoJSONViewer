
const pi = 3.1415926535897932384626
const ee = 0.00669342162296594323
const a = 6378245.0
const x_pi = 3.14159265358979324 * 3000.0 / 180.0
function bd09towgs84(bd_lon, bd_lat) {
  let coord = bd09togcj02(bd_lon, bd_lat)
  const gcj02lon = coord[0]
  const gcj02lat = coord[1]
  const bd09coord = [bd_lon, bd_lat]
  const gcj02coord = [gcj02lon, gcj02lat]
  const wgs84coord = gcj02towgs84(gcj02lon, gcj02lat)
  return {bd09coord,gcj02coord,wgs84coord}
}
function bd09togcj02(bd_lon, bd_lat) {
  const x = bd_lon - 0.0065
  const y = bd_lat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  const gg_lng = z * Math.cos(theta)
  const gg_lat = z * Math.sin(theta)
  return [gg_lng, gg_lat]
}
function gcj02towgs84(lng, lat) {

  let dlat = transformlat(lng - 105.0, lat - 35.0)
  let dlng = transformlng(lng - 105.0, lat - 35.0)
  const radlat = lat / 180.0 * pi
  let magic = Math.sin(radlat)
  magic = 1 - ee * magic * magic
  const sqrtmagic = Math.sqrt(magic)
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi)
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * pi)
  const mglat = lat + dlat
  const mglng = lng + dlng
  return [lng * 2 - mglng, lat * 2 - mglat]
}

function transformlat(lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 *
    Math.sin(2.0 * lng * pi)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * pi) + 40.0 *
    Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * pi) + 320 *
    Math.sin(lat * pi / 30.0)) * 2.0 / 3.0
  return ret
}

function transformlng(lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 *
    Math.sin(2.0 * lng * pi)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * pi) + 40.0 *
    Math.sin(lng / 3.0 * pi)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * pi) + 300.0 *
    Math.sin(lng / 30.0 * pi)) * 2.0 / 3.0
  return ret
}

export { bd09towgs84 }