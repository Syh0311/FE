// https://www.jianshu.com/p/b765d526ae6d

//根据经纬度生成点阵
const pointInPolygon = require("point-in-polygon"); //判断点是否在多边形内
//polygon是多边形轮廓的数据
function girlPoint(polygon) {
  var lonArr = []; //polygon所有的经度坐标
  var latArr = []; //polygon所有的维度坐标
  polygon.forEach((elem) => {
    lonArr.push(elem[0]);
    latArr.push(elem[1]);
  });
  const [lonMin, logMax] = minMax(lonArr);
  const [latMin, latMax] = minMax(latArr);

  // 经纬度极小值和极大值构成一个矩形范围，可以包裹多边形polygon，在矩形范围内生成等间距顶点
  const interval = 1; //polygon轮廓内填充顶点的经纬度间隔距离，选择一个合适的值，太小，计算量大，太大，国家球面不够光滑
  const row = Math.ceil((logMax - lonMin) / interval);
  const col = Math.ceil((latMax - latMin) / interval);
  var rectPointsArr = []; //polygon对应的矩形轮廓内生成均匀间隔的矩形网格数据rectPointsArr
  for (var i = 0; i < row + 1; i++) {
    for (var j = 0; j < col + 1; j++) {
      //两层for循环在矩形范围内批量生成等间距的网格顶点数据
      rectPointsArr.push([lonMin + i * interval, latMin + j * interval]);
    }
  }
  const pointArr = [];
  rectPointsArr.forEach((elem) => {
    // 判断点是否在多边形内
    if (pointInPolygon(elem, polygon)) {
      pointArr.push(elem);
    }
  });

  return [...polygon, ...pointArr]; //返回多边形边界和内部的点
}
// 经纬度坐标排序
function minMax(arr) {
  arr.sort(compareNum);
  return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])];
}

function compareNum(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

export { girlPoint };

// 三角剖分
import Delaunator from "delaunator"; //三角剖分
const pointInPolygon = require("point-in-polygon"); //判断点是否在多边形内
//第一个参数标识多边形轮廓上的点以及内部的等边距的点集
//第二个参数标识多边形轮廓上的点
function delaunay(polygonPointsArr, polygonData) {
  // 三角剖分
  const indexArr = Delaunator.from(polygonPointsArr).triangles; //.from(pointsArr).triangles：平面上一系列点集三角剖分，并获取三角形索引值
  /**三角剖分获得的三角形索引indexArr需要进行二次处理，删除多边形polygon轮廓外面的三角形对应索引 */
  var usefulIndexArr = []; //二次处理后三角形索引，也就是保留多边形polygon内部三角形对应的索引
  for (let i = 0; i < indexArr.length; i += 3) {
    const point1 = polygonPointsArr[indexArr[i]];
    const point2 = polygonPointsArr[indexArr[i + 1]];
    const point3 = polygonPointsArr[indexArr[i + 2]];
    // 三角形重心计算
    const triangleCenter = [(point1[0] + point2[0] + point3[0]) / 3, (point1[1] + point2[1] + point3[1]) / 3];
    if (pointInPolygon(triangleCenter, polygonData)) {
      //判断三角形的重心是在多边形polygon内
      // 保留复合条件三角形对应的索引：indexArr[i], indexArr[i+1],indexArr[i+2]
      usefulIndexArr.push(indexArr[i], indexArr[i + 1], indexArr[i + 2]); //这种情况需要设置three.js材质背面可见THREE.BackSide才能看到球面国家Mesh
    }
  }
  return usefulIndexArr;
}

export { delaunay };

const polygonPointsArr = girlPoint(polygonData); //多边形边界的点以及内部的点
const usefulIndexArr = delaunay(polygonPointsArr, polygonData); //三角剖分
const posArr = []; //顶点坐标
polygonPointsArr.forEach((elem) => {
  posArr.push(elem[0], elem[1], 0);
});

const geometry = new BufferGeometry();
geometry.index = new BufferAttribute(new Uint16Array(usefulIndexArr), 1); //设置几何体的索引
geometry.attributes.position = new BufferAttribute(new Float32Array(posArr), 3); //设置几何体的顶点坐标
var material = new MeshBasicMaterial({
  color: 0x004444,
  // side: DoubleSide, //背面可见，默认正面可见   THREE.DoubleSide：双面可见
});
// geometry.computeVertexNormals();//如果使用受光照影响材质，需要计算生成法线
var mesh = new Mesh(geometry, material);
mesh.position.z = -0.01;
const tGroup = new Group();
tGroup.add(mesh);
const mesh2 = mesh.clone();
mesh2.material = new MeshBasicMaterial({
  wireframe: true,
  color: 0x009999,
});
mesh2.position.z = -0.02;
tGroup.add(mesh2);
