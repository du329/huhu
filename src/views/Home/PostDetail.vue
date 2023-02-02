<template>
    <div class="post-detail-page">
        <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
            <img :src="currentImage" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImage">
            <h2 class="mb-4">{{ currentPost.title }}</h2>
            <div class="user-profile-component border-top border-bottom py-3 mb-3 align-items-center row g-0">
                <div class="col">
                    <UserProfile :author="currentPost.author" v-if="typeof currentPost.author === 'object'" />
                </div>
                <span class="text-muted col text-right font-italic">发表于：{{ currentPost.createdAt }}</span>
            </div>
            <div v-html="currentHTML"></div>
            <!-- <div v-if="showEditArea" class="btn-group mt-5">
                <router-link type="button" class="btn btn-success"
                    :to="{ name: 'create', query: { id: currentPost._id } }">
                    编辑
                </router-link>
                <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
            </div> -->
        </article>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import store, { PostProps, ImageProps } from '../../store/store'
import UserProfile from './UserProfile.vue';
import MarkdownIt from 'markdown-it'
export default defineComponent({
    name: 'PostDetail',
    components: { UserProfile },
    setup() {
        const route = useRoute()
        const { postId } = route.params
        const md = new MarkdownIt()

        onMounted(() => {
            store.dispatch('fetchPost', postId)
        })
        const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(postId))

        const currentHTML = computed(() => {
            if (currentPost.value && currentPost.value.content) {
                const { isHTML, content } = currentPost.value
                // 渲染markdown数据
                return isHTML ? content : md.render(content)
            } else {
                return ''
            }
        })
        const currentImage = computed(() => {
            if (currentPost.value && currentPost.value.image) {
                const { image } = currentPost.value
                return (image as ImageProps).url + '?x-oss-process=image/resize,w_85'
            } else {
                return ''
            }
        })
        return {
            currentPost, currentHTML, currentImage
        }
    }
})
</script>
<style scoped>
.post-detail-page img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>