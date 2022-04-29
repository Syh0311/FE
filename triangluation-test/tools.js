function drawPaths(border1, border2) {
  // border1  border2是对应好的边界
  const arr = [];
  for (let i = 0; i < border1.length; i++) {
    if (i < border1.length - 1) {
      arr.push(...border1[i]);
      arr.push(...border2[i]);
      arr.push(...border2[i + 1]);

      arr.push(...border2[i + 1]);
      arr.push(...border1[i]);
      arr.push(...border1[i + 1]);
    } else {
      arr.push(...border1[i]);
      arr.push(...border2[i]);
      arr.push(...border2[0]);

      arr.push(...border2[0]);
      arr.push(...border1[i]);
      arr.push(...border1[0]);
    }
  }
  return arr;
}
function drawPaths2(border1, border2) {
  // border1  border2是对应好的边界
  const arr = [];
  for (let i = 0; i < border1.length; i++) {
    if (i < border1.length - 1) {
      arr.push(...getXYZ(border1[i]));
      arr.push(...getXYZ(border2[i]));
      arr.push(...getXYZ(border2[i + 1]));

      arr.push(...getXYZ(border2[i + 1]));
      arr.push(...getXYZ(border1[i]));
      arr.push(...getXYZ(border1[i + 1]));
    } else {
      arr.push(...getXYZ(border1[i]));
      arr.push(...getXYZ(border2[i]));
      arr.push(...getXYZ(border2[0]));

      arr.push(...getXYZ(border2[0]));
      arr.push(...getXYZ(border1[i]));
      arr.push(...getXYZ(border1[0]));
    }
  }
  function getXYZ(point) {
    return [point.x, point.y, point.z];
  }
  return arr;
}
function findDoundaryDepth(points, boundary) {
  const result = [];
  for (let item of boundary) {
    const theItem = points.filter((el) => el.x == item.x && el.z == item.z)[0];
    result.push(theItem);
  }
  return result;
}

function mockBoundary() {
  const arr = [];
  for (let i = 0; i < 20; i++) {
    arr.push(new THREE.Vector3(-50, 40, 5 * i - 50));
  }
  for (let i = 0; i < 20; i++) {
    arr.push(new THREE.Vector3(5 * i - 50, 40, 50));
  }
  for (let i = 0; i < 20; i++) {
    arr.push(new THREE.Vector3(50, 40, 50 - 5 * i));
  }
  for (let i = 0; i < 20; i++) {
    arr.push(new THREE.Vector3(50 - 5 * i, 40, -50));
  }
  return arr;
}
function addLayer(layer, color, opacity) {
  opacity = opacity || 1;

  const geom = new THREE.BufferGeometry().setFromPoints(layer);
  const tempArr = layer.map((v) => {
    return [v.x, v.z];
  });
  const indexDelaunay = Delaunator.from(tempArr);

  const meshIndex = [...indexDelaunay.triangles];

  geom.setIndex(meshIndex); // add three.js index to the existing geometry
  geom.computeVertexNormals();

  const material = new THREE.MeshLambertMaterial({
    color,
    wireframe: false,
    side: THREE.DoubleSide,
    transparent: true, // transparent设置为true，开启透明，否则opacity不起作用
    opacity, // 设置材质透明度
  });
  const mesh = new THREE.Mesh(geom, material);
  return mesh;
}
function addBoundaryMesh(boundary, layer1, layer2, color) {
  // let options = options || {
  //   color: "red",
  //   wireframe: false,
  //   side: THREE.DoubleSide,
  //   transparent: true, // transparent设置为true，开启透明，否则opacity不起作用
  //   opacity: 0.4, // 设置材质透明度
  // };
  const border1 = findDoundaryDepth(layer1, boundary);
  const border2 = findDoundaryDepth(layer2, boundary);
  const arr = drawPaths2(border1, border2);
  console.log("%c [ arr ]-112", "font-size:13px; background:pink; color:#bf2c9f;", arr);
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(arr);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.MeshBasicMaterial({
    color,
    wireframe: false,
    side: THREE.DoubleSide,
    transparent: true, // transparent设置为true，开启透明，否则opacity不起作用
    opacity: 0.4, // 设置材质透明度
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
export { drawPaths, findDoundaryDepth, mockBoundary, addLayer, addBoundaryMesh };
