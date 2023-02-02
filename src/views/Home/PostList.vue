<template>
    <div class="post-list">
        <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
            <router-link :to="{
                name: 'postDetail', params: {
                    postId: post._id
                }
            }">
                <div class="card-body">
                    <h4>{{ post.title }}</h4>
                    <div class="row my-3 align-items-center">
                        <div v-if="post.image">
                            <img :src="(post.image?.url)" :alt="post.title" class="rounded-lg" />
                        </div>
                        <p :class="{ 'col-8': post.image }">{{ post.excerpt }}</p>
                    </div>
                    <span class="text-muted">{{ post.createdAt }}</span>
                </div>
            </router-link>
        </article>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PostProps } from '../../store/store'

export default defineComponent({
    name: 'PostList',
    props: {
        list: {
            type: Array as PropType<PostProps[]>,
            required: true
        }
    },
    setup() { }
})
</script>
<style scoped>
.card-body .row div {
    width: 25%;
}

.card-body .row img {
    width: 100%;
}
</style>