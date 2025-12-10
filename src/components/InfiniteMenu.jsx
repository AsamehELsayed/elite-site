'use client'
import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { mat4, quat, vec2, vec3 } from 'gl-matrix';
import './InfiniteMenu.css';

const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

#define PI 3.141593

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;
    
    float scale = max(imageAspect / containerAspect, 
                     containerAspect / imageAspect);
    
    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;
    
    // Clamp with vec2 bounds to satisfy GLSL ES 3.0 type requirements
    st = clamp(st, vec2(0.0), vec2(1.0));
    
    st = st * cellSize + cellOffset;
    
    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

class Face {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Vertex {
  constructor(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  constructor() {
    this.vertices = [];
    this.faces = [];
  }

  addVertex(...args) {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  addFace(...args) {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  get lastVertex() {
    return this.vertices[this.vertices.length - 1];
  }

  subdivide(divisions = 1) {
    const midPointCache = {};
    let f = this.faces;

    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array(f.length * 4);

      f.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);

        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });

      f = newFaces;
    }

    this.faces = f;
    return this;
  }

  spherize(radius = 1) {
    this.vertices.forEach(vertex => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  get data() {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData
    };
  }

  get vertexData() {
    return new Float32Array(this.vertices.flatMap(v => Array.from(v.position)));
  }

  get normalData() {
    return new Float32Array(this.vertices.flatMap(v => Array.from(v.normal)));
  }

  get uvData() {
    return new Float32Array(this.vertices.flatMap(v => Array.from(v.uv)));
  }

  get indexData() {
    return new Uint16Array(this.faces.flatMap(f => [f.a, f.b, f.c]));
  }

  getMidPoint(ndxA, ndxB, cache) {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }
    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex((a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5);
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      0,
      0,
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      t,
      0,
      -1,
      t,
      0,
      1,
      -t,
      0,
      -1,
      -t,
      0,
      1
    ).addFace(
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      1,
      5,
      9,
      5,
      11,
      4,
      11,
      10,
      2,
      10,
      7,
      6,
      7,
      1,
      8,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7,
      9,
      8,
      1
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    steps = Math.max(4, steps);

    const alpha = (2 * Math.PI) / steps;

    this.addVertex(0, 0, 0);
    this.lastVertex.uv[0] = 0.5;
    this.lastVertex.uv[1] = 0.5;

    for (let i = 0; i < steps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv[0] = x * 0.5 + 0.5;
      this.lastVertex.uv[1] = y * 0.5 + 0.5;

      if (i > 0) {
        this.addFace(0, i, i + 1);
      }
    }
    this.addFace(0, steps, 1);
  }
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl, shaderSources, transformFeedbackVaryings, attribLocations) {
  const program = gl.createProgram();

  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) gl.attachShader(program, shader);
  });

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
  }

  if (attribLocations) {
    for (const attrib in attribLocations) {
      gl.bindAttribLocation(program, attribLocations[attrib], attrib);
    }
  }

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(gl, bufLocNumElmPairs, indices) {
  const va = gl.createVertexArray();
  gl.bindVertexArray(va);

  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }

  if (indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas) {
  const dpr = Math.min(2, window.devicePixelRatio);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

function makeBuffer(gl, sizeOrData, usage) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(gl, minFilter, magFilter, wrapS, wrapT) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
}

class ArcballControl {
  isScrolling = false;
  orientation = quat.create();
  scrollRotation = quat.create();
  rotationVelocity = 0;
  rotationAxis = vec3.fromValues(1, 0, 0);
  snapDirection = vec3.fromValues(0, 0, -1);
  snapTargetDirection;
  EPSILON = 0.1;
  IDENTITY_QUAT = quat.create();
  
  // Sequential navigation control
  scrollMomentumX = 0;
  scrollMomentumY = 0;
  scrollDecay = 0.97;
  scrollTimeout = null;
  scrollCooldown = false;
  
  // Callbacks for sequential navigation
  onScrollNext = null;
  onScrollPrev = null;
  onBoundaryHit = null;

