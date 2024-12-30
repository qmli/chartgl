

## 性能

利用最新的 WebGL 技术，我们可以直接与 GPU 进行通信，突破浏览器中渲染图表性能的极限。这个库可以显示几乎无限的数据点，并且能够以 60 帧每秒的速度处理用户交互（平移/缩放）。

我们将该库的性能与其他一些流行的库进行了比较。请参阅“性能”部分。
## 使用方式

### 安装

* 使用 npm

  ```shell
  npm install chartgl
  ```

### 基础

显示一个带坐标轴的基本折线图。

```HTML
<div id="chart" style="width: 100%; height: 640px;"></div>
```
```JavaScript
const el = document.getElementById('chart');
const data = [];
for (let x = 0; x < 100; x++) {
    data.push({x, y: Math.random()});
}
const chart = new ChartGL(el, {
    series: [{ data }],
});
```

ChartGL 采用模块化设计，几乎所有功能都作为插件实现。
你可以选择需要的插件，这样就不会为未使用的功能付费。

插件:
* lineChart: 使用 WebGL 绘制折线图。
* d3Axis: 与 [d3-axis](https://github.com/d3/d3-axis) 集成，绘制坐标轴。
* legend: 在右上角显示图例。
* crosshair: 在鼠标下显示十字线。
* nearestPoint: 高亮显示每个系列中最接近鼠标的数据点。
* chartZoom: 响应鼠标、键盘、触摸事件来缩放/平移图表。另请参见交互方法。
例如，要组装一个包含所有官方插件的图表：
```JavaScript
import ChartGL from 'chartgl/core';
import { lineChart } from 'chartgl/plugins/lineChart';
import { d3Axis } from 'chartgl/plugins/d3Axis';
import { legend } from 'chartgl/plugins/legend';
import { crosshair } from 'chartgl/plugins/crosshair';
import { nearestPoint } from 'chartgl/plugins/nearestPoint';
import { ChartGLZoomPlugin } from 'chartgl/plugins/chartZoom';

const el = document.getElementById('chart');
const chart = new ChartGL(el, {
    data: {...},
    plugins: {
        lineChart,
        d3Axis,
        legend,
        crosshair,
        nearestPoint,
        zoom: new ChartGLZoomPlugin({...}),
        tooltip: new ChartGLTooltipPlugin({...}),
    }
});
```
### 动态数据
要动态添加/删除数据，只需使用常规的数组原型方法修改数据数组，然后调用 chart.update()。

数据操作的一些限制：

数据数组的原型将被覆盖。此数组的长度只能通过以下覆盖的数组原型方法修改：push、pop、shift、unshift、splice。
如果通过其他方式改变数组的长度，行为是未定义的。
一旦调用 update，数据将同步到 GPU。之后，这些数据无法修改，只能从两端删除。
通过覆盖的 splice 原型方法进行非法修改将导致异常。其他非法修改将导致未定义的行为。
任何尚未同步到 GPU 的数据可以随意修改。

  ```JavaScript
  const data = [...];  // Assume it contains 10 data points
  const chart = new ChartGL(el, {
      series: [{ data }],
  });
  data.push({x, y}, {x, y}, {x, y});  // OK
  data.splice(-2, 1);  // OK, data not synced yet
  chart.update();

  data.splice(-2, 1);  // RangeError
  data.splice(-2, 2);  // OK, delete the last two data points
  data.pop();          // OK, delete the last data point
  data.splice(0, 2);   // OK, delete the first two data points
  chart.update();      // See data deleted

  Array.prototype.pop.call(data)  // Wrong. Only the overridden methods should be used
  data.length = 3;     // Wrong. Changes cannot be tracked
  data[3] = {x, y};    // Wrong unless data[3] is already in array and not synced to GPU
  ```
* 每个数据点的 x 值必须是单调递增的。
* 由于单精度浮点数的限制，如果 x 的绝对值较大（例如 Date.now()），你可能需要使用 baseTime 选项（见下文）来确保图表正确渲染。
  ```JavaScript
  let startTime = Date.now(); // Set the start time e.g.   1626186924936

  let bar = []; // holds the series data

  // build the chart
  const chart = new ChartGL(el, {
      series: [{
          name: 'foo',
          data: bar
      }],
      baseTime: startTime,
  });

  // update data
  bar.push({x: 1, y: 10}); // 1ms after start time
  bar.push({x: 43, y: 6.04}); // 43ms after start time
  bar.push({x: 89, y: 3.95}); // 89ms after start time

  // update chart
  chart.update();
  ```

### 全局选项

在顶级选项对象中指定这些选项。例如，要指定`lineWidth`:
```JavaScript
const chart = new ChartGL(el, {
    series: [{ data }],
    lineWidth: 10,
});
```

* lineWidth (number): 每个数据系列的默认线宽.

  default: 1

* backgroundColor (CSS color specifier or [d3-color](https://github.com/d3/d3-color) instance)

  default: 'transparent'

* color (CSS color specifier or [d3-color](https://github.com/d3/d3-color) instance): line color

  default: `color` 初始化时的 CSS 属性值.

* paddingTop / paddingRight / paddingLeft / paddingBottom (number):添加到图表区域的内边距，单位为 CSS 像素。同时为坐标轴保留空间.

  default: 10 / 10 / 45 / 20

* renderPaddingTop / renderPaddingRight / renderPaddingLeft / renderPaddingBottom (number): 类似于 padding* 对应项，但适用于 WebGL 渲染画布.

  default: 0

* xRange / yRange ({min: number, max: number} or 'auto'): x 轴 / y 轴的范围。也可以使用此项来程序化控制平移 / 缩放。指定 'auto' 可以自动根据数据计算这些范围。超出这些范围的数据点将绘制在内边距区域，以尽可能多地显示数据给用户。

  default: 'auto'

* realTime (boolean): 如果为 true，则在每一帧将 xRange 移动到最新的数据点.

  default: false

* baseTime (number): 自 new Date(0) 以来的毫秒数。数据中的每个 x 都相对于这个值。设置此选项并保持 x 的绝对值较小，以提高浮点数精度.

  default: 0

* xScaleType (() => Scale): 一个工厂方法，返回一个符合 d3-scale 接口的对象。可用于自定义 x 轴的外观.
[`scaleTime`](https://github.com/d3/d3-scale#time-scales),
[`scaleUtc`](https://github.com/d3/d3-scale#scaleUtc),
[`scaleLinear`](https://github.com/d3/d3-scale#linear-scales)
来自 d3-scale 的已知有效.

  default: d3.scaleTime

* debugWebGL (boolean): 如果为 true，检测 WebGL 调用中的任何错误。大多数 WebGL 调用是异步的，检测错误会强制同步，这可能会导致程序变慢。主要用于本库的开发过程中

  default: false

* legend (boolean): 如果为 true，显示图例.

  default: true

### 系列选项

在系列选项对象中指定这些选项。例如，要指定 `lineWidth`:
```JavaScript
const chart = new ChartGL(el, {
    series: [{
        data,
        lineWidth: 10,
    }],
});
```

* data ({x: number, y: number}[]): 要绘制的数据点数组。x 是自某个时间点以来经过的毫秒数 `baseTime`

* lineWidth (number or undefined): 如果未定义，使用全局选项.

  default: undefined

* lineType (number): 选择以下之一:
  * LineType.Line: 连接数据点的直线
  * LineType.Step: 阶梯函数，只有水平线和垂直线
  * LineType.NativeLine: 类似于 LineType.Line，但使用原生 WebGL 线条绘制功能。这个方法比 LineType.Line 更快，但在大多数设备上，线宽固定为 1 像素
  * LineType.NativePoint: 使用原生 WebGL 点绘制功能在每个数据点处绘制点。在这种情况下，lineWidth 被重新用于指定点的大小.

  default: LineType.Line

* stepLocation (number): 仅在 lineType === LineType.Step 时有效。指定垂直线绘制的位置，作为两个相邻数据点之间距离的比例。通常范围在 [0, 1] 之间.

  default: 0.5

* name (string): 系列的名称。将显示在图例和工具提示中.

  default: ''

* color (CSS color specifier or [d3-color](https://github.com/d3/d3-color) instance or undefined): line color.如果未定义，使用全局选项.

  default: undefined

* visible (boolean): 该系列是否可见

  default: true

### Zoom Options

这些选项启用内置的触摸 / 鼠标 / 触控板交互支持。x 轴和 y 轴可以分别启用.

在缩放选项对象中指定这些选项. 例如，要指定 `autoRange`:
```JavaScript
const chart = new ChartGL(el, {
    series: [{ data }],
    zoom: {
        x: {
            autoRange: true,
        },
        y: {
            autoRange: true,
        }
    }
});
```

如果您正在使用插件，请将这些选项传递给 ChartGLZoomPlugin 插件.
```JavaScript
import ChartGL from 'chartgl/core';
import { ChartGLZoomPlugin } from 'chartgl/plugins/chartZoom';
const chart = new ChartGL(el, {
    series: [{ data }],
    plugins: {
        zoom: new ChartGLZoomPlugin({x: {autoRange: true}})
    },
});
```

* panMouseButtons (number): 允许触发平移的鼠标按钮。参见 [MouseEvent.buttons](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)

  default: 1 | 2 | 4

* touchMinPoints (number): 触摸手势需要的最小触摸点数，以便图表响应该手势。如果您想为其他插件（例如 selectZoom）保留某些手势，则此选项非常有用.

  default: 1

* autoRange (boolean): 每个坐标轴。自动确定 maxDomain 和 minDomain.

  default: false

* maxDomain / minDomain (number):每个坐标轴。xRange / yRange 的最大 / 最小限制。

  default: Infinity / -Infinity

* maxDomainExtent / minDomainExtent (number): 每个坐标轴。xRange / yRange 中 max - min 的限制

  default: Infinity / 0

### 工具提示选项

```JavaScript
const chart = new ChartGL({
    ...,
    tooltip: { enabled: true }
})
```
Or
```JavaScript
import ChartGL from 'chartgl/core';
import { ChartGLTooltipPlugin } from 'chartgl/plugins/tooltip';
const chart = new ChartGL(el, {
    ...,
    plugins: {
        tooltip: new ChartGLTooltipPlugin({ enabled: true, xLabel: 'Time' })
    },
});
```

* enabled (boolean): 是否在悬停时启用工具提示

  default: false

* xLabel (string): 工具提示中 X 轴的标签

  default: "X"

* xFormatter ((number) => string): 用于格式化工具提示中 X 轴值的函数

  default: x => x.toLocaleString()

### 方法

* `chart.update()`: 在某些选项更改后请求更新。您可以根据需要调用此函数多次。实际更新每帧只会发生一次.

* `chart.dispose()`: 释放此图表实例使用的所有资源.
  Note: 我们使用 Shadow DOM 来保护图表免受意外的样式冲突。然而，在销毁后，无法轻松移除 Shadow DOM.

* `chart.onResize()`: 在布局变化后计算大小。当窗口大小变化时，此方法会自动调用。然而，如果有一些 ChartGL 无法感知的布局变化，您需要手动调用此方法.

## 交互

##### With touch screen:
* 单指平移
* 两指或更多指平移和缩放
##### With mouse:
* 左键拖动平移
* 滚轮滚动平移 X 轴
* 按住 Alt 键 + 滚轮滚动平移 Y 轴
* 按住 Ctrl 键 + 滚轮滚动缩放 X 轴
* 按住 Ctrl + Alt 键 + 滚轮滚动缩放 Y 轴
* 按住 Shift 键加速平移或缩放 5 倍
##### With trackpad:

* 在 X 或 Y 方向平移以平移 X 轴
* 按住 Alt 键 + 在 X/Y 方向平移以平移 X/Y 轴
* 捏合手势缩放 X 轴
* 按住 Alt 键 + 捏合手势缩放 Y 轴
* 按住 Shift 键加速平移或缩放 5 倍

## 样式设置

图表位于 Shadow DOM 中，因此主文档中的大多数 CSS 无法影响它。但我们提供了一些样式设置接口.

例如，我们可以轻松支持暗黑模式:

```HTML
<div id="chart" class="dark-theme"></div>
```
```CSS
.dark-theme {
    color: white;
    background: black;
    --background-overlay: black;
}
```

`--background-overlay` CSS 属性用于图表顶部的某些非透明元素。

图表的背景默认是透明的。 因此，通过设置父元素的背景可以轻松更改背景。

所有前景元素将会根据 color CSS 属性改变颜色。 然而，图表是绘制在 canvas 上的，无法响应 CSS 属性的变化。 如果在初始化后想要更改颜色，您需要手动更改颜色
