/**
 * y轴滚动条配置
 * @param size 一页显示多少个数据
 * @returns dataZoom配置项
 */
export const getYsilderOpt = (size: number) => {
  return {
    dataZoom: [
      {
        yAxisIndex: 0,
        show: true,
        weight: 2,
        type: 'inside',
        startValue: 0,
        endValue: size - 1,
        zoomOnMouseWheel: false,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
      },
      {
        yAxisIndex: 0,
        show: true,
        type: 'slider',
        fillerColor: 'rgba(17, 100, 210, 1)',
        borderColor: 'rgba(17, 100, 210, 0.1)',
        zoomLock: true,
        handleSize: 10,
        width: 10,
        heigh: 10,
        bottom: 2,
        backgroundColor: 'rgba(255,255,255,.4)',
        brushSelect: false,
        showDetail: false,
        showDataShadow: false,
      },
    ],
  };
};

export const todo = {};
