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
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../../store'
import PostList from './PostList.vue';

export default defineComponent({
    name: 'ColumnDetail',
    components: {
        PostList
    },
    setup() {
        const route = useRoute()
        const columnId = route.params.id
        const store = useStore<GlobalDataProps>()
        onMounted(() => {
            store.dispatch('fetchPosts', columnId)
        })
        return {
            column: computed(() => store.getters.getColumnById(columnId)),
            postList: computed(() => store.state.postList)
        }
    }
})
</script>
<style scoped>
.column-info img{
    width: 200px;
    height: 200px;
}

</style>