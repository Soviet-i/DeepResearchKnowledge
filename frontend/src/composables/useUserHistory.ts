import { ref, onMounted } from 'vue';
import axios from 'axios';

export function useUserHistory() {
  const historyList = ref([]);
  const isLoading = ref(false);
  const emptyMsg = ref('');
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);

  // 获取历史记录
  const fetchHistory = async () => {
    isLoading.value = true;
    emptyMsg.value = '';
    try {
      const response = await axios.get('/user/history', {
        params: { page: page.value, pageSize: pageSize.value }
      });
      historyList.value = response.data.list;
      total.value = response.data.total;
      if (response.data.list.length === 0) {
        emptyMsg.value = '暂无历史记录';
      }
    } catch (err) {
      emptyMsg.value = '获取历史记录失败';
      console.error('获取历史失败', err);
    } finally {
      isLoading.value = false;
    }
  };

  // 分页切换
  const changePage = (newPage: number) => {
    page.value = newPage;
    fetchHistory();
  };

  // 删除单条历史
  const deleteHistory = async (id: string) => {
    try {
      await axios.delete(`/user/history/${id}`);
      // 重新获取列表
      fetchHistory();
    } catch (err) {
      console.error('删除历史失败', err);
      alert('删除失败，请稍后重试');
    }
  };

  // 清空历史
  const clearAllHistory = async () => {
    if (!confirm('确定清空所有历史记录？')) return;
    try {
      await axios.delete('/user/history');
      fetchHistory();
    } catch (err) {
      console.error('清空历史失败', err);
      alert('清空失败，请稍后重试');
    }
  };

  // 初始化加载
  onMounted(() => {
    fetchHistory();
  });

  return {
    historyList,
    isLoading,
    emptyMsg,
    page,
    pageSize,
    total,
    fetchHistory,
    changePage,
    deleteHistory,
    clearAllHistory
  };
}
