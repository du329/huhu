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
            <div v-if="showEditArea" class="btn-group mt-5">
                <router-link type="button" class="btn btn-success"
                    :to="{ name: 'createPost', query: { postId: currentPost._id } }">
                    编辑
                </router-link>
                <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
            </div>
        </article>
        <Modal title="删除文章" :visible="modalIsVisible" @modal-close="onModalClose" @modal-confirm="onModalConfirm">
            <p>确认删除这篇文章吗?</p>
        </Modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store, { ResponseType, PostProps, ImageProps } from '../../store/store'
import UserProfile from './UserProfile.vue';
import Modal from './Modal.vue';
import { createMessage } from '../../components/Message/createMessage';
import { marked } from 'marked'
export default defineComponent({
    name: 'PostDetail',
    components: { UserProfile, Modal },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const { postId } = route.params
        onMounted(() => {
            // 需请求数据
            if (postId) {
                store.dispatch('fetchPost', postId)
            }
        })
        const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(postId))

        const currentHTML = computed(() => {
            if (currentPost.value && currentPost.value.content) {
                const { isHTML, content } = currentPost.value
                // 渲染 markdown 数据
                return isHTML ? content : marked.parse(content)
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
        const showEditArea = computed(() => {
            const { isLogin, _id } = store.state.user
            if (currentPost.value && currentPost.value.author && isLogin) {
                return currentPost.value.author._id === _id
            } else {
                return false
            }
        })
        // 确认框
        const modalIsVisible = ref(false)
        const onModalClose = () => {
            modalIsVisible.value = false
        }
        const onModalConfirm = () => {
            modalIsVisible.value = false
            store.dispatch('deletePost', postId).then((rawData: ResponseType<PostProps>) => {
                createMessage('文章删除成功!', 'success', 2000)
                setTimeout(() => {
                    router.push({ name: 'columnDetail', params: { id: rawData.data.column } })
                }, 2000)
            })
        }
        return {
            currentPost, currentHTML, currentImage, showEditArea, modalIsVisible, onModalClose, onModalConfirm
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