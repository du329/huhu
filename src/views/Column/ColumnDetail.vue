<template>
    <div class="cloumn-detail-page max-auto">
        <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
            <div class="col-3 text-center">
                <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border" />
            </div>
            <div class="col-9">
                <h4>{{ column.title }}</h4>
                <p class="text-muted">{{ column.description }}</p>
            </div>
        </div>
        <PostList :list="postList" />
        <div class="text-center">
            <button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25" @click="loadMorePage"
                v-if="!isLastPage">
                加载更多...
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../../store/store'
import PostList from './PostList.vue';
import { useLoadMore } from '../../hooks/useLoadMore'

export default defineComponent({
    name: 'ColumnDetail',
    components: {
        PostList
    },
    setup() {
        const route = useRoute()
        const columnId = route.params.id as string
        const store = useStore<GlobalDataProps>()

        // 通过计算属性拿到初始值
        const total = computed(() => store.state.postList.loadedColumns[columnId]?.total)
        // const currentPage = computed(() => store.state.postList.loadedColumns[columnId]?.currentPage)
        const params = { currentPage: 1, pageSize: 5, columnId }
        onMounted(() => {
            store.dispatch('fetchColumn', columnId)
            store.dispatch('fetchPosts', params)
        })
        const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', total, { currentPage: 2, pageSize: 5, Id: columnId })
        return {
            column: computed(() => store.getters.getCurrentColumn(columnId)),
            postList: computed(() => store.getters.getPostList(columnId)),
            loadMorePage, isLastPage
        }
    }
})
</script>
<style scoped>
.column-info img {
    width: 200px;
    height: 200px;
}
</style>