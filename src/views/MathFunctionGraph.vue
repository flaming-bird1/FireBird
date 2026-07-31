<template>
  <div class="function-plotter">
    <!-- 左侧控制面板 - 使用Element Plus卡片布局 -->
    <el-scrollbar class="control-panel">
      <div class="panel-header">
        <h2 class="title">
          <el-icon size="24" color="#409EFF"><DataLine /></el-icon>
          考研数学绘图仪
        </h2>
        <el-tag type="info" size="small" effect="plain">v2.0</el-tag>
      </div>

      <!-- 函数列表区域 -->
      <el-card class="section-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span><el-icon><List /></el-icon> 函数列表</span>
            <el-button
                type="primary"
                size="small"
                :icon="Plus"
                :disabled="functions.length >= 8"
                @click="addFunction"
            >
              添加函数 ({{ functions.length }}/8)
            </el-button>
          </div>
        </template>

        <div class="functions-list">
          <el-collapse v-model="activeFunctionIndex" accordion>
            <el-collapse-item
                v-for="(func, index) in functions"
                :key="index"
                :name="index"
            >
              <template #title>
                <div class="function-title" :style="{ borderLeftColor: func.color }">
                  <el-tag size="small" :color="func.color" style="color: white; margin-right: 8px;">
                    f{{ index + 1 }}
                  </el-tag>
                  <span class="function-expression">{{ func.expression || '未定义' }}</span>
                  <el-switch
                      v-model="func.visible"
                      size="small"
                      active-icon="View"
                      inactive-icon="Hide"
                      @change="plotFunctions"
                  />
                </div>
              </template>

              <div class="function-item">
                <el-input
                    v-model="func.expression"
                    placeholder="输入函数表达式"
                    size="small"
                    clearable
                    @keyup.enter="plotFunctions"
                >
                  <template #prepend>y =</template>
                </el-input>

                <div class="function-controls">
                  <div class="control-group">
                    <span class="label">颜色</span>
                    <el-color-picker
                        v-model="func.color"
                        size="small"
                        show-alpha
                        :predefine="predefineColors"
                    />
                  </div>

                  <div class="control-group">
                    <span class="label">线型</span>
                    <el-select v-model="func.lineStyle" size="small" style="width: 90px;">
                      <el-option label="实线" value="solid" />
                      <el-option label="虚线" value="dashed" />
                      <el-option label="点线" value="dotted" />
                    </el-select>
                  </div>

                  <div class="control-group">
                    <span class="label">线宽</span>
                    <el-input-number
                        v-model="func.lineWidth"
                        :min="1"
                        :max="5"
                        size="small"
                        style="width: 70px;"
                    />
                  </div>
                </div>

                <div class="function-actions">
                  <el-button
                      type="danger"
                      size="small"
                      :icon="Delete"
                      :disabled="functions.length <= 1"
                      @click="removeFunction(index)"
                      circle
                  />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <el-alert
            v-if="errorMessage"
            :title="errorMessage"
            type="error"
            show-icon
            closable
            class="error-alert"
        />
      </el-card>

      <!-- 视图控制区域 -->
      <el-card class="section-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span><el-icon><Monitor /></el-icon> 视图控制</span>
            <el-button type="primary" link @click="resetView">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
          </div>
        </template>

        <div class="axis-controls">
          <div class="axis-item">
            <span class="axis-label">X轴范围</span>
            <el-slider
                v-model="xRange"
                range
                :min="-20"
                :max="20"
                :step="0.1"
                :format-tooltip="(val) => val.toFixed(1)"
                @input="updateXRange"
            />
            <div class="range-value">[{{ xMin.toFixed(2) }}, {{ xMax.toFixed(2) }}]</div>
          </div>

          <div class="axis-item">
            <span class="axis-label">Y轴范围</span>
            <el-slider
                v-model="yRange"
                range
                :min="-20"
                :max="20"
                :step="0.1"
                :format-tooltip="(val) => val.toFixed(1)"
                @input="updateYRange"
            />
            <div class="range-value">[{{ yMin.toFixed(2) }}, {{ yMax.toFixed(2) }}]</div>
          </div>
        </div>

        <div class="quick-views">
          <el-button-group>
            <el-button size="small" @click="setViewPreset('default')">默认</el-button>
            <el-button size="small" @click="setViewPreset('trig')">三角函数</el-button>
            <el-button size="small" @click="setViewPreset('exp')">指数对数</el-button>
            <el-button size="small" @click="setViewPreset('special')">特殊函数</el-button>
          </el-button-group>
        </div>
      </el-card>

      <!-- 采样与网格控制 -->
      <el-card class="section-card" shadow="hover">
        <div class="sample-control">
          <div class="control-row">
            <span class="label">采样精度</span>
            <el-slider
                v-model="sampleCount"
                :min="500"
                :max="5000"
                :step="100"
                :format-tooltip="(val) => val + '点'"
            />
            <span class="value">{{ sampleCount }}</span>
          </div>

          <div class="control-row">
            <el-checkbox v-model="showGrid">显示网格</el-checkbox>
            <el-checkbox v-model="showAxes">显示坐标轴</el-checkbox>
            <el-checkbox v-model="showNumbers">显示刻度</el-checkbox>
          </div>
        </div>
      </el-card>

      <!-- 函数库分类 -->
      <el-card class="section-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span><el-icon><Collection /></el-icon> 考研函数库</span>
            <el-tag size="small" type="success" effect="plain">点击添加</el-tag>
          </div>
        </template>

        <el-tabs v-model="activeCategory" type="border-card" size="small">
          <el-tab-pane label="基本初等" name="basic">
            <div class="example-buttons">
              <el-button v-for="fn in functionLib.basic" :key="fn.label" size="small" @click="addExample(fn.expr)">
                {{ fn.label }}
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="三角函数" name="trig">
            <div class="example-buttons">
              <el-button v-for="fn in functionLib.trig" :key="fn.label" size="small" @click="addExample(fn.expr)">
                {{ fn.label }}
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="反三角" name="arcTrig">
            <div class="example-buttons">
              <el-button v-for="fn in functionLib.arcTrig" :key="fn.label" size="small" @click="addExample(fn.expr)">
                {{ fn.label }}
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="指数对数" name="expLog">
            <div class="example-buttons">
              <el-button v-for="fn in functionLib.expLog" :key="fn.label" size="small" @click="addExample(fn.expr)">
                {{ fn.label }}
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="双曲函数" name="hyperbolic">
            <div class="example-buttons">
              <el-button v-for="fn in functionLib.hyperbolic" :key="fn.label" size="small" @click="addExample(fn.expr)">
                {{ fn.label }}
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="取整函数" name="floor">
            <div class="example-buttons">
              <el-button v-for="fn in functionLib.floor" :key="fn.label" size="small" @click="addExample(fn.expr)">
                {{ fn.label }}
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="分段函数" name="piecewise">
            <div class="example-buttons">
              <el-button v-for="fn in functionLib.piecewise" :key="fn.label" size="small" @click="addExample(fn.expr)">
                {{ fn.label }}
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="特殊函数" name="special">
            <div class="example-buttons">
              <el-button v-for="fn in functionLib.special" :key="fn.label" size="small" @click="addExample(fn.expr)">
                {{ fn.label }}
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 交互提示 -->
      <el-card class="section-card tips-card" shadow="hover">
        <el-descriptions :column="2" size="small" border>
          <el-descriptions-item label="🖱️ 拖拽">平移视图</el-descriptions-item>
          <el-descriptions-item label="🖱️ 滚轮">缩放视图</el-descriptions-item>
          <el-descriptions-item label="🖱️ 双击">重置视图</el-descriptions-item>
          <el-descriptions-item label="📝 表达式">支持数学函数</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-scrollbar>

    <!-- 右侧绘图区 -->
    <div class="plot-area">
      <div class="plot-container">
        <canvas
            ref="functionCanvas"
            class="function-canvas"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @wheel="handleWheel"
            @dblclick="resetView"
        ></canvas>

        <!-- 坐标显示 -->
        <div class="coordinates" v-if="mousePosition">
          x: {{ mousePosition.x.toFixed(4) }}, y: {{ mousePosition.y.toFixed(4) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Plus, Delete, List, Monitor, Refresh,
  DataLine, Collection, View, Hide
} from '@element-plus/icons-vue';

// 预定义颜色
const predefineColors = [
  '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
  '#9C27B0', '#FF9800', '#4CAF50', '#2196F3', '#FF5722'
];

// 函数项接口
const createFunctionItem = (expression = '', color = '#409EFF', lineStyle = 'solid', lineWidth = 2, visible = true) => ({
  expression,
  color,
  lineStyle,
  lineWidth,
  visible
});

// 函数列表
const functions = ref([
  createFunctionItem('sin(x)', '#409EFF', 'solid', 2, true),
  createFunctionItem('cos(x)', '#F56C6C', 'solid', 2, true),
  createFunctionItem('tan(x)', '#67C23A', 'dashed', 2, true)
]);

const activeFunctionIndex = ref(0);
const errorMessage = ref('');

// 坐标轴范围
const xMin = ref(-6);
const xMax = ref(6);
const yMin = ref(-2);
const yMax = ref(2);
const xRange = ref([-6, 6]);
const yRange = ref([-2, 2]);

const sampleCount = ref(2000);
const showGrid = ref(true);
const showAxes = ref(true);
const showNumbers = ref(true);
const activeCategory = ref('basic');

// canvas 相关
const functionCanvas = ref(null);
let ctx = null;
let canvasWidth = 0;
let canvasHeight = 0;

// 交互状态
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
const mousePosition = ref(null);

// 函数库分类
const functionLib = {
  basic: [
    { label: 'x²', expr: 'x^2' },
    { label: 'x³', expr: 'x^3' },
    { label: '√x', expr: 'sqrt(x)' },
    { label: '∛x', expr: 'cbrt(x)' },
    { label: '1/x', expr: '1/x' },
    { label: '|x|', expr: 'abs(x)' },
    { label: 'x^(1/3)', expr: 'x^(1/3)' },
    { label: 'x^(2/3)', expr: 'x^(2/3)' }
  ],
  trig: [
    { label: 'sin(x)', expr: 'sin(x)' },
    { label: 'cos(x)', expr: 'cos(x)' },
    { label: 'tan(x)', expr: 'tan(x)' },
    { label: 'cot(x)', expr: 'cot(x)' },
    { label: 'sec(x)', expr: 'sec(x)' },
    { label: 'csc(x)', expr: 'csc(x)' }
  ],
  arcTrig: [
    { label: 'arcsin(x)', expr: 'asin(x)' },
    { label: 'arccos(x)', expr: 'acos(x)' },
    { label: 'arctan(x)', expr: 'atan(x)' },
    { label: 'arccot(x)', expr: 'acot(x)' },
    { label: 'arcsec(x)', expr: 'asec(x)' },
    { label: 'arccsc(x)', expr: 'acsc(x)' }
  ],
  expLog: [
    { label: 'e^x', expr: 'exp(x)' },
    { label: '2^x', expr: '2^x' },
    { label: 'ln(x)', expr: 'log(x)' },
    { label: 'lg(x)', expr: 'log10(x)' },
    { label: 'log₂x', expr: 'log2(x)' },
    { label: 'x^x', expr: 'x^x' }
  ],
  hyperbolic: [
    { label: 'sinh(x)', expr: 'sinh(x)' },
    { label: 'cosh(x)', expr: 'cosh(x)' },
    { label: 'tanh(x)', expr: 'tanh(x)' },
    { label: 'coth(x)', expr: 'coth(x)' },
    { label: 'sech(x)', expr: 'sech(x)' },
    { label: 'csch(x)', expr: 'csch(x)' }
  ],
  floor: [
    { label: 'floor(x)', expr: 'floor(x)' },
    { label: 'ceil(x)', expr: 'ceil(x)' },
    { label: 'round(x)', expr: 'round(x)' },
    { label: 'frac(x)', expr: 'x - floor(x)' },
    { label: 'sign(x)', expr: 'sign(x)' }
  ],
  piecewise: [
    { label: '矩形波', expr: 'square(x)' },
    { label: '锯齿波', expr: 'sawtooth(x)' },
    { label: '三角波', expr: 'triangle(x)' },
    { label: '单位阶跃', expr: 'heaviside(x)' },
    { label: '狄利克雷', expr: 'dirichlet(x)' }
  ],
  special: [
    { label: 'sinc(x)', expr: 'sinc(x)' },
    { label: '高斯函数', expr: 'exp(-x^2)' },
    { label: 'x·sin(1/x)', expr: 'x*sin(1/x)' },
    { label: 'Γ(x)', expr: 'gamma(x)' },
    { label: 'Bessel J₀', expr: 'besselJ0(x)' },
    { label: 'Bessel J₁', expr: 'besselJ1(x)' },
    { label: 'erf(x)', expr: 'erf(x)' },
    { label: 'ζ(x)', expr: 'zeta(x)' }
  ]
};

// ==================== 完整数学函数库 ====================
const mathFunctions = {
  // 基本运算
  abs: Math.abs,
  sign: Math.sign,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,

  // 幂指对
  sqrt: Math.sqrt,
  cbrt: (x) => Math.cbrt(x) || Math.pow(x, 1/3),
  exp: Math.exp,
  log: Math.log,
  log10: Math.log10,
  log2: Math.log2,
  pow: Math.pow,

  // 三角函数
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  cot: (x) => 1 / Math.tan(x),
  sec: (x) => 1 / Math.cos(x),
  csc: (x) => 1 / Math.sin(x),

  // 反三角函数
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  acot: (x) => Math.PI/2 - Math.atan(x),
  asec: (x) => Math.acos(1/x),
  acsc: (x) => Math.asin(1/x),

  // 双曲函数
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  coth: (x) => 1 / Math.tanh(x),
  sech: (x) => 1 / Math.cosh(x),
  csch: (x) => 1 / Math.sinh(x),

  // 常数
  PI: Math.PI,
  E: Math.E,

  // 特殊函数
  sinc: (x) => x === 0 ? 1 : Math.sin(x) / x,

  // 分段函数
  square: (x) => Math.sign(Math.sin(x)),
  sawtooth: (x) => x - Math.floor(x),
  triangle: (x) => 2 * Math.abs(x - Math.floor(x) - 0.5),
  heaviside: (x) => x >= 0 ? 1 : 0,
  dirichlet: (x) => Number.isInteger(x) ? 1 : 0,

  // 伽马函数 Γ(x)
  gamma: (z) => {
    if (z <= 0 && Number.isInteger(z)) return NaN;
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * mathFunctions.gamma(1 - z));

    z -= 1;
    const p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

    let x = p[0];
    for (let i = 1; i < p.length; i++) {
      x += p[i] / (z + i);
    }

    const t = z + p.length - 1.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  },

  // 贝塞尔函数 J0
  besselJ0: (x) => {
    if (x < 0) return mathFunctions.besselJ0(-x);
    let sum = 0;
    let term = 1;
    for (let k = 0; k < 20; k++) {
      sum += term;
      term *= -x * x / (4 * (k + 1) * (k + 1));
      if (Math.abs(term) < 1e-12) break;
    }
    return sum;
  },

  // 贝塞尔函数 J1
  besselJ1: (x) => {
    if (x === 0) return 0;
    if (x < 0) return -mathFunctions.besselJ1(-x);
    let sum = 0;
    let term = x / 2;
    for (let k = 0; k < 20; k++) {
      sum += term;
      term *= -x * x / (4 * (k + 1) * (k + 2));
      if (Math.abs(term) < 1e-12) break;
    }
    return sum;
  },

  // 误差函数
  erf: (x) => {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  },

  // 黎曼ζ函数
  zeta: (x) => {
    if (x === 1) return Infinity;
    if (x < 1) return NaN;
    let sum = 0;
    for (let n = 1; n < 1000; n++) {
      sum += 1 / Math.pow(n, x);
    }
    return sum;
  }
};

