import { useStore } from "vuex";
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
    currentPage: number,
    pageSize: number,
    Id?: string
}
export const useLoadMore = (
    actionName: string,
    total: ComputedRef<number>,
    params: LoadParams

) => {
    const store = useStore()
    // 请求页
    const currentPage = ref(params.currentPage)
    // 请求参数
    const requestPatams = computed(() => ({
        currentPage: currentPage.value,
        pageSize: params.pageSize
    }))

    // 加载更多函数
    const loadMorePage = () => {
        store.dispatch(actionName, { columnId: params.Id, ...requestPatams.value }).then(() => {
            // 请求成功 请求页+1
            currentPage.value++
        })
    }
    const isLastPage = computed(() => {
        // 向上取整 (15 / 3 )
        return Math.ceil(total.value / params.pageSize) < currentPage.value
    })

    return {
        loadMorePage,
        isLastPage,
        currentPage
    }
}