import { ECElementEvent } from 'echarts';

// @ts-ignore
function useAutoHighlight(chartDom, options, delay = 3000) {
  if (!Object.keys(options).length) return null;

  const dataLen = options.series[0].data.length;
  // 循环高亮逻辑
  let timer: NodeJS.Timer | null;
  let curIndex = -1;
  const highlightPie = () => {
    if (!chartDom.value) return;
    // 清空已有高亮
    for (let i = 0; i < dataLen; i += 1) {
      chartDom.value.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: i,
      });
    }
    // 高亮当前
    chartDom.value.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: curIndex,
    });
    // 显示toolTip
    chartDom.value.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: curIndex,
    });
  };
  const highlightMouseoverFn = (params?: ECElementEvent) => {
    if (!params) return;
    // @ts-ignore
    if (Object.hasOwnProperty.call(params, 'dataIndex')) {
      curIndex = params.dataIndex;
      highlightPie();
    }
  };
  const highlightMouseoutFn = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    timer = setInterval(() => {
      curIndex = (curIndex + 1) % dataLen;
      highlightPie();
    }, delay);
  };

  // @ts-ignore
  if (!timer) {
    timer = setInterval(() => {
      curIndex = (curIndex + 1) % dataLen;
      highlightPie();
    }, delay);
  }
  return {
    timer,
    highlightMouseoverFn,
    highlightMouseoutFn,
  };
}

export default useAutoHighlight;