// 更新X轴范围
const updateXRange = (val) => {
  xMin.value = val[0];
  xMax.value = val[1];
};

// 更新Y轴范围
const updateYRange = (val) => {
  yMin.value = val[0];
  yMax.value = val[1];
};

// 设置视图预设
const setViewPreset = (type) => {
  switch(type) {
    case 'default':
      xMin.value = -6; xMax.value = 6;
      yMin.value = -2; yMax.value = 2;
      break;
    case 'trig':
      xMin.value = -2*Math.PI; xMax.value = 2*Math.PI;
      yMin.value = -1.5; yMax.value = 1.5;
      break;
    case 'exp':
      xMin.value = -3; xMax.value = 3;
      yMin.value = -1; yMax.value = 10;
      break;
    case 'special':
      xMin.value = -5; xMax.value = 5;
      yMin.value = -2; yMax.value = 5;
      break;
  }
  xRange.value = [xMin.value, xMax.value];
  yRange.value = [yMin.value, yMax.value];
  plotFunctions();
};

// 解析并计算函数值
const computeFunction = (expr, x) => {
  if (!expr || expr.trim() === '') return NaN;

  // 处理幂运算符
  let processedExpr = expr.replace(/\^/g, '**');

  try {
    const context = {
      x: x,
      ...mathFunctions
    };

    const argNames = Object.keys(context);
    const argValues = argNames.map(key => context[key]);

    const fn = new Function(...argNames, `"use strict"; return (${processedExpr});`);
    const result = fn(...argValues);

    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return NaN;
    }
    return result;
  } catch (e) {
    throw new Error(`表达式错误: ${e.message}`);
  }
};

