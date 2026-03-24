import * as echarts from "echarts";
import {getStartAndEndDate} from "@/api/business/plans.js";

// 获取开始和结束日期范围
async function getCurrentMonthRange() {
    try {
        const response = await getStartAndEndDate();
        if (response.code === 200 && response.data) {
            const { startDate, endDate } = response.data;
            // 返回日期范围数组，ECharts日历组件需要这种格式
            return [startDate, endDate];
        }
    } catch (error) {
        console.error('获取开始和结束日期失败:', error);
    }
    
    // 如果API调用失败，返回默认的当前年份
    const now = new Date();
    const currentYear = now.getFullYear();
    return `${currentYear}`;
}

/**
 * 创建单年份的还款日历图表
 * @param {string} id - 容器元素ID
 * @param {Array} repaymentData - 还款数据数组
 * @param {string} year - 年份
 * @returns {Object} ECharts实例
 */
export async function createSingleYearCalendar(id, repaymentData = [], year) {
    const element = document.getElementById(id);
    
    // 检查是否已经有图表实例，如果有则销毁
    const existingChart = echarts.getInstanceByDom(element);
    if (existingChart) {
        existingChart.dispose();
    }
    
    const chart = echarts.init(element);
    
    // 生成单年的日期范围
    const dateRange = `${year}`;
    
    // 生成还款数据
    const heatmapData = [];
    const repaidHeatmapData = []; // 已还款数据
    const repaymentLabels = [];
    const repaidLabels = []; // 已还款标签

    for (let i = 0; i < repaymentData.length; i++) {
        const date = repaymentData[i][0];
        const amount = repaymentData[i][1];
        const count = repaymentData[i][2] || 1; // 还款笔数
        const status = repaymentData[i][3] || 1; // 还款状态，默认1（未还款）

        // 确保日期格式正确且属于指定年份
        if (date && amount && date.startsWith(year)) {
            if (status === 2) {
                // 已还款记录 - 绿色系列
                repaidHeatmapData.push([date, amount]);
                repaidLabels.push([date, 1, `${amount.toLocaleString()}`, '已还']);
            } else {
                // 未还款记录 - 红色系列
                heatmapData.push([date, amount]);
                repaymentLabels.push([date, 1, `${amount.toLocaleString()}`, '待还']);
            }
        }
    }

    const option = {
        backgroundColor: '#f9fafb',
        textStyle: {
            color: '#000000'
        },
        tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            textStyle: {
                color: '#000000'
            },
            formatter: function (params) {
                if (params.seriesType === 'heatmap') {
                    return `还款金额: ¥${params.value[1].toLocaleString()}`;
                }
                return params.value[2];
            }
        },
        visualMap: {
            show: false,
            min: 0,
            max: repaymentData.length > 0 ? Math.max(...repaymentData.map(item => item[1])) : 1000,
            calculable: true,
            seriesIndex: [2],
            orient: 'horizontal',
            left: 'center',
            bottom: 20,
            inRange: {
                color: ['#fff5f5', '#dc2626'],
                opacity: 0.6
            },
            controller: {
                inRange: {
                    opacity: 0.5
                }
            }
        },
        calendar: [
            {
                left: 'center',
                top: 'middle',
                cellSize: [50, 50],
                yearLabel: {
                    show: true,
                    margin: 20,
                    fontSize: 20,
                    color: '#333'
                },
                orient: 'horizontal',
                range: dateRange,
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: 'rgba(48,165,186,0.76)',
                        width: 2
                    }
                },
                dayLabel: {
                    show: true,
                    firstDay: 1,
                    nameMap: 'cn',
                    position: 'start',
                    margin: 0,
                    color: 'rgba(182,40,40,0.66)',
                    fontSize: 10,
                },
                monthLabel: {
                    nameMap: 'cn',
                    show: true,
                    position: 'start',
                    margin: 0,
                    color: 'rgba(182,40,40,0.66)',
                    fontSize: 12
                }
            }
        ],
        series: [
            {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 0,
                label: {
                    show: true,
                    formatter: function (params) {
                        try {
                            var d = new Date(params.value[0]);
                            return d.getDate() + '\n\n' + params.value[2] + '\n\n';
                        } catch (e) {
                            return '';
                        }
                    },
                    color: '#aa3939',
                    fontSize: 10,
                    fontWeight: 500
                },
                data: repaymentLabels,
                silent: true
            },
            {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 0,
                label: {
                    show: true,
                    formatter: function (params) {
                        return '\n\n\n' + (params.value[3] || '');
                    },
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#dc2626'
                },
                data: repaymentLabels,
                silent: true
            },
            {
                name: '还款金额',
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: heatmapData
            }
        ]
    };
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
    return chart;
}

