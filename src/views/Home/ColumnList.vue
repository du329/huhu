<template>
    <div>
        <div class="row text-center">
            <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <img :src="column.avatar?.url" :alt="column.title"
                            class="rounded-circle border border-light mb-3">
                        <h5 class="card-title">{{ column.title }}</h5>
                        <p class="card-text">{{ column.description }}</p>
                        <router-link :to="{ name: 'columnDetail', params: { id: column._id } }"
                            class="btn btn-outline-primary">进入专栏</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ColumnProps } from '../../store'
export default defineComponent({
    name: 'ColumnList',
    props: {
        list: {
            type: Array as PropType<ColumnProps[]>,
            required: true
        }
    },
    setup(props) {
        const columnList = computed(() => {
            return props.list.map((cloumn) => {
                if (!cloumn.avatar) {
                    const imgUrl = new URL('../../assets/avatar.jpg', import.meta.url).href
                    cloumn.avatar = {
                        url: imgUrl
                    }
                } else {
                    // 阿里云 图片缩放
                    cloumn.avatar.url = cloumn.avatar.url + '?x-oxx-process=image/resize,mpad,h_50,w_50'
                }
                return cloumn
            })
        })

        return {
            columnList
        }
    }
})




</script>

<style scoped>
.card-body img {
    width: 50px;
    height: 50px;
}
</style>