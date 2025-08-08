import { axisBottom, axisLeft } from 'd3-axis'; // 导入 D3 的轴生成函数
import { select } from "d3-selection"; // 导入 D3 的选择器函数
import { ChartGLPlugin } from "."; // 导入 ChartGL 插件的类型定义

// 定义一个 ChartGL 插件，用于在图表中添加 D3 轴
export const d3Axis: ChartGLPlugin = {
    apply(chart) {
        // 选择 SVG 图层的根节点
        const d3Svg = select(chart.svgLayer.svgNode);
        // 在 SVG 中添加两个 <g> 元素，分别用于 X 轴和 Y 轴
        const xg = d3Svg.append('g');
        const yg = d3Svg.append('g');

        // 创建 X 轴和 Y 轴，绑定到图表模型的比例尺
        const xAxis = axisBottom(chart.model.xScale); // 底部 X 轴
        const yAxis = axisLeft(chart.model.yScale); // 左侧 Y 轴

        // 定义更新函数，用于在数据或配置变化时更新轴
        function update() {
            const xs = chart.model.xScale; // 获取当前的 X 轴比例尺
            // 设置 X 轴的刻度大小和格式化函数
            const xts = chart.options.xScaleType() // 根据配置生成新的 X 轴比例尺
                .domain(xs.domain().map((d: number) => d + chart.options.baseTime)) // 调整域值
                .range(xs.range()); // 保持范围不变
            xAxis.scale(xts); // 将新的比例尺应用到 X 轴
            xg.call(xAxis); // 渲染 X 轴到对应的 <g> 元素
            // 如果启用了网格选项，则设置 Y 轴的刻度大小为负值以绘制网格线
            if (chart.options.grid) {
                yAxis.scale(chart.model.yScale).tickSize(-chart.canvasLayer.canvas.width);
            } else {
                yAxis.scale(chart.model.yScale); // 否则仅更新比例尺
            }
            yg.call(yAxis); // 渲染 Y 轴到对应的 <g> 元素
        }

        // 监听图表模型的更新事件，触发更新函数
        chart.model.updated.on(update);

        // 监听图表尺寸变化事件，调整轴的位置并更新
        chart.model.resized.on((w, h) => {
            const op = chart.options; // 获取图表配置
            // 设置 X 轴的垂直位置
            xg.attr('transform', `translate(0, ${h - op.paddingBottom})`);
            // 设置 Y 轴的水平位置
            yg.attr('transform', `translate(${op.paddingLeft}, 0)`);

            update(); // 调用更新函数以重新渲染轴
        });
    }
}