/**
 * 创建带状态颜色的单年份还款日历图表
 * @param {string} id - 容器元素ID
 * @param {Array} repaymentData - 还款数据数组，格式：[日期, 金额, 笔数, 状态]
 * @param {string} year - 年份
 * @returns {Object} ECharts实例
 */
export async function createSingleYearCalendarWithStatus(id, repaymentData = [], year) {
    const element = document.getElementById(id);
    
    if (!element) {
        console.error(`图表容器 ${id} 不存在`);
        return null;
    }
    
    // 检查容器尺寸 - 如果宽度为0，尝试使用已设置的宽度
    if (element.clientWidth === 0) {
        // 检查是否有内联样式设置的宽度
        const inlineWidth = element.style.width;
        if (inlineWidth) {
            console.log(`容器 ${id} 使用内联样式宽度: ${inlineWidth}`);
        } else {
            console.warn(`图表容器 ${id} 宽度为0，无法初始化`);
            return null;
        }
    }
    
    if (element.clientHeight === 0) {
        console.warn(`图表容器 ${id} 高度为0，无法初始化`);
        return null;
    }
    
    // 检查是否已经有图表实例，如果有则销毁
    const existingChart = echarts.getInstanceByDom(element);
    if (existingChart) {
        existingChart.dispose();
    }
    
    const initHeight = element.clientHeight || parseInt(element.style.height) || 400;
    
    let chart;
    try {
        // 不传入固定width，让ECharts根据cellSize自动计算
        // 只传入height确保高度正确
        chart = echarts.init(element, null, {
            height: initHeight
        });
    } catch (error) {
        console.error(`初始化 ECharts 失败 (${id}):`, error);
        return null;
    }
    
    // 生成单年的日期范围
    const dateRange = `${year}`;
    
    // 生成还款数据
    const unpaidHeatmapData = []; // 未还款数据
    const paidHeatmapData = []; // 已还款数据
    const unpaidLabels = []; // 未还款标签
    const paidLabels = []; // 已还款标签

    for (let i = 0; i < repaymentData.length; i++) {
        const date = repaymentData[i][0];
        const amount = repaymentData[i][1];
        const count = repaymentData[i][2] || 1; // 还款笔数
        const status = repaymentData[i][3] || 1; // 还款状态，默认1（未还款）

        // 确保日期格式正确且属于指定年份
        if (date && amount && date.startsWith(year)) {
            if (status === 2) {
                // 已还款记录 - 绿色系列
                paidHeatmapData.push([date, amount]);
                paidLabels.push([date, 1, `${amount.toLocaleString()}`, '已还']);
            } else {
                // 未还款记录 - 红色系列
                unpaidHeatmapData.push([date, amount]);
                unpaidLabels.push([date, 1, `${amount.toLocaleString()}`, '待还']);
            }
        }
    }

    const cellSizeConfig = [40, 30]; // 配置的 cellSize
    // 计算日历需要的宽度：53周 × 7天 × 40px = 14840px
    const weeks = 53;
    const cellWidth = 5;
    const calendarWidth = weeks * 7 * cellWidth;
    const calendarTop = 50;
    
    const option = {
        backgroundColor: '#f9fafb',
        textStyle: {
            color: '#000000'
        },
        tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            textStyle: {
                color: '#000000'
            },
            formatter: function (params) {
                if (params.seriesType === 'heatmap') {
                    return `还款金额: ¥${params.value[1].toLocaleString()}`;
                }
                return params.value[2];
            }
        },
        visualMap: [
            {
                show: false,
                min: 0,
                max: repaymentData.length > 0 ? Math.max(...repaymentData.map(item => item[1])) : 1000,
                calculable: true,
                seriesIndex: [2], // 未还款热力图
                orient: 'horizontal',
                left: 'center',
                bottom: 20,
                inRange: {
                    color: ['#fff5f5', '#dc2626'], // 红色系列
                    opacity: 0.6
                },
                controller: {
                    inRange: {
                        opacity: 0.5
                    }
                }
            },
            {
                show: false,
                min: 0,
                max: repaymentData.length > 0 ? Math.max(...repaymentData.map(item => item[1])) : 1000,
                calculable: true,
                seriesIndex: [5], // 已还款热力图
                orient: 'horizontal',
                left: 'center',
                bottom: 20,
                inRange: {
                    color: ['#f0fdf4', '#22c55e'], // 绿色系列
                    opacity: 0.6
                },
                controller: {
                    inRange: {
                        opacity: 0.5
                    }
                }
            }
        ],
        calendar: [
            {
                // 显式设置width，强制ECharts使用指定的cellSize
                top: calendarTop,  // 改为固定像素值
                width: calendarWidth, // 显式设置宽度，确保cellSize不被调整
                cellSize: cellSizeConfig, // 固定cellSize，不让ECharts自动调整
                yearLabel: {
                    show: true,
                    margin: 30,
                    fontSize: 20,
                    color: '#333'
                },
                orient: 'horizontal',
                range: dateRange,
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: 'rgba(48,165,186,0.76)',
                        width: 2
                    }
                },
                dayLabel: {
                    show: true,
                    firstDay: 1,
                    nameMap: 'cn',
                    position: 'start',
                    margin: 0,
                    color: 'rgba(182,40,40,0.66)',
                    fontSize: 10,
                },
                monthLabel: {
                    nameMap: 'cn',
                    show: true,
                    position: 'start',
                    margin: 0,
                    color: 'rgba(182,40,40,0.66)',
                    fontSize: 12
                },
                // 确保日历图表能够正确计算宽度
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#ddd'
                }
            }
        ],
        series: [
            // 未还款标签
            {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 0,
                label: {
                    show: true,
                    formatter: function (params) {
                        try {
                            var d = new Date(params.value[0]);
                            return d.getDate() + '\n\n' + params.value[2] + '\n\n';
                        } catch (e) {
                            return '';
                        }
                    },
                    color: '#aa3939',
                    fontSize: 10,
                    fontWeight: 500
                },
                data: unpaidLabels,
                silent: true
            },
            // 未还款状态标签
            {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 0,
                label: {
                    show: true,
                    formatter: function (params) {
                        return '\n\n\n' + (params.value[3] || '');
                    },
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#dc2626'
                },
                data: unpaidLabels,
                silent: true
            },
            // 未还款热力图
            {
                name: '待还金额',
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: unpaidHeatmapData
            },
            // 已还款标签
            {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 0,
                label: {
                    show: true,
                    formatter: function (params) {
                        try {
                            var d = new Date(params.value[0]);
                            return d.getDate() + '\n\n' + params.value[2] + '\n\n';
                        } catch (e) {
                            return '';
                        }
                    },
                    color: '#16a34a',
                    fontSize: 10,
                    fontWeight: 500
                },
                data: paidLabels,
                silent: true
            },
            // 已还款状态标签
            {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 0,
                label: {
                    show: true,
                    formatter: function (params) {
                        return '\n\n\n' + (params.value[3] || '');
                    },
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#22c55e'
                },
                data: paidLabels,
                silent: true
            },
            // 已还款热力图
            {
                name: '已还金额',
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: paidHeatmapData
            }
        ]
    };
    
    try {
    chart.setOption(option);
    
        // 监听窗口大小变化
        const resizeHandler = () => {
            if (chart && !chart.isDisposed()) {
                chart.resize();
            }
        };
        window.addEventListener('resize', resizeHandler);
        // 存储 resize handler 以便后续清理（如果需要）
        chart._resizeHandler = resizeHandler;
    return chart;
    } catch (error) {
        console.error(`设置图表选项失败 (${id}):`, error);
        if (chart) {
            chart.dispose();
        }
        return null;
    }
}

