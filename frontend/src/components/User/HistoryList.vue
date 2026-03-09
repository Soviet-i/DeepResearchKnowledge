<template>
  <div class="history-list">
    <div class="list-header">
      <h3 class="list-title">操作历史</h3>
      <button 
        class="btn btn-danger btn-sm"
        @click="clearAllHistory"
        :disabled="isLoading || historyList.length === 0"
      >
        清空全部
      </button>
    </div>

    <div v-if="isLoading" class="loading-text">加载中...</div>
    <div v-else-if="emptyMsg" class="empty-text">{{ emptyMsg }}</div>
    <div v-else class="history-items">
      <div 
        v-for="item in historyList" 
        :key="item.id"
        class="history-item"
      >
        <div class="item-content">
          <span class="item-type">{{ item.type }}</span>
          <span class="item-time">{{ formatTime(item.createTime) }}</span>
          <span class="item-desc">{{ item.description }}</span>
        </div>
        <button 
          class="btn btn-sm btn-outline-danger"
          @click="deleteHistory(item.id)"
        >
          删除
        </button>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="pagination">
      <button 
        class="page-btn"
        :disabled="page === 1"
        @click="changePage(page - 1)"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ page }} 页 / 共 {{ Math.ceil(total / pageSize) }} 页
      </span>
      <button 
        class="page-btn"
        :disabled="page >= Math.ceil(total / pageSize)"
        @click="changePage(page + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserHistory } from '@/composables/useUserHistory';
import { format } from 'date-fns'; // 假设使用date-fns处理时间

const {
  historyList,
  isLoading,
  emptyMsg,
  page,
  pageSize,
  total,
  changePage,
  deleteHistory,
  clearAllHistory
} = useUserHistory();

// 格式化时间
const formatTime = (time: string) => {
  return format(new Date(time), 'yyyy-MM-dd HH:mm');
};
</script>