// 生成所有函数的数据点
const generateAllData = () => {
  const allPoints = [];
  const step = (xMax.value - xMin.value) / (sampleCount.value - 1 || 1);
  const xValues = [];

  for (let i = 0; i < sampleCount.value; i++) {
    xValues.push(xMin.value + i * step);
  }

  for (let fIndex = 0; fIndex < functions.value.length; fIndex++) {
    const func = functions.value[fIndex];
    if (!func.visible || !func.expression) {
      allPoints.push([]);
      continue;
    }

    const points = [];
    let hasError = false;

    for (let i = 0; i < xValues.length; i++) {
      const x = xValues[i];
      try {
        const y = computeFunction(func.expression, x);
        points.push({ x, y });
      } catch (e) {
        errorMessage.value = `函数 ${fIndex + 1}: ${e.message}`;
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      allPoints.push(points);
    } else {
      allPoints.push([]);
    }
  }

  if (errorMessage.value === '') {
    errorMessage.value = '';
  }

  return allPoints;
};

// 坐标转换
const toCanvasX = (x) => ((x - xMin.value) / (xMax.value - xMin.value)) * canvasWidth;
const toCanvasY = (y) => canvasHeight - ((y - yMin.value) / (yMax.value - yMin.value)) * canvasHeight;
const toMathX = (canvasX) => (canvasX / canvasWidth) * (xMax.value - xMin.value) + xMin.value;
const toMathY = (canvasY) => ((canvasHeight - canvasY) / canvasHeight) * (yMax.value - yMin.value) + yMin.value;

// 绘制坐标轴
const drawAxes = () => {
  if (!ctx || !showAxes.value) return;

  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#333333';
  ctx.fillStyle = '#333333';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const xAxisY = toCanvasY(0);
  const yAxisX = toCanvasX(0);

  // 绘制X轴
  if (xAxisY >= 0 && xAxisY <= canvasHeight) {
    ctx.beginPath();
    ctx.moveTo(0, xAxisY);
    ctx.lineTo(canvasWidth, xAxisY);
    ctx.stroke();

    // 箭头
    ctx.beginPath();
    ctx.moveTo(canvasWidth - 10, xAxisY - 5);
    ctx.lineTo(canvasWidth, xAxisY);
    ctx.lineTo(canvasWidth - 10, xAxisY + 5);
    ctx.fill();
  }

  // 绘制Y轴
  if (yAxisX >= 0 && yAxisX <= canvasWidth) {
    ctx.beginPath();
    ctx.moveTo(yAxisX, 0);
    ctx.lineTo(yAxisX, canvasHeight);
    ctx.stroke();

    // 箭头
    ctx.beginPath();
    ctx.moveTo(yAxisX - 5, 10);
    ctx.lineTo(yAxisX, 0);
    ctx.lineTo(yAxisX + 5, 10);
    ctx.fill();
  }

  // 绘制刻度
  if (showNumbers.value) {
    const xStep = calculateStepSize(xMin.value, xMax.value);
    const yStep = calculateStepSize(yMin.value, yMax.value);

    // X轴刻度
    for (let x = Math.ceil(xMin.value / xStep) * xStep; x <= xMax.value; x += xStep) {
      if (Math.abs(x) < 1e-10) continue;

      const canvasX = toCanvasX(x);
      if (canvasX >= 0 && canvasX <= canvasWidth && xAxisY >= 0 && xAxisY <= canvasHeight) {
        ctx.beginPath();
        ctx.moveTo(canvasX, xAxisY - 5);
        ctx.lineTo(canvasX, xAxisY + 5);
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = '#666666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(x.toFixed(2), canvasX, xAxisY + 8);
        ctx.restore();
      }
    }

    // Y轴刻度
    for (let y = Math.ceil(yMin.value / yStep) * yStep; y <= yMax.value; y += yStep) {
      if (Math.abs(y) < 1e-10) continue;

      const canvasY = toCanvasY(y);
      if (canvasY >= 0 && canvasY <= canvasHeight && yAxisX >= 0 && yAxisX <= canvasWidth) {
        ctx.beginPath();
        ctx.moveTo(yAxisX - 5, canvasY);
        ctx.lineTo(yAxisX + 5, canvasY);
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = '#666666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(y.toFixed(2), yAxisX - 8, canvasY);
        ctx.restore();
      }
    }

    // 轴标签
    ctx.save();
    ctx.fillStyle = '#333333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    if (xAxisY >= 0 && xAxisY <= canvasHeight) {
      ctx.fillText('x', canvasWidth - 15, xAxisY - 10);
    }

    if (yAxisX >= 0 && yAxisX <= canvasWidth) {
      ctx.fillText('y', yAxisX + 15, 15);
    }

    ctx.restore();
  }

  ctx.restore();
};