  constructor(canvas, updateCallback) {
    this.canvas = canvas;
    this.updateCallback = updateCallback || (() => null);

    this._rotationVelocity = 0;
    this._combinedQuat = quat.create();

    // Disable default touch actions
    canvas.style.touchAction = 'none';
    
    // Touch/Swipe variables
    let touchStartY = 0;
    let touchStartX = 0;
    let touchCurrentY = 0;
    let touchCurrentX = 0;
    let isSwiping = false;
    let swipeStartTime = 0;
    
    // Touch event handlers
    canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchCurrentY = touchStartY;
        touchCurrentX = touchStartX;
        isSwiping = true;
        swipeStartTime = Date.now();
      }
    }, { passive: true });
    
    canvas.addEventListener('touchmove', e => {
      if (e.touches.length === 1 && isSwiping) {
        e.preventDefault();
        touchCurrentY = e.touches[0].clientY;
        touchCurrentX = e.touches[0].clientX;
      }
    }, { passive: false });
    
    canvas.addEventListener('touchend', e => {
      if (!isSwiping || this.scrollCooldown) {
        isSwiping = false;
        return;
      }
      
      const deltaY = touchStartY - touchCurrentY;
      const deltaX = touchStartX - touchCurrentX;
      const swipeTime = Date.now() - swipeStartTime;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      // Detect vertical swipe (Y movement > X movement)
      const minSwipeDistance = 50;
      const maxSwipeTime = 1000;
      
      if (absY > absX && absY > minSwipeDistance && swipeTime < maxSwipeTime) {
        if (deltaY > 0) {
          // Swipe up - go to next item
          if (this.onScrollNext) {
            this.onScrollNext();
          }
        } else {
          // Swipe down - go to previous item
          if (this.onScrollPrev) {
            this.onScrollPrev();
          }
        }
        
        this.scrollCooldown = true;
        setTimeout(() => { this.scrollCooldown = false; }, 400);
      }
      
      isSwiping = false;
    }, { passive: true });
    
    canvas.addEventListener('touchcancel', () => {
      isSwiping = false;
    }, { passive: true });
  }
  
  // Method to programmatically set target orientation for an item
  setTargetOrientation(targetQuat) {
    this.snapTargetDirection = vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1), targetQuat);
  }

  update(deltaTime, targetFrameDuration = 16) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    let snapRotation = quat.create();

    // Apply scroll momentum to rotation
    const hasMomentum = Math.abs(this.scrollMomentumX) > 0.0001 || Math.abs(this.scrollMomentumY) > 0.0001;
    
    if (hasMomentum) {
      // Create rotation from scroll momentum - heavy, deliberate motion
      const ANGLE_AMPLIFICATION = 1.2;
      
      // Rotate around Y axis for horizontal scroll, X axis for vertical scroll
      const rotX = quat.create();
      const rotY = quat.create();
      
      quat.setAxisAngle(rotY, [0, 1, 0], -this.scrollMomentumX * ANGLE_AMPLIFICATION);
      quat.setAxisAngle(rotX, [1, 0, 0], this.scrollMomentumY * ANGLE_AMPLIFICATION);
      
      quat.multiply(this.scrollRotation, rotX, rotY);
      
      // Apply decay to momentum - smoother deceleration
      this.scrollMomentumX *= this.scrollDecay;
      this.scrollMomentumY *= this.scrollDecay;
      
      // Stop very small momentum
      if (Math.abs(this.scrollMomentumX) < 0.00003) this.scrollMomentumX = 0;
      if (Math.abs(this.scrollMomentumY) < 0.00003) this.scrollMomentumY = 0;
    } else {
      const INTENSITY = 0.1 * timeScale;
      quat.slerp(this.scrollRotation, this.scrollRotation, this.IDENTITY_QUAT, INTENSITY);

      if (this.snapTargetDirection) {
        const SNAPPING_INTENSITY = 0.2;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = vec3.squaredDistance(a, b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= SNAPPING_INTENSITY * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = quat.multiply(quat.create(), snapRotation, this.scrollRotation);
    this.orientation = quat.multiply(quat.create(), combinedQuat, this.orientation);
    quat.normalize(this.orientation, this.orientation);

    const RA_INTENSITY = 0.8 * timeScale;
    quat.slerp(this._combinedQuat, this._combinedQuat, combinedQuat, RA_INTENSITY);
    quat.normalize(this._combinedQuat, this._combinedQuat);

    const rad = Math.acos(this._combinedQuat[3]) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis[0] = this._combinedQuat[0] / s;
      this.rotationAxis[1] = this._combinedQuat[1] / s;
      this.rotationAxis[2] = this._combinedQuat[2] / s;
    }

    const RV_INTENSITY = 0.5 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
    this.rotationVelocity = this._rotationVelocity / timeScale;

    this.updateCallback(deltaTime);
  }

  quatFromVectors(a, b, out, angleFactor = 1) {
    const axis = vec3.cross(vec3.create(), a, b);
    vec3.normalize(axis, axis);
    const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    const angle = Math.acos(d) * angleFactor;
    quat.setAxisAngle(out, axis, angle);
    return { q: out, axis, angle };
  }

  // Keep for compatibility but not used with scroll control
  get isPointerDown() {
    return this.isScrolling || (Math.abs(this.scrollMomentumX) > 0.01 || Math.abs(this.scrollMomentumY) > 0.01);
  }
}