/**
 * 创建带dataZoom功能的还款日历图表（保留原有功能）
 * @param {string} id - 容器元素ID
 * @param {Array} repaymentData - 还款数据数组
 * @returns {Object} ECharts实例
 */
export async function createRepaymentCalendar(id, repaymentData = []) {
    const element = document.getElementById(id);
    
    // 检查是否已经有图表实例，如果有则销毁
    const existingChart = echarts.getInstanceByDom(element);
    if (existingChart) {
        existingChart.dispose();
    }
    
    const chart = echarts.init(element);
    
    // 获取日期范围
    const dateRange = await getCurrentMonthRange();
    
    // 生成还款数据
    const heatmapData = [];
    const repaymentLabels = [];

    for (let i = 0; i < repaymentData.length; i++) {
        const date = repaymentData[i][0];
        const amount = repaymentData[i][1];
        const count = repaymentData[i][2] || 1; // 还款笔数

        // 确保日期格式正确
        if (date && amount) {
            heatmapData.push([date, amount]);
            repaymentLabels.push([date, 1, `${amount.toLocaleString()}`]);
        }
    }

    const option = {
        backgroundColor: '#f9fafb',
        textStyle: {
            color: '#000000'
        },
        tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            textStyle: {
                color: '#000000'
            },
            formatter: function (params) {
                if (params.seriesType === 'heatmap') {
                    return `还款金额: ¥${params.value[1].toLocaleString()}`;
                }
                return params.value[2];
            }
        },
        visualMap: {
            show: false,
            min: 0,
            max: repaymentData.length > 0 ? Math.max(...repaymentData.map(item => item[1])) : 1000,
            calculable: true,
            seriesIndex: [2],
            orient: 'horizontal',
            left: 'center',
            bottom: 20,
            inRange: {
                color: ['#fff5f5', '#dc2626'],
                opacity: 0.6
            },
            controller: {
                inRange: {
                    opacity: 0.5
                }
            }
        },
        calendar: [
            {
                left: 'center',
                top: 'middle',
                cellSize: [40, 40],
                yearLabel: {
                    show: true,
                    margin: 50,
                    fontSize: 30,
                    color: '#333'
                },
                orient: 'horizontal',
                range: dateRange,
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: 'rgba(48,165,186,0.76)',
                        width:3
                    }
                },
                dayLabel: {
                    show: true,
                    firstDay: 1,
                    nameMap: 'cn',
                    position: 'start',
                    margin: 0,
                    color: 'rgba(182,40,40,0.66)',
                    fontSize: 12,

                },
                monthLabel: {
                    nameMap: 'cn',
                    show: true,
                    position: 'start',
                    margin: 0,
                    color: 'rgba(182,40,40,0.66)',
                    fontSize: 14
                }
            }
        ],
        series: [
            {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 0,
                label: {
                    show: true,
                    formatter: function (params) {
                        try {
                            var d = new Date(params.value[0]);
                            return d.getDate() + '\n\n' + params.value[2] + '\n\n';
                        } catch (e) {
                            return '';
                        }
                    },
                    color: '#aa3939',
                    fontSize: 12,
                    fontWeight: 500
                },
                data: repaymentLabels,
                silent: true
            },
            {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 0,
                label: {
                    show: true,
                    formatter: function (params) {
                        return '\n\n\n' + (params.value[3] || '');
                    },
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#dc2626'
                },
                data: repaymentLabels,
                silent: true
            },
            {
                name: '还款金额',
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: heatmapData
            }
        ]
    };
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
    return chart;
}