// 绘制网格
const drawGrid = () => {
  if (!ctx || !showGrid.value) return;

  ctx.save();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#e0e0e0';

  const xStep = calculateStepSize(xMin.value, xMax.value);
  const yStep = calculateStepSize(yMin.value, yMax.value);

  for (let x = Math.ceil(xMin.value / xStep) * xStep; x <= xMax.value; x += xStep) {
    const canvasX = toCanvasX(x);
    if (canvasX >= 0 && canvasX <= canvasWidth) {
      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, canvasHeight);
      ctx.stroke();
    }
  }

  for (let y = Math.ceil(yMin.value / yStep) * yStep; y <= yMax.value; y += yStep) {
    const canvasY = toCanvasY(y);
    if (canvasY >= 0 && canvasY <= canvasHeight) {
      ctx.beginPath();
      ctx.moveTo(0, canvasY);
      ctx.lineTo(canvasWidth, canvasY);
      ctx.stroke();
    }
  }

  ctx.restore();
};

// 绘制函数图像
const drawFunctions = (allPoints) => {
  if (!ctx) return;

  for (let fIndex = 0; fIndex < allPoints.length; fIndex++) {
    const points = allPoints[fIndex];
    const func = functions.value[fIndex];

    if (!func.visible || points.length === 0) continue;

    ctx.save();
    ctx.lineWidth = func.lineWidth || 2;
    ctx.strokeStyle = func.color;

    // 设置线型
    if (func.lineStyle === 'dashed') {
      ctx.setLineDash([8, 5]);
    } else if (func.lineStyle === 'dotted') {
      ctx.setLineDash([2, 3]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    let isFirstPoint = true;

    for (let i = 0; i < points.length; i++) {
      const { x, y } = points[i];

      if (isNaN(y) || !isFinite(y)) {
        isFirstPoint = true;
        continue;
      }

      const canvasX = toCanvasX(x);
      const canvasY = toCanvasY(y);

      if (canvasX >= -10 && canvasX <= canvasWidth + 10 &&
          canvasY >= -10 && canvasY <= canvasHeight + 10) {
        if (isFirstPoint) {
          ctx.moveTo(canvasX, canvasY);
          isFirstPoint = false;
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      } else {
        isFirstPoint = true;
      }
    }

    ctx.stroke();
    ctx.restore();
  }
};

// 计算步长
const calculateStepSize = (min, max) => {
  const range = max - min;
  if (range <= 0) return 1;

  const targetCount = 7;
  let rawStep = range / targetCount;

  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;

  let step;
  if (normalized < 1.5) step = 1 * magnitude;
  else if (normalized < 3) step = 2 * magnitude;
  else if (normalized < 7) step = 5 * magnitude;
  else step = 10 * magnitude;

  return step;
};

// 主绘制函数
const draw = () => {
  if (!functionCanvas.value) return;

  ctx = functionCanvas.value.getContext('2d');
  const container = functionCanvas.value.parentElement;
  canvasWidth = container.clientWidth;
  canvasHeight = container.clientHeight;

  functionCanvas.value.width = canvasWidth;
  functionCanvas.value.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const allPoints = generateAllData();
  if (allPoints.length === 0) return;

  drawGrid();
  drawAxes();
  drawFunctions(allPoints);
};

// 鼠标移动事件 - 更新坐标显示
const handleMouseMove = (e) => {
  if (!functionCanvas.value) return;

  const rect = functionCanvas.value.getBoundingClientRect();
  const canvasX = e.clientX - rect.left;
  const canvasY = e.clientY - rect.top;

  // 更新鼠标位置
  const mathX = toMathX(canvasX);
  const mathY = toMathY(canvasY);
  mousePosition.value = { x: mathX, y: mathY };

  if (isDragging) {
    const currentX = e.offsetX;
    const currentY = e.offsetY;

    const dx = currentX - lastMouseX;
    const dy = currentY - lastMouseY;

    const xRange = xMax.value - xMin.value;
    const yRange = yMax.value - yMin.value;

    const deltaX = (dx / canvasWidth) * xRange;
    const deltaY = -(dy / canvasHeight) * yRange;

    xMin.value -= deltaX;
    xMax.value -= deltaX;
    yMin.value -= deltaY;
    yMax.value -= deltaY;

    xRange.value = [xMin.value, xMax.value];
    yRange.value = [yMin.value, yMax.value];

    lastMouseX = currentX;
    lastMouseY = currentY;

    draw();
  }
};

// 交互：鼠标按下
const handleMouseDown = (e) => {
  isDragging = true;
  lastMouseX = e.offsetX;
  lastMouseY = e.offsetY;
  functionCanvas.value.style.cursor = 'grabbing';
};

// 交互：鼠标松开
const handleMouseUp = () => {
  isDragging = false;
  if (functionCanvas.value) {
    functionCanvas.value.style.cursor = 'default';
  }
};

// 交互：滚轮缩放
const handleWheel = (e) => {
  e.preventDefault();

  const zoomFactor = 0.9;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  const focusX = toMathX(mouseX);
  const focusY = toMathY(mouseY);

  const scale = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor;

  const newXMin = focusX - (focusX - xMin.value) * scale;
  const newXMax = focusX + (xMax.value - focusX) * scale;
  const newYMin = focusY - (focusY - yMin.value) * scale;
  const newYMax = focusY + (yMax.value - focusY) * scale;

  xMin.value = newXMin;
  xMax.value = newXMax;
  yMin.value = newYMin;
  yMax.value = newYMax;

  xRange.value = [xMin.value, xMax.value];
  yRange.value = [yMin.value, yMax.value];

  draw();
};

// 重置视图
const resetView = () => {
  xMin.value = -6;
  xMax.value = 6;
  yMin.value = -2;
  yMax.value = 2;
  xRange.value = [-6, 6];
  yRange.value = [-2, 2];
  draw();
  ElMessage.success('视图已重置');
};

// 添加函数
const addFunction = () => {
  if (functions.value.length >= 8) {
    ElMessage.warning('最多只能添加8个函数');
    return;
  }

  const colors = predefineColors;
  const newColor = colors[functions.value.length % colors.length];

  functions.value.push(createFunctionItem('', newColor, 'solid', 2, true));
  activeFunctionIndex.value = functions.value.length - 1;
  ElMessage.success('已添加新函数');
};

// 删除函数
const removeFunction = (index) => {
  if (functions.value.length <= 1) {
    ElMessage.warning('至少保留一个函数');
    return;
  }
  functions.value.splice(index, 1);
  if (activeFunctionIndex.value >= functions.value.length) {
    activeFunctionIndex.value = functions.value.length - 1;
  }
  plotFunctions();
  ElMessage.success('已删除函数');
};

// 添加示例函数
const addExample = (expr) => {
  if (functions.value.length >= 8) {
    ElMessage.warning('最多只能添加8个函数');
    return;
  }

  const colors = predefineColors;
  const newColor = colors[functions.value.length % colors.length];

  functions.value.push(createFunctionItem(expr, newColor, 'solid', 2, true));
  activeFunctionIndex.value = functions.value.length - 1;
  plotFunctions();
  ElMessage.success(`已添加: y = ${expr}`);
};

// 绘制所有函数
const plotFunctions = () => {
  nextTick(() => {
    draw();
  });
};

// 监听变化
watch([xMin, xMax, yMin, yMax, sampleCount, showGrid, showAxes, showNumbers, functions], () => {
  plotFunctions();
}, { deep: true });

// 窗口大小变化
const handleResize = () => {
  plotFunctions();
};

// 组件挂载
onMounted(() => {
  plotFunctions();
  window.addEventListener('resize', handleResize);
});

// 组件卸载
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
.function-plotter {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.control-panel {
  width: 450px;
  background-color: #ffffff;
  border-right: 1px solid #e4e7ed;
  padding: 16px;

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #ecf5ff;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .section-card {
    margin-bottom: 16px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;
      color: #606266;
    }
  }

  .functions-list {
    .function-title {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 4px 0;
      border-left-width: 4px;
      border-left-style: solid;

      .function-expression {
        flex: 1;
        font-size: 0.9rem;
        color: #303133;
        margin-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .function-item {
      padding: 12px 0;

      .function-controls {
        display: flex;
        gap: 12px;
        margin-top: 12px;
        flex-wrap: wrap;

        .control-group {
          display: flex;
          align-items: center;
          gap: 6px;

          .label {
            font-size: 0.8rem;
            color: #909399;
          }
        }
      }

      .function-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
      }
    }
  }

  .axis-controls {
    .axis-item {
      margin-bottom: 16px;

      .axis-label {
        display: block;
        font-size: 0.9rem;
        color: #606266;
        margin-bottom: 8px;
      }

      .range-value {
        text-align: right;
        font-size: 0.8rem;
        color: #909399;
        margin-top: 4px;
      }
    }
  }

  .quick-views {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }

  .sample-control {
    .control-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .label {
        min-width: 60px;
        color: #606266;
      }

      .value {
        min-width: 45px;
        color: #409EFF;
        font-weight: 500;
      }
    }
  }

  .example-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px 0;

    .el-button {
      margin: 0;
      font-size: 0.8rem;
    }
  }

  .tips-card {
    background-color: #f4f4f5;
    border-color: #e9e9eb;

    :deep(.el-descriptions__cell) {
      padding: 6px 8px !important;
    }
  }

  .error-alert {
    margin-top: 12px;
  }
}

.plot-area {
  flex: 1;
  padding: 16px;
  position: relative;

  .plot-container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
    position: relative;

    .function-canvas {
      width: 100%;
      height: 100%;
      display: block;
      cursor: default;
      background-color: #ffffff;
    }

    .coordinates {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-family: monospace;
      z-index: 10;
    }
  }
}

// 自定义滚动条样式
:deep(.el-scrollbar__view) {
  height: 100%;
}

:deep(.el-collapse-item__header) {
  height: 48px;
  line-height: 48px;
  padding-left: 8px;
}

:deep(.el-collapse-item__content) {
  padding: 0 12px 12px;
}

// 响应式设计
@media (max-width: 1200px) {
  .control-panel {
    width: 380px;
  }
}

@media (max-width: 768px) {
  .function-plotter {
    flex-direction: column;
  }

  .control-panel {
    width: 100%;
    height: 50vh;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
  }

  .plot-area {
    height: 50vh;
    padding: 8px;
  }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
  .function-plotter {
    background-color: #1e1e1e;
  }

  .control-panel {
    background-color: #252526;
    border-right-color: #3e3e42;

    .panel-header {
      border-bottom-color: #3e3e42;

      .title {
        color: #ffffff;
      }
    }
  }

  .plot-area .plot-container {
    background-color: #1e1e1e;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);

    .function-canvas {
      background-color: #1e1e1e;
    }
  }
}
</style>