class InfiniteGridMenu {
  TARGET_FRAME_DURATION = 1000 / 60;
  SPHERE_RADIUS = 2;

  #time = 0;
  #deltaTime = 0;
  #deltaFrames = 0;
  #frames = 0;

  camera = {
    matrix: mat4.create(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: vec3.fromValues(0, 0, 3),
    up: vec3.fromValues(0, 1, 0),
    matrices: {
      view: mat4.create(),
      projection: mat4.create(),
      inversProjection: mat4.create()
    }
  };

  nearestVertexIndex = null;
  smoothRotationVelocity = 0;
  scaleFactor = 1.0;
  movementActive = false;

  constructor(canvas, items, onActiveItemChange, onMovementChange, onInit = null) {
    this.canvas = canvas;
    this.items = items || [];
    this.onActiveItemChange = onActiveItemChange || (() => {});
    this.onMovementChange = onMovementChange || (() => {});
    this.#init(onInit);
  }

  resize() {
    this.viewportSize = vec2.set(this.viewportSize || vec2.create(), this.canvas.clientWidth, this.canvas.clientHeight);

    const gl = this.gl;
    const needsResize = resizeCanvasToDisplaySize(gl.canvas);
    if (needsResize) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    this.#updateProjectionMatrix(gl);
  }

  run(time = 0) {
    this.#deltaTime = Math.min(32, time - this.#time);
    this.#time = time;
    this.#deltaFrames = this.#deltaTime / this.TARGET_FRAME_DURATION;
    this.#frames += this.#deltaFrames;

    this.#animate(this.#deltaTime);
    this.#render();

    requestAnimationFrame(t => this.run(t));
  }

  #init(onInit) {
    this.gl = this.canvas.getContext('webgl2', { antialias: true, alpha: false });
    const gl = this.gl;
    if (!gl) {
      throw new Error('No WebGL 2 context!');
    }

    this.viewportSize = vec2.fromValues(this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawBufferSize = vec2.clone(this.viewportSize);

    this.discProgram = createProgram(gl, [discVertShaderSource, discFragShaderSource], null, {
      aModelPosition: 0,
      aModelNormal: 1,
      aModelUvs: 2,
      aInstanceMatrix: 3
    });

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram, 'aModelPosition'),
      aModelUvs: gl.getAttribLocation(this.discProgram, 'aModelUvs'),
      aInstanceMatrix: gl.getAttribLocation(this.discProgram, 'aInstanceMatrix'),
      uWorldMatrix: gl.getUniformLocation(this.discProgram, 'uWorldMatrix'),
      uViewMatrix: gl.getUniformLocation(this.discProgram, 'uViewMatrix'),
      uProjectionMatrix: gl.getUniformLocation(this.discProgram, 'uProjectionMatrix'),
      uCameraPosition: gl.getUniformLocation(this.discProgram, 'uCameraPosition'),
      uScaleFactor: gl.getUniformLocation(this.discProgram, 'uScaleFactor'),
      uRotationAxisVelocity: gl.getUniformLocation(this.discProgram, 'uRotationAxisVelocity'),
      uTex: gl.getUniformLocation(this.discProgram, 'uTex'),
      uFrames: gl.getUniformLocation(this.discProgram, 'uFrames'),
      uItemCount: gl.getUniformLocation(this.discProgram, 'uItemCount'),
      uAtlasSize: gl.getUniformLocation(this.discProgram, 'uAtlasSize')
    };

