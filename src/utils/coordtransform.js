
const pi = 3.1415926535897932384626
const ee = 0.00669342162296594323
const a = 6378245.0
const x_pi = 3.14159265358979324 * 3000.0 / 180.0
function bd09mctobd09(x, y) {
  /**
   * Convert coordinates from BD09MC to BD09
   *
   * Parameters
   * -------
   * x : Array or number
   *     x coordinates
   * y : Array or number
   *     y coordinates
   *
   * return
   * -------
   * lng : Array or number
   *     Longitude (Converted)
   * lat : Array or number
   *     Latitude (Converted)
   */

  const MCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
  const MC2LL = [
      [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331,
       200.9824383106796, -187.2403703815547, 91.6087516669843,
       -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2],
      [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289,
       96.32687599759846, -1.85204757529826, -59.36935905485877,
       47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86],
      [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616,
       59.74293618442277, 7.357984074871, -25.38371002664745,
       13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37],
      [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591,
       40.31678527705744, 0.65659298677277, -4.44255534477492,
       0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06],
      [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062,
       23.10934304144901, -0.00023663490511, -0.6321817810242,
       -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4],
      [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8,
       7.47137025468032, -0.00000353937994, -0.02145144861037,
       -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5]
  ];

  let y1 = Array.isArray(y) ? y[0] : y;

  let cE;
  for (let cD = 0; cD < MCBAND.length; cD++) {
      if (y1 >= MCBAND[cD]) {
          cE = MC2LL[cD];
          break;
      }
  }

  const T = cE[0] + cE[1] * Math.abs(x);
  const cB = Math.abs(y) / cE[9];
  const lng = T;
  const lat = cE[2] + cE[3] * cB + cE[4] * cB * cB +
      cE[5] * cB * cB * cB + cE[6] * cB * cB * cB * cB +
      cE[7] * cB * cB * cB * cB * cB +
      cE[8] * cB * cB * cB * cB * cB * cB;

  return [lng,lat];
}

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

export { bd09towgs84,bd09mctobd09 }