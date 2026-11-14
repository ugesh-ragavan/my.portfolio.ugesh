import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

(() => {
  "use strict";

  // Renderer
  const canvas = document.querySelector("#scene");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x79bfb8);
  scene.fog = new THREE.Fog(0x79bfb8, 45, 90);

  // Camera
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 220);
  camera.position.set(21, 8, 30);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 18;
  controls.maxDistance = 58;
  controls.minPolarAngle = THREE.MathUtils.degToRad(18);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(83);
  controls.target.set(0, 0, 0);
  controls.update();

  // Lighting
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x326761, 2.2);
  scene.add(hemisphereLight);

  const sun = new THREE.DirectionalLight(0xffffff, 3.2);
  sun.position.set(-15, 26, 17);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -30;
  sun.shadow.camera.right = 30;
  sun.shadow.camera.top = 30;
  sun.shadow.camera.bottom = -30;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 80;
  sun.shadow.bias = -0.0002;
  scene.add(sun);

  // Materials
  const waterMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x399b92,
    roughness: 0.3,
    metalness: 0.02,
    clearcoat: 0.45,
    clearcoatRoughness: 0.38,
    side: THREE.DoubleSide
  });
  const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xf7f5e9, roughness: 0.55 });
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x263332, roughness: 0.65 });
  const boatMaterial = new THREE.MeshStandardMaterial({ color: 0xe49a38, roughness: 0.5 });
  const boatDarkMaterial = new THREE.MeshStandardMaterial({ color: 0x7c3f2d, roughness: 0.62 });
  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0xac572e, roughness: 0.62 });
  const oarMaterial = new THREE.MeshStandardMaterial({ color: 0xf38b32, roughness: 0.5 });
  const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x3977bd, roughness: 0.72 });
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x654677, roughness: 0.75 });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xe9aa73, roughness: 0.72 });
  const hatMaterial = new THREE.MeshStandardMaterial({ color: 0xe5c642, roughness: 0.7 });
  const hatDarkMaterial = new THREE.MeshStandardMaterial({ color: 0xc8a62c, roughness: 0.72 });
  const lilyMaterial1 = new THREE.MeshStandardMaterial({ color: 0x67a845, roughness: 0.75 });
  const lilyMaterial2 = new THREE.MeshStandardMaterial({ color: 0x8faa41, roughness: 0.75 });
  const lilySideMaterial = new THREE.MeshStandardMaterial({ color: 0x39783d, roughness: 0.8 });
  const yellowMaterial = new THREE.MeshStandardMaterial({ color: 0xf3ca24, roughness: 0.7 });

  // Helpers
  function addShadows(object) {
    object.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });
    return object;
  }

  function createJoint(radius, material) {
    const joint = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), material);
    joint.castShadow = true;
    return joint;
  }

  function createBone(length, radius, material) {
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 14);
    geometry.translate(0, -length / 2, 0);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
  }

  const boneDown = new THREE.Vector3(0, -1, 0);

  function solveTwoBoneJoint(start, end, upperLength, lowerLength, bendHint) {
    const target = new THREE.Vector3().subVectors(end, start);
    const originalDistance = target.length();

    if (originalDistance < 0.0001) {
      return start.clone().add(new THREE.Vector3(0, -upperLength, 0));
    }

    const minDistance = Math.abs(upperLength - lowerLength) + 0.001;
    const maxDistance = upperLength + lowerLength - 0.001;
    const distance = THREE.MathUtils.clamp(originalDistance, minDistance, maxDistance);
    const direction = target.normalize();

    const along =
      (upperLength * upperLength - lowerLength * lowerLength + distance * distance) /
      (2 * distance);

    const height = Math.sqrt(Math.max(upperLength * upperLength - along * along, 0));
    const perpendicular = bendHint
      .clone()
      .sub(direction.clone().multiplyScalar(bendHint.dot(direction)));

    if (perpendicular.lengthSq() < 0.0001) perpendicular.set(1, 0, 0);
    perpendicular.normalize();

    return start
      .clone()
      .addScaledVector(direction, along)
      .addScaledVector(perpendicular, height);
  }

  // Water
  const WATER_SIZE = 180;
  const waterGeometry = new THREE.PlaneGeometry(WATER_SIZE, WATER_SIZE, 120, 120);
  waterGeometry.rotateX(-Math.PI / 2);

  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.receiveShadow = true;
  scene.add(water);

  const waterPositions = waterGeometry.attributes.position;
  const waterBase = new Float32Array(waterPositions.count * 2);

  for (let i = 0; i < waterPositions.count; i++) {
    waterBase[i * 2] = waterPositions.getX(i);
    waterBase[i * 2 + 1] = waterPositions.getZ(i);
  }

  function getWaveHeight(x, z, time) {
    const wave1 = Math.sin(x * 0.48 + time * 0.9) * 0.12;
    const wave2 = Math.sin(z * 0.41 - time * 0.7) * 0.08;
    const wave3 = Math.sin(x * 0.63 + z * 0.54 + time * 1.15) * 0.05;
    const wave4 = Math.sin(x * 0.2 - z * 0.32 + time * 0.45) * 0.04;
    return wave1 + wave2 + wave3 + wave4;
  }

  let waterNormalFrame = 0;

  function updateWater(time) {
    for (let i = 0; i < waterPositions.count; i++) {
      const x = waterBase[i * 2];
      const z = waterBase[i * 2 + 1];
      waterPositions.setY(i, getWaveHeight(x, z, time));
    }

    waterPositions.needsUpdate = true;
    waterNormalFrame++;

    if (waterNormalFrame % 2 === 0) waterGeometry.computeVertexNormals();
  }

  // Boat
  function createBoatShape(scale = 1) {
    const shape = new THREE.Shape();
    const s = scale;

    shape.moveTo(0, 2.9 * s);
    shape.bezierCurveTo(1.02 * s, 2.58 * s, 1.34 * s, 1.22 * s, 1.24 * s, -1.72 * s);
    shape.quadraticCurveTo(1.16 * s, -2.32 * s, 0.78 * s, -2.63 * s);
    shape.lineTo(-0.78 * s, -2.63 * s);
    shape.quadraticCurveTo(-1.16 * s, -2.32 * s, -1.24 * s, -1.72 * s);
    shape.bezierCurveTo(-1.34 * s, 1.22 * s, -1.02 * s, 2.58 * s, 0, 2.9 * s);
    shape.closePath();

    return shape;
  }

  function createBoatHull(scale, depth, material, y) {
    const geometry = new THREE.ExtrudeGeometry(createBoatShape(scale), {
      depth,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.1,
      bevelThickness: 0.08,
      curveSegments: 16
    });

    geometry.rotateX(Math.PI / 2);
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    addShadows(mesh);
    return mesh;
  }

  const boatRoot = new THREE.Group();
  scene.add(boatRoot);

  const boatFloat = new THREE.Group();
  boatRoot.add(boatFloat);

  const boatShell = new THREE.Group();
  boatShell.rotation.y = Math.PI;
  boatFloat.add(boatShell);

  const outerHull = createBoatHull(1.06, 0.58, whiteMaterial, 0.52);
  const hull = createBoatHull(1, 0.51, boatMaterial, 0.55);
  boatShell.add(outerHull, hull);

  const floorGeometry = new THREE.ShapeGeometry(createBoatShape(0.7), 16);
  floorGeometry.rotateX(Math.PI / 2);

  const floor = new THREE.Mesh(floorGeometry, boatDarkMaterial);
  floor.material.side = THREE.DoubleSide;
  floor.position.y = 0.59;
  floor.receiveShadow = true;
  boatShell.add(floor);

  // Planks
  const FLOOR_Y = 0.59;
  const PLANK_HEIGHT = 0.12;
  const SEAT_PLANK_HEIGHT = 0.2;
  const SEAT_PLANK_Z = -0.25;
  const REAR_PLANK_Z = 1.55;

  function createBench(z, width = 1.9, height = PLANK_HEIGHT) {
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 0.36),
      woodMaterial
    );

    bench.position.set(0, FLOOR_Y + height / 2, z);
    bench.castShadow = true;
    bench.receiveShadow = true;
    boatFloat.add(bench);
    return bench;
  }

  createBench(SEAT_PLANK_Z, 1.9, SEAT_PLANK_HEIGHT);
  createBench(REAR_PLANK_Z, 1.72, PLANK_HEIGHT);

  const bowBoard = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, PLANK_HEIGHT, 0.35),
    woodMaterial
  );

  bowBoard.position.set(0, FLOOR_Y + PLANK_HEIGHT / 2, -1.95);
  bowBoard.rotation.y = THREE.MathUtils.degToRad(2);
  bowBoard.castShadow = true;
  bowBoard.receiveShadow = true;
  boatFloat.add(bowBoard);

  // Oars
  const OAR_OUTER_LENGTH = 3.25;
  const OAR_HANDLE_LENGTH = 0.42;
  const OAR_HANDLE_PAST_HAND = 0.08;
  const OAR_PIVOT_X = 1.03;
  const OAR_PIVOT_Y = 1.02;
  const OAR_PIVOT_Z = 0.58;
  const ROWLOCK_RADIUS = 0.11;

  function createOarSupport(side) {
    const supportTop = OAR_PIVOT_Y - ROWLOCK_RADIUS;
    const supportHeight = supportTop - FLOOR_Y;

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.065, supportHeight, 12),
      woodMaterial
    );

    post.position.set(
      side * OAR_PIVOT_X,
      FLOOR_Y + supportHeight / 2,
      OAR_PIVOT_Z
    );

    post.castShadow = true;
    post.receiveShadow = true;
    boatFloat.add(post);
  }

  function createOar(side) {
    const oar = new THREE.Group();
    oar.position.set(side * OAR_PIVOT_X, OAR_PIVOT_Y, OAR_PIVOT_Z);
    boatFloat.add(oar);

    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.06, OAR_OUTER_LENGTH, 12),
      oarMaterial
    );

    shaft.rotation.z = Math.PI / 2;
    shaft.position.x = side * OAR_OUTER_LENGTH / 2;
    shaft.castShadow = true;
    oar.add(shaft);

    const blade = new THREE.Mesh(
      new THREE.SphereGeometry(1, 18, 12),
      oarMaterial
    );

    blade.scale.set(0.54, 0.25, 0.07);
    blade.position.x = side * (OAR_OUTER_LENGTH + 0.36);
    blade.castShadow = true;
    oar.add(blade);

    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, OAR_HANDLE_LENGTH, 12),
      woodMaterial
    );

    handle.rotation.z = Math.PI / 2;
    handle.position.x = -side * OAR_HANDLE_LENGTH / 2;
    handle.castShadow = true;
    oar.add(handle);

    const handlePoint = new THREE.Object3D();
    handlePoint.position.x = -side * (OAR_HANDLE_LENGTH - OAR_HANDLE_PAST_HAND);
    oar.add(handlePoint);

    const bladePoint = new THREE.Object3D();
    bladePoint.position.x = side * (OAR_OUTER_LENGTH + 0.36);
    oar.add(bladePoint);

    const rowlock = new THREE.Mesh(
      new THREE.CylinderGeometry(ROWLOCK_RADIUS, ROWLOCK_RADIUS, 0.2, 16),
      shirtMaterial
    );

    rowlock.rotation.z = Math.PI / 2;
    rowlock.castShadow = true;
    oar.add(rowlock);

    return {
      group: oar,
      handlePoint,
      bladePoint,
      rippleTimer: 0,
      side
    };
  }

  createOarSupport(-1);
  createOarSupport(1);

  const leftOar = createOar(-1);
  const rightOar = createOar(1);

  // Person
  const rower = new THREE.Group();
  rower.position.set(0, 0, SEAT_PLANK_Z);
  boatFloat.add(rower);

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.285, 0.3, 0.58, 18),
    shirtMaterial
  );

  torso.position.set(0, 1.4, 0);
  torso.castShadow = true;
  rower.add(torso);

  const hips = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 20, 16),
    pantsMaterial
  );

  hips.scale.set(1, 0.64, 0.88);
  hips.position.set(0, 0.995, 0.08);
  hips.castShadow = true;
  rower.add(hips);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.16, 12),
    skinMaterial
  );

  neck.position.y = 1.72;
  rower.add(neck);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.31, 20, 16),
    skinMaterial
  );

  head.position.y = 1.94;
  head.castShadow = true;
  rower.add(head);

  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 12, 8),
    skinMaterial
  );

  nose.position.set(0, 1.93, 0.29);
  nose.scale.z = 1.3;
  rower.add(nose);

  // Eyes
  const eyes = [];

  function createEye(x) {
    const eye = new THREE.Group();

    const white = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 14, 10),
      whiteMaterial
    );

    white.scale.set(1, 1.1, 0.45);
    eye.add(white);

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.031, 12, 8),
      eyeMaterial
    );

    pupil.position.z = 0.027;
    pupil.scale.z = 0.4;
    eye.add(pupil);

    eye.position.set(x, 2.02, 0.285);
    rower.add(eye);
    eyes.push(eye);
  }

  createEye(-0.105);
  createEye(0.105);

  // Hat
  const hatBrim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 0.065, 28),
    hatMaterial
  );

  hatBrim.position.y = 2.17;
  hatBrim.castShadow = true;
  rower.add(hatBrim);

  const hatTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.32, 0.22, 24),
    hatMaterial
  );

  hatTop.position.y = 2.29;
  hatTop.castShadow = true;
  rower.add(hatTop);

  const hatBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.325, 0.325, 0.07, 24),
    hatDarkMaterial
  );

  hatBand.position.y = 2.21;
  rower.add(hatBand);

  // Arms
  const UPPER_ARM_LENGTH = 0.6;
  const LOWER_ARM_LENGTH = 0.6;

  function createArm(side) {
    const shoulderPivot = new THREE.Group();

    const shoulderJoint = createJoint(0.12, shirtMaterial);
    shoulderPivot.add(shoulderJoint);

    const upperArm = createBone(UPPER_ARM_LENGTH, 0.082, skinMaterial);
    shoulderPivot.add(upperArm);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, -UPPER_ARM_LENGTH, 0);
    shoulderPivot.add(elbowPivot);

    const elbowJoint = createJoint(0.1, skinMaterial);
    elbowPivot.add(elbowJoint);

    const lowerArm = createBone(LOWER_ARM_LENGTH, 0.078, skinMaterial);
    elbowPivot.add(lowerArm);

    const hand = createJoint(0.1, skinMaterial);
    hand.position.set(0, -LOWER_ARM_LENGTH, 0);
    elbowPivot.add(hand);

    rower.add(shoulderPivot);

    return {
      side,
      shoulderPivot,
      elbowPivot
    };
  }

  const arms = [createArm(-1), createArm(1)];
  const armWorldPosition = new THREE.Vector3();
  const inverseShoulder = new THREE.Quaternion();

  function updateArms() {
    boatRoot.updateMatrixWorld(true);

    arms.forEach((arm) => {
      const oar = arm.side < 0 ? leftOar : rightOar;
      oar.handlePoint.getWorldPosition(armWorldPosition);

      const handTarget = rower.worldToLocal(armWorldPosition.clone());
      const shoulder = new THREE.Vector3(arm.side * 0.29, 1.49, 0.03);
      const bendHint = new THREE.Vector3(arm.side * 0.05, -0.2, -1);

      const elbow = solveTwoBoneJoint(
        shoulder,
        handTarget,
        UPPER_ARM_LENGTH,
        LOWER_ARM_LENGTH,
        bendHint
      );

      const upperDirection = new THREE.Vector3()
        .subVectors(elbow, shoulder)
        .normalize();

      arm.shoulderPivot.position.copy(shoulder);
      arm.shoulderPivot.quaternion.setFromUnitVectors(boneDown, upperDirection);

      const lowerDirection = new THREE.Vector3()
        .subVectors(handTarget, elbow)
        .normalize();

      inverseShoulder.copy(arm.shoulderPivot.quaternion).invert();

      const lowerLocal = lowerDirection
        .clone()
        .applyQuaternion(inverseShoulder);

      arm.elbowPivot.quaternion.setFromUnitVectors(boneDown, lowerLocal);
    });
  }

  // Legs
  const THIGH_LENGTH = 0.58;
  const SHIN_LENGTH = 0.6;

  function createLeg(side) {
    const hipPivot = new THREE.Group();

    const hipJoint = createJoint(0.11, pantsMaterial);
    hipPivot.add(hipJoint);

    const thigh = createBone(THIGH_LENGTH, 0.105, pantsMaterial);
    hipPivot.add(thigh);

    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -THIGH_LENGTH, 0);
    hipPivot.add(kneePivot);

    const kneeJoint = createJoint(0.11, pantsMaterial);
    kneePivot.add(kneeJoint);

    const shin = createBone(SHIN_LENGTH, 0.095, pantsMaterial);
    kneePivot.add(shin);

    const ankleJoint = createJoint(0.08, pantsMaterial);
    ankleJoint.position.set(0, -SHIN_LENGTH, 0);
    kneePivot.add(ankleJoint);

    const foot = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 14, 10),
      pantsMaterial
    );

    foot.scale.set(0.82, 0.65, 1.45);
    foot.castShadow = true;

    rower.add(hipPivot, foot);

    return {
      side,
      hipPivot,
      kneePivot,
      foot
    };
  }

  const legs = [createLeg(-1), createLeg(1)];
  const inverseHip = new THREE.Quaternion();

  function updateLegs() {
    legs.forEach((leg) => {
      const hip = new THREE.Vector3(leg.side * 0.17, 0.94, 0.12);
      const ankle = new THREE.Vector3(leg.side * 0.22, 0.79, 0.98);
      const bendHint = new THREE.Vector3(leg.side * 0.05, 1, 0.18);

      const knee = solveTwoBoneJoint(
        hip,
        ankle,
        THIGH_LENGTH,
        SHIN_LENGTH,
        bendHint
      );

      const thighDirection = new THREE.Vector3()
        .subVectors(knee, hip)
        .normalize();

      leg.hipPivot.position.copy(hip);
      leg.hipPivot.quaternion.setFromUnitVectors(boneDown, thighDirection);

      const shinDirection = new THREE.Vector3()
        .subVectors(ankle, knee)
        .normalize();

      inverseHip.copy(leg.hipPivot.quaternion).invert();

      const shinLocal = shinDirection
        .clone()
        .applyQuaternion(inverseHip);

      leg.kneePivot.quaternion.setFromUnitVectors(boneDown, shinLocal);

      leg.foot.position.set(ankle.x, 0.68, ankle.z + 0.1);
      leg.foot.rotation.set(THREE.MathUtils.degToRad(-8), 0, 0);
    });
  }

  // Lily pads
  function createLilyGeometry(radius) {
    const shape = new THREE.Shape();
    const gap = THREE.MathUtils.degToRad(42);
    const start = gap / 2;
    const end = Math.PI * 2 - gap / 2;

    shape.moveTo(0, 0);
    shape.lineTo(Math.cos(start) * radius, Math.sin(start) * radius);
    shape.absarc(0, 0, radius, start, end, false);
    shape.lineTo(0, 0);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.07,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      curveSegments: 20
    });

    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }

  // Flowers
  function createFlower(scale = 1) {
    const flower = new THREE.Group();
    const petalGeometry = new THREE.SphereGeometry(0.17, 12, 8);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;

      const petal = new THREE.Mesh(petalGeometry, whiteMaterial);
      petal.scale.set(0.72, 0.22, 1.25);
      petal.position.set(
        Math.sin(angle) * 0.18,
        0,
        Math.cos(angle) * 0.18
      );

      petal.rotation.y = angle;
      petal.castShadow = true;
      flower.add(petal);
    }

    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 14, 10),
      yellowMaterial
    );

    center.scale.y = 0.6;
    center.position.y = 0.04;
    center.castShadow = true;

    flower.add(center);
    flower.scale.setScalar(scale);

    return flower;
  }

  // Random
  function mulberry32(seed) {
    return function () {
      let t = seed += 0x6d2b79f5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const random = mulberry32(1327);
  const lilyPads = [];

  function addLilyPad(x, z, radius, flower = false) {
    const group = new THREE.Group();
    const padMaterial = random() > 0.48 ? lilyMaterial1 : lilyMaterial2;

    const pad = new THREE.Mesh(
      createLilyGeometry(radius),
      [padMaterial, lilySideMaterial]
    );

    pad.castShadow = true;
    pad.receiveShadow = true;
    group.add(pad);

    if (flower) {
      const flowerMesh = createFlower(radius * 0.72);
      flowerMesh.position.y = 0.16;
      flowerMesh.rotation.y = random() * Math.PI * 2;
      group.add(flowerMesh);
    }

    group.position.set(x, 0, z);
    scene.add(group);

    lilyPads.push({
      group,
      home: new THREE.Vector2(x, z),
      velocity: new THREE.Vector2(),
      yaw: random() * Math.PI * 2,
      turnVelocity: 0,
      radius,
      phase: random() * Math.PI * 2
    });
  }

  // Boat route
  function getBoatPosition(angle) {
    return new THREE.Vector3(
      Math.sin(angle) * 8.6,
      0,
      Math.cos(angle) * 13.4
    );
  }

  function getBoatTangent(angle) {
    return new THREE.Vector3(
      Math.cos(angle) * 8.6,
      0,
      -Math.sin(angle) * 13.4
    );
  }

  for (let i = 0; i < 13; i++) {
    const angle = (i / 13) * Math.PI * 2;
    const point = getBoatPosition(angle);
    const offset = random() * 2 - 1;
    const radius = 0.65 + random() * 0.55;

    addLilyPad(
      point.x + Math.cos(angle) * offset,
      point.z + Math.sin(angle) * offset,
      radius,
      random() > 0.58
    );
  }

  for (let i = 0; i < 44; i++) {
    const x = (random() - 0.5) * 66;
    const z = (random() - 0.5) * 66;
    const radius = 0.55 + random() * 0.7;

    addLilyPad(x, z, radius, random() > 0.66);
  }

  // Wake
  const wakeGeometry = new THREE.RingGeometry(0.12, 0.22, 20);
  wakeGeometry.rotateX(-Math.PI / 2);

  const wakes = [];

  for (let i = 0; i < 32; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const wake = new THREE.Mesh(wakeGeometry, material);
    wake.visible = false;
    scene.add(wake);

    wakes.push({
      mesh: wake,
      age: 10
    });
  }

  let wakeIndex = 0;
  let wakeTimer = 0;

  function spawnWake(position, boatForward, time) {
    for (let side = -1; side <= 1; side += 2) {
      const wake = wakes[wakeIndex];
      wakeIndex = (wakeIndex + 1) % wakes.length;

      const wakeRight = new THREE.Vector3(
        boatForward.z,
        0,
        -boatForward.x
      );

      const wakePosition = position
        .clone()
        .addScaledVector(boatForward, -2.15)
        .addScaledVector(wakeRight, side * 0.55);

      wakePosition.x += (random() - 0.5) * 0.2;
      wakePosition.z += (random() - 0.5) * 0.2;

      wake.mesh.position.set(
        wakePosition.x,
        getWaveHeight(wakePosition.x, wakePosition.z, time) + 0.06,
        wakePosition.z
      );

      wake.mesh.scale.set(1, 1, 1);
      wake.mesh.material.opacity = 0.34;
      wake.mesh.visible = true;
      wake.age = 0;
    }
  }

  function updateWake(delta, time) {
    wakes.forEach((wake) => {
      if (!wake.mesh.visible) return;

      wake.age += delta;

      if (wake.age > 2.2) {
        wake.mesh.visible = false;
        return;
      }

      const progress = wake.age / 2.2;
      const scale = 1 + progress * 3.4;

      wake.mesh.scale.set(scale * 1.5, scale, scale * 0.7);
      wake.mesh.material.opacity = 0.34 * (1 - progress);
      wake.mesh.position.y =
        getWaveHeight(wake.mesh.position.x, wake.mesh.position.z, time) + 0.055;
    });
  }

  // Oar ripples
  const oarRippleGeometry = new THREE.RingGeometry(0.08, 0.14, 20);
  oarRippleGeometry.rotateX(-Math.PI / 2);

  const oarRipples = [];

  for (let i = 0; i < 36; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xe1f6ef,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const ripple = new THREE.Mesh(oarRippleGeometry, material);
    ripple.visible = false;
    scene.add(ripple);

    oarRipples.push({
      mesh: ripple,
      age: 10
    });
  }

  let oarRippleIndex = 0;

  function spawnOarRipple(position, side, time) {
    const ripple = oarRipples[oarRippleIndex];
    oarRippleIndex = (oarRippleIndex + 1) % oarRipples.length;

    ripple.mesh.position.set(
      position.x,
      getWaveHeight(position.x, position.z, time) + 0.035,
      position.z
    );

    ripple.mesh.rotation.y = boatRoot.rotation.y + side * 0.18;
    ripple.mesh.scale.set(1.6, 1, 0.7);
    ripple.mesh.material.opacity = 0.55;
    ripple.mesh.visible = true;
    ripple.age = 0;
  }

  function updateOarRipples(delta, time) {
    oarRipples.forEach((ripple) => {
      if (!ripple.mesh.visible) return;

      ripple.age += delta;

      if (ripple.age > 1.1) {
        ripple.mesh.visible = false;
        return;
      }

      const progress = ripple.age / 1.1;
      const scale = 1 + progress * 3.2;

      ripple.mesh.scale.set(scale * 1.6, 1, scale * 0.7);
      ripple.mesh.material.opacity = 0.55 * (1 - progress);
      ripple.mesh.position.y =
        getWaveHeight(ripple.mesh.position.x, ripple.mesh.position.z, time) + 0.035;
    });
  }

  function updateOarWater(delta, time, strokePower) {
    boatRoot.updateMatrixWorld(true);

    [leftOar, rightOar].forEach((oar) => {
      const bladePosition = new THREE.Vector3();
      oar.bladePoint.getWorldPosition(bladePosition);

      const waterHeight = getWaveHeight(
        bladePosition.x,
        bladePosition.z,
        time
      );

      const submerged = bladePosition.y < waterHeight + 0.12;

      if (submerged && strokePower > 0.12) {
        oar.rippleTimer += delta;

        if (oar.rippleTimer > 0.09) {
          oar.rippleTimer = 0;
          spawnOarRipple(bladePosition, oar.side, time);
        }
      } else {
        oar.rippleTimer = 0.09;
      }
    });
  }

  // Boat motion
  let travel = 0.35;

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();

  function updateBoat(delta, time) {
    const rowingPhase = time * 2.15;
    const surge = Math.max(0, Math.sin(rowingPhase + 0.4));
    const travelSpeed = 0.105 + surge * 0.018;

    travel += delta * travelSpeed;

    const position = getBoatPosition(travel);
    const tangent = getBoatTangent(travel).normalize();

    forward.copy(tangent);

    const yaw = Math.atan2(tangent.x, tangent.z);
    right.set(tangent.z, 0, -tangent.x);

    const centerHeight = getWaveHeight(position.x, position.z, time);

    const frontPosition = position.clone().addScaledVector(forward, 1.7);
    const backPosition = position.clone().addScaledVector(forward, -1.7);
    const leftPosition = position.clone().addScaledVector(right, -1.1);
    const rightPosition = position.clone().addScaledVector(right, 1.1);

    const frontHeight = getWaveHeight(frontPosition.x, frontPosition.z, time);
    const backHeight = getWaveHeight(backPosition.x, backPosition.z, time);
    const leftHeight = getWaveHeight(leftPosition.x, leftPosition.z, time);
    const rightHeight = getWaveHeight(rightPosition.x, rightPosition.z, time);

    const pitch = Math.atan2(backHeight - frontHeight, 3.4);
    const roll = Math.atan2(rightHeight - leftHeight, 2.2);

    boatRoot.position.set(position.x, centerHeight + 0.035, position.z);
    boatRoot.rotation.y = yaw + Math.PI;

    boatFloat.rotation.x = pitch * 0.9;
    boatFloat.rotation.z = roll * 0.9;

    const sweep = -Math.sin(rowingPhase) * 0.31;
    const powerValue = Math.max(0, Math.cos(rowingPhase));
    const strokePower = THREE.MathUtils.smoothstep(powerValue, 0, 1);
    const dip = THREE.MathUtils.lerp(0.07, 0.3, strokePower);

    leftOar.group.rotation.y = -sweep;
    rightOar.group.rotation.y = sweep;
    leftOar.group.rotation.z = dip;
    rightOar.group.rotation.z = -dip;

    updateArms();
    updateLegs();
    updateOarWater(delta, time, strokePower);

    wakeTimer += delta;

    if (wakeTimer > 0.24) {
      wakeTimer = 0;
      spawnWake(boatRoot.position, forward, time);
    }
  }

  // Lily pad movement
  function updateLilyPads(delta, time) {
    lilyPads.forEach((lily) => {
      const group = lily.group;
      const dx = group.position.x - boatRoot.position.x;
      const dz = group.position.z - boatRoot.position.z;

      let localX = dx * right.x + dz * right.z;
      let localZ = dx * forward.x + dz * forward.z;

      const warningWidth = 2.35 + lily.radius;
      const warningLength = 5.3 + lily.radius;

      const warningDistance =
        (localX * localX) / (warningWidth * warningWidth) +
        (localZ * localZ) / (warningLength * warningLength);

      if (warningDistance < 1) {
        const amount = 1 - Math.sqrt(Math.max(warningDistance, 0));

        const side =
          Math.abs(localX) > 0.08
            ? Math.sign(localX)
            : Math.sin(lily.phase) > 0
              ? 1
              : -1;

        lily.velocity.x += right.x * side * amount * 8 * delta;
        lily.velocity.y += right.z * side * amount * 8 * delta;

        if (localZ > 0) {
          lily.velocity.x += forward.x * amount * 1.3 * delta;
          lily.velocity.y += forward.z * amount * 1.3 * delta;
        }

        lily.turnVelocity += side * amount * 2.2 * delta;
        lily.turnVelocity = THREE.MathUtils.clamp(lily.turnVelocity, -0.4, 0.4);
      }

      lily.velocity.x += (lily.home.x - group.position.x) * 0.32 * delta;
      lily.velocity.y += (lily.home.y - group.position.z) * 0.32 * delta;

      const damping = Math.exp(-1.35 * delta);
      lily.velocity.multiplyScalar(damping);

      group.position.x += lily.velocity.x * delta;
      group.position.z += lily.velocity.y * delta;

      const newDx = group.position.x - boatRoot.position.x;
      const newDz = group.position.z - boatRoot.position.z;

      localX = newDx * right.x + newDz * right.z;
      localZ = newDx * forward.x + newDz * forward.z;

      const hardWidth = 1.45 + lily.radius;
      const hardLength = 3.35 + lily.radius;

      let hardDistance =
        (localX * localX) / (hardWidth * hardWidth) +
        (localZ * localZ) / (hardLength * hardLength);

      if (hardDistance < 1) {
        if (Math.abs(localX) < 0.001 && Math.abs(localZ) < 0.001) {
          localX = Math.sin(lily.phase) > 0 ? 0.01 : -0.01;
          hardDistance = (localX * localX) / (hardWidth * hardWidth);
        }

        const scale = 1 / Math.sqrt(hardDistance);
        localX *= scale;
        localZ *= scale;

        group.position.x =
          boatRoot.position.x +
          right.x * localX +
          forward.x * localZ;

        group.position.z =
          boatRoot.position.z +
          right.z * localX +
          forward.z * localZ;

        const side = Math.abs(localX) > 0.001 ? Math.sign(localX) : 1;

        lily.velocity.x += right.x * side * 0.8;
        lily.velocity.y += right.z * side * 0.8;

        lily.turnVelocity += side * 0.12;
        lily.turnVelocity = THREE.MathUtils.clamp(lily.turnVelocity, -0.4, 0.4);
      }

      const y = getWaveHeight(group.position.x, group.position.z, time);
      group.position.y = y + 0.055;

      const sample = 0.45;
      const x1 = getWaveHeight(group.position.x - sample, group.position.z, time);
      const x2 = getWaveHeight(group.position.x + sample, group.position.z, time);
      const z1 = getWaveHeight(group.position.x, group.position.z - sample, time);
      const z2 = getWaveHeight(group.position.x, group.position.z + sample, time);

      const tiltX = Math.atan2(z1 - z2, sample * 2);
      const tiltZ = Math.atan2(x2 - x1, sample * 2);

      lily.turnVelocity *= Math.exp(-2.2 * delta);
      lily.yaw += lily.turnVelocity * delta;

      group.rotation.set(
        tiltX * 0.5,
        lily.yaw,
        tiltZ * 0.5,
        "YXZ"
      );
    });
  }

  // Timer
  const timer = new THREE.Timer();
  timer.connect(document);

  // Animation
  function animate() {
    timer.update();

    const delta = Math.min(timer.getDelta(), 0.033);
    const elapsed = timer.getElapsed();

    updateWater(elapsed);
    updateBoat(delta, elapsed);
    updateLilyPads(delta, elapsed);
    updateWake(delta, elapsed);
    updateOarRipples(delta, elapsed);

    controls.update();
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);

  // Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  if (fullscreenButton) {
    const fullscreenSupported =
      document.fullscreenEnabled &&
      typeof document.documentElement.requestFullscreen === "function" &&
      typeof document.exitFullscreen === "function";

    function updateFullscreenButton() {
      const isFullscreen = Boolean(document.fullscreenElement);
      fullscreenButton.classList.toggle("active", isFullscreen);
      fullscreenButton.setAttribute("aria-label", isFullscreen ? "Exit full screen" : "View full screen");
      fullscreenButton.title = isFullscreen ? "Exit full screen" : "View full screen";
    }

    if (fullscreenSupported) {
      fullscreenButton.addEventListener("click", () => {
        const action = document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen();

        action.catch(() => {});
      });

      document.addEventListener("fullscreenchange", updateFullscreenButton);
      updateFullscreenButton();
    } else {
      fullscreenButton.classList.add("unavailable");
      fullscreenButton.setAttribute("aria-disabled", "true");
      fullscreenButton.title = "Click on the refresh button in the Preview to enable the full screen button";
    }
  }
})();