    this.discGeo = new DiscGeometry(56, 1);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      gl,
      [
        [makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW), this.discLocations.aModelPosition, 3],
        [makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW), this.discLocations.aModelUvs, 2]
      ],
      this.discBuffers.indices
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map(v => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this.#initDiscInstances(this.DISC_INSTANCE_COUNT);

    this.worldMatrix = mat4.create();
    this.#initTexture();

    this.control = new ArcballControl(this.canvas, deltaTime => this.#onControlUpdate(deltaTime));

    this.#updateCameraMatrix();
    this.#updateProjectionMatrix(gl);
    this.resize();

    if (onInit) onInit(this);
  }

  #initTexture() {
    const gl = this.gl;
    this.tex = createAndSetupTexture(gl, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 512;

    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    Promise.all(
      this.items.map(
        item =>
          new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.src = item.image;
          })
      )
    ).then(images => {
      images.forEach((img, i) => {
        const x = (i % this.atlasSize) * cellSize;
        const y = Math.floor(i / this.atlasSize) * cellSize;
        ctx.drawImage(img, x, y, cellSize, cellSize);
      });

      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }

  #initDiscInstances(count) {
    const gl = this.gl;
    this.discInstances = {
      matricesArray: new Float32Array(count * 16),
      matrices: [],
      buffer: gl.createBuffer()
    };
    for (let i = 0; i < count; ++i) {
      const instanceMatrixArray = new Float32Array(this.discInstances.matricesArray.buffer, i * 16 * 4, 16);
      instanceMatrixArray.set(mat4.create());
      this.discInstances.matrices.push(instanceMatrixArray);
    }
    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, gl.DYNAMIC_DRAW);
    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = this.discLocations.aInstanceMatrix + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  #animate(deltaTime) {
    const gl = this.gl;
    this.control.update(deltaTime, this.TARGET_FRAME_DURATION);

    let positions = this.instancePositions.map(p => vec3.transformQuat(vec3.create(), p, this.control.orientation));
    const scale = 0.25;
    const SCALE_INTENSITY = 0.6;
    positions.forEach((p, ndx) => {
      const s = (Math.abs(p[2]) / this.SPHERE_RADIUS) * SCALE_INTENSITY + (1 - SCALE_INTENSITY);
      const finalScale = s * scale;
      const matrix = mat4.create();
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), vec3.negate(vec3.create(), p)));
      mat4.multiply(matrix, matrix, mat4.targetTo(mat4.create(), [0, 0, 0], p, [0, 1, 0]));
      mat4.multiply(matrix, matrix, mat4.fromScaling(mat4.create(), [finalScale, finalScale, finalScale]));
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), [0, 0, -this.SPHERE_RADIUS]));

      mat4.copy(this.discInstances.matrices[ndx], matrix);
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.smoothRotationVelocity = this.control.rotationVelocity;
  }

  #render() {
    const gl = this.gl;
    gl.useProgram(this.discProgram);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(this.discLocations.uWorldMatrix, false, this.worldMatrix);
    gl.uniformMatrix4fv(this.discLocations.uViewMatrix, false, this.camera.matrices.view);
    gl.uniformMatrix4fv(this.discLocations.uProjectionMatrix, false, this.camera.matrices.projection);
    gl.uniform3f(
      this.discLocations.uCameraPosition,
      this.camera.position[0],
      this.camera.position[1],
      this.camera.position[2]
    );
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.smoothRotationVelocity * 1.1
    );

    gl.uniform1i(this.discLocations.uItemCount, this.items.length);
    gl.uniform1i(this.discLocations.uAtlasSize, this.atlasSize);

    gl.uniform1f(this.discLocations.uFrames, this.#frames);
    gl.uniform1f(this.discLocations.uScaleFactor, this.scaleFactor);
    gl.uniform1i(this.discLocations.uTex, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.discBuffers.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.DISC_INSTANCE_COUNT
    );
  }

  #updateCameraMatrix() {
    mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  #updateProjectionMatrix(gl) {
    this.camera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const height = this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position[2];
    if (this.camera.aspect > 1) {
      this.camera.fov = 2 * Math.atan(height / distance);
    } else {
      this.camera.fov = 2 * Math.atan(height / this.camera.aspect / distance);
    }
    mat4.perspective(
      this.camera.matrices.projection,
      this.camera.fov,
      this.camera.aspect,
      this.camera.near,
      this.camera.far
    );
    mat4.invert(this.camera.matrices.inversProjection, this.camera.matrices.projection);
  }

  #onControlUpdate(deltaTime) {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3;

    const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;

    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this.#findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      const snapDirection = vec3.normalize(vec3.create(), this.#getVertexWorldPosition(nearestVertexIndex));
      this.control.snapTargetDirection = snapDirection;
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }

    this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
    this.#updateCameraMatrix();
  }
  
  // Current item index for sequential navigation
  currentItemIndex = 0;
  
  // Navigate to next item
  navigateNext() {
    const totalItems = this.items.length;
    if (this.currentItemIndex < totalItems - 1) {
      this.currentItemIndex++;
      // Apply stronger momentum for faster rotation
      this.control.scrollMomentumY = 0.25;
      return true;
    }
    return false; // At end
  }
  
  // Navigate to previous item
  navigatePrev() {
    if (this.currentItemIndex > 0) {
      this.currentItemIndex--;
      // Apply stronger momentum for faster rotation
      this.control.scrollMomentumY = -0.25;
      return true;
    }
    return false; // At start
  }
  
  // Navigate to a specific item by index (for initialization)
  navigateToItem(itemIndex) {
    this.currentItemIndex = itemIndex;
    const targetVertexIndex = itemIndex % this.instancePositions.length;
    const targetPosition = this.instancePositions[targetVertexIndex];
    const targetNorm = vec3.normalize(vec3.create(), targetPosition);
    this.control.snapTargetDirection = vec3.negate(vec3.create(), targetNorm);
  }
  
  // Get current item index
  getCurrentIndex() {
    return this.currentItemIndex;
  }

  #findNearestVertexIndex() {
    const n = this.control.snapDirection;
    const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
    const nt = vec3.transformQuat(vec3.create(), n, inversOrientation);

    let maxD = -1;
    let nearestVertexIndex;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = vec3.dot(nt, this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }
    return nearestVertexIndex;
  }

  #getVertexWorldPosition(index) {
    const nearestVertexPos = this.instancePositions[index];
    return vec3.transformQuat(vec3.create(), nearestVertexPos, this.control.orientation);
  }
}

const defaultItems = [
  {
    image: 'https://picsum.photos/900/900?grayscale',
    link: 'https://google.com/',
    title: '',
    description: ''
  }
];

export default function InfiniteMenu({ items = [] }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const menuItems = useMemo(() => (items && items.length ? items : defaultItems), [items]);
  const [isNavCooldown, setIsNavCooldown] = useState(false);
  
  const sketchRef = useRef(null);
  const currentIndexRef = useRef(0);
  const sectionNavCooldownRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const updateActiveFromSketch = (sk) => {
    if (!sk) return;
    const itemIndex = sk.getCurrentIndex();
    setActiveItem(menuItems[itemIndex]);
    setCurrentIndex(itemIndex);
    currentIndexRef.current = itemIndex;
  };

  const navigatePrev = () => {
    if (isNavCooldown) return;
    const sk = sketchRef.current;
    if (!sk) return;
    if (!sk.navigatePrev()) {
      // Optional: still allow section navigation if at boundary
      const workSection = document.getElementById('work');
      const parent = workSection?.closest('.snap-section');
      const prevSection = parent ? parent.previousElementSibling : workSection?.parentElement?.previousElementSibling;
      if (prevSection) {
        setIsNavCooldown(true);
        prevSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setIsNavCooldown(false), 1000);
      }
      return;
    }
    updateActiveFromSketch(sk);
    setIsNavCooldown(true);
    setTimeout(() => setIsNavCooldown(false), 320);
  };

  const navigateNext = () => {
    if (isNavCooldown) return;
    const sk = sketchRef.current;
    if (!sk) return;
    if (!sk.navigateNext()) {
      const workSection = document.getElementById('work');
      const parent = workSection?.closest('.snap-section');
      const nextSection = parent ? parent.nextElementSibling : workSection?.parentElement?.nextElementSibling;
      if (nextSection) {
        setIsNavCooldown(true);
        nextSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setIsNavCooldown(false), 1000);
      }
      return;
    }
    updateActiveFromSketch(sk);
    setIsNavCooldown(true);
    setTimeout(() => setIsNavCooldown(false), 320);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    // This is called by the sketch when it detects which item is in view
    const handleActiveItem = index => {
      // Update display based on sketch's current index
      const sk = sketchRef.current;
      if (sk) {
        updateActiveFromSketch(sk);
      }
    };

    if (canvas) {
      sketchRef.current = new InfiniteGridMenu(canvas, menuItems, handleActiveItem, setIsMoving, sk => {
        sk.run();
        
        // Set up sequential navigation callbacks
        if (sk.control) {
          // Scroll down - go to next item
          sk.control.onScrollNext = () => {
            if (!sk.navigateNext()) {
              // At last item - navigate to next section
              if (!sectionNavCooldownRef.current) {
                const workSection = document.getElementById('work');
                if (workSection) {
                  const parent = workSection.closest('.snap-section');
                  const nextSection = parent ? parent.nextElementSibling : workSection.parentElement?.nextElementSibling;
                  if (nextSection) {
                    sectionNavCooldownRef.current = true;
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      sectionNavCooldownRef.current = false;
                    }, 1200);
                  }
                }
              }
            } else {
              // Update display
              updateActiveFromSketch(sk);
            }
          };
          
          // Scroll up - go to previous item
          sk.control.onScrollPrev = () => {
            if (!sk.navigatePrev()) {
              // At first item - navigate to previous section
              if (!sectionNavCooldownRef.current) {
                const workSection = document.getElementById('work');
                if (workSection) {
                  const parent = workSection.closest('.snap-section');
                  const prevSection = parent ? parent.previousElementSibling : workSection.parentElement?.previousElementSibling;
                  if (prevSection) {
                    sectionNavCooldownRef.current = true;
                    prevSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      sectionNavCooldownRef.current = false;
                    }, 1200);
                  }
                }
              }
            } else {
              // Update display
              updateActiveFromSketch(sk);
            }
          };
        }
        
        // Initialize to first item
        sk.navigateToItem(0);
        setActiveItem(menuItems[0]);
      });
    }

    const handleResize = () => {
      if (sketchRef.current) {
        sketchRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [menuItems]);

  const handleButtonClick = () => {
    const link = activeItem?.link;
    if (!link || link === '#') return;

    const isExternal = /^(https?:\/\/|mailto:|tel:)/i.test(link);
    if (isExternal) {
      window.open(link, '_blank');
      return;
    }

    router.push(link);
  };

  // Prevent scroll propagation when interacting with the menu
  const handleWheel = (e) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={containerRef}
      data-cursor="interactive"
      className="infinite-menu-container"
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'hidden',
        background: '#000',
        touchAction: 'none'
      }}
    >
      <canvas
        id="infinite-grid-menu-canvas"
        ref={canvasRef}
        data-cursor="interactive"
        style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 1 }}
      />

      {/* Swipe Indicators */}
      {currentIndex > 0 && (
        <div className="swipe-indicator top">
          <svg viewBox="0 0 24 24">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </div>
      )}
      
      {currentIndex < menuItems.length - 1 && (
        <div className="swipe-indicator bottom">
          <svg viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      )}

      {activeItem && (
        <>
          <h2 className={`face-title ${isMoving ? 'inactive' : 'active'}`}>{activeItem.title}</h2>

          <p className={`face-description ${isMoving ? 'inactive' : 'active'}`}> {activeItem.description}</p>

          <div onClick={handleButtonClick} className={`action-button ${isMoving ? 'inactive' : 'active'}`}>
            <p className="action-button-icon">&#x2197;</p>
          </div>

          {/* Explicit navigation buttons for desktop/tablet */}
          <div className="nav-buttons min-w-2xl flex justify-between">
            <button
              type="button"
              className="nav-button"
              onClick={navigatePrev}
              disabled={currentIndex === 0 || isNavCooldown}
              aria-label="Previous work"
            >
              ← Prev
            </button>
            <button
              type="button"
              className="nav-button"
              onClick={navigateNext}
              disabled={currentIndex >= menuItems.length - 1 || isNavCooldown}
              aria-label="Next work"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
