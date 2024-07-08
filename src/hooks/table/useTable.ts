import { reactive, toRefs } from 'vue';
import { Paging, ListResponse } from '@/api/types';
import { HttpResponse } from '@/utils/request';
import { Message, PaginationProps } from '@arco-design/web-vue';
import useLoading from '../loading';

type commonObj = Record<string, any>;

interface TableState<R = commonObj> {
  tableData: R[];
  totalAll: number;
}

interface TableBaseMethodsType<R extends object, T extends object> {
  requestApi: (params: Paging<T>) => Promise<HttpResponse<ListResponse<R>>>;
  deleteApi?: (...args: any[]) => Promise<HttpResponse>;
  otherSearchParams?: Omit<T, keyof Paging>;
}

// table的常见数据请求和分页交互
// 接收：表格数据的范型T, 请求方法以及参数
// 可选项: formRef: arco-form组件的ref, 传入ref可以正常使用表单相关的方法
// 抛出以下:
// 1、loading
// 2、pagination - 分页器配置项
// 3、分页器交互方法 - <handlePageChange>、<handleSizeChange>
// 4、表格数据 - <tableData>
// 5、表格数据请求方法 - <loadList>
// 6、表格查询参数 <ref>
export default function useTable<R extends object, T extends object>(config: TableBaseMethodsType<R, T>) {
  const { otherSearchParams = {}, requestApi, deleteApi } = config;
  const { loading, setLoading } = useLoading(false);

  const tableState = reactive<TableState<R>>({
    tableData: [],
    totalAll: 0,
  });

  // 分页参数
  const pageParams = reactive<Paging<T>>({
    page: 1,
    pageSize: 20,
    ...(otherSearchParams as T),
  });

  // 分页器配置项
  const pagination = computed<PaginationProps>(() => {
    return {
      total: tableState.totalAll,
      current: pageParams.page,
      pageSize: pageParams.pageSize,
      showTotal: true,
      showMore: true,
      showJumper: false,
      showPageSize: true,
      pageSizeOptions: [20, 30, 40, 50],
      size: 'medium',
    };
  });

  // 数据更新方法
  const loadList = async () => {
    const params = toRaw(pageParams);
    setLoading(true);
    try {
      const res = await requestApi(params as Paging<T>);
      const { success, data } = res;
      if (success) {
        const { list, total } = data;
        // @ts-ignore
        tableState.tableData = list;
        tableState.totalAll = total;
      }
    } catch (e) {
      tableState.tableData = [];
      tableState.totalAll = 0;
    } finally {
      setLoading(false);
    }
  };

  // 数据删除方法, 传id就行
  const handleDelete = async (data: R & { id: number }) => {
    if (!deleteApi) return;

    const { id } = data;
    try {
      const res = await deleteApi(id);
      const { success } = res;
      if (success) {
        Message.success('删除成功');
        if (tableState.tableData.length === 1 && pageParams.page > 1) {
          pageParams.page -= 1;
        }
        loadList();
      }
    } catch (e) {
      Message.error('出现异常, 请稍后再试');
    }
  };

  // table events
  // @page-change="handlePageChange" 绑定
  const handlePageChange = (current: number) => {
    pageParams.page = current;
    loadList();
  };
  // @page-size-change="handleSizeChange" 绑定
  const handleSizeChange = (size: number) => {
    pageParams.page = 1;
    pageParams.pageSize = size;
    loadList();
  };

  return {
    ...toRefs(tableState),
    ...toRefs(pageParams),
    loading,
    pagination,
    setLoading,
    handlePageChange,
    handleSizeChange,
    loadList,
    handleDelete,
  };
}
