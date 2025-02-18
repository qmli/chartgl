import { makeContentBox } from '../core/svgLayer';
import { ChartGLPlugin } from '.';

export const splitLine: ChartGLPlugin<void> = {
    apply(chart) {
        // 创建内容框作为图表的主容器
        const contentBox = makeContentBox(chart.model, chart.options);

        // 创建初始变换（用于设置线条的位置）
        const initTrans = createSVGTransform(0, 0, contentBox);

        // 创建并添加线条
        const hLine = createLine(initTrans, 100, 'blue', 2, 150);
        const hLine2 = createLine(initTrans, 100, 'blue', 2, 250);

        const vhLine = createHLine(initTrans, 100, 'blue', 2, 150);
        const vhLine2 = createHLine(initTrans, 100, 'blue', 2, 250);

        // 创建一个组，将线条元素添加到该组中
        const group = createGroup([hLine, hLine2, vhLine, vhLine2]);

        // 设置拖动行为
        addDragListener(hLine, contentBox, chart, "horizontal");
        addDragListener(hLine2, contentBox, chart,"horizontal");

        // 设置拖动行为
        addDragListener(vhLine, contentBox, chart, 'vertical');
        addDragListener(vhLine2, contentBox, chart, 'vertical');

        // 将组添加到内容框并插入到 SVG 层中
        contentBox.appendChild(group);
        chart.svgLayer.svgNode.appendChild(contentBox);
    }
};

// 工具函数：创建一个 SVG 变换
function createSVGTransform(x: number, y: number, contentBox: SVGSVGElement): SVGTransform {
    const transform = contentBox.createSVGTransform();
    transform.setTranslate(x, y);
    return transform;
}

// 工具函数：创建一个带有特定属性的 SVG 线条
function createLine(transform: SVGTransform, widthPercentage: number, color: string, strokeWidth: number, translateY: number): SVGLineElement {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.transform.baseVal.initialize(transform);
    line.x2.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, widthPercentage);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", strokeWidth.toString());
    line.style.cursor = "move"; // 添加鼠标样式以指示可以移动
    line.transform.baseVal.getItem(0).setTranslate(0, translateY);
    return line;
}

// 工具函数：创建一个带有特定属性的 SVG 线条
function createHLine(transform: SVGTransform, widthPercentage: number, color: string, strokeWidth: number, translateY: number): SVGLineElement {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.transform.baseVal.initialize(transform);
    line.y2.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, widthPercentage);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", strokeWidth.toString());
    line.style.cursor = "move"; // 添加鼠标样式以指示可以移动
    line.transform.baseVal.getItem(0).setTranslate(translateY, 0);
    return line;
}

// 工具函数：创建一个 <g> 组并将 SVG 元素添加到其中
function createGroup(elements: SVGElement[]): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('split-line'); // 添加 CSS 类
    elements.forEach(element => g.appendChild(element));
    return g;
}

function addDragListener(line: SVGLineElement, contentBox: SVGSVGElement, chart: any, direction: 'horizontal' | 'vertical'): void {
    let isDragging = false;
    let initialY: number = 0;  // 记录初始位置
    let initialTranslateY: number = 0;  // 记录初始的线条Y坐标偏移

    line.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialY = e.clientY;  // 记录初始的鼠标Y位置
        initialTranslateY = line.transform.baseVal.getItem(0).matrix.f;  // 获取当前线条的Y偏移
        line.style.cursor = "grabbing";  // 设置鼠标样式为抓取状态
    });

    chart.svgLayer.svgNode.addEventListener('mousemove', (ev: {
        clientX: number; clientY: number;
    }) => {
        if (isDragging) {
            const contentRect = contentBox.getBoundingClientRect();
            const deltaY = ev.clientY - initialY;  // 计算鼠标的偏移
            const newTranslateY = initialTranslateY + deltaY;  // 计算新的Y坐标
            if (direction === 'horizontal') {
                // 更新线条的位置
                line.transform.baseVal.getItem(0).setTranslate(0, newTranslateY);
                console.log('horizontal');
            } else if (direction === 'vertical') {
                line.transform.baseVal.getItem(0).setTranslate(ev.clientX - contentRect.x, 0);
                console.log('vertical');
            }


        }
    });

    chart.svgLayer.svgNode.addEventListener('mouseup', () => {
        isDragging = false;
        line.style.cursor = "move";  // 恢复鼠标样式为移动
    });
}



