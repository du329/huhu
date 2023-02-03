<template>
    <div class="create-post-page">
        <h2 class="text-center">{{ isEditMode? '编辑文章': '新建文章' }}</h2>
        <UpLoader action="/upload" :beforeUpload="uploadCheck" @file-uploaded="onFileUploaded"
            @file-uploaded-error="uploadedError" :uploaded-img-data="uploadedImgData"
            class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4">
            <h2>点击上传头图</h2>
            <template #loading>
                <div class="d-flex">
                    <div class="spinner-border mx-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h2>正在上传</h2>
                </div>
            </template>
            <template #uploaded="dataProps">
                <img :src="dataProps.uploadedData.url" :alt="dataProps.uploadedData.filename" width="500">
            </template>
        </UpLoader>
        <VaildateForm @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">文章标题：</label>
                <ValidataInput :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">文章详情：</label>
                <Editor v-model="contentVal" :options="editorOptions" ref="editorRef" @blur="checkEditor"
                    :class="{ 'is-invalid': !editorStatus.isValid }" />
                <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
                <!-- <ValidataInput :rules="contentRules" v-model="contentVal" placeholder="请输入文章内容" rows='10'
                    tag="textarea" /> -->
            </div>
            <template #submit>
                <button class="btn btn-primary btn-large">{{ isEditMode? '更新文章': '发表文章' }}</button>
            </template>
        </VaildateForm>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { ResponseType, ImageProps, PostProps, GlobalDataProps, createPostProps } from '../../store/store'
import { useRoute, useRouter } from 'vue-router';

import { createMessage } from '../../components/Message/createMessage';
import { beforeUploadCheck } from '../../hleps'

import VaildateForm from '../Login/VaildateForm.vue';
import ValidataInput, { RulesProp } from '../Login/ValidateInput.vue';
import UpLoader from './UpLoader.vue';
import Editor from './Editor.vue';
import EasyMDE, { Options } from 'easymde'

interface EditorInstance {
    clear: () => void,
    getMDEInstance: () => EasyMDE
}
export default defineComponent({
    name: 'CreatePost',
    components: {
        VaildateForm,
        ValidataInput,
        UpLoader,
        Editor
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        const route = useRoute()
        const router = useRouter()

        // 创建newPost
        const titleVal = ref('')
        const titleRules: RulesProp = [
            { type: 'required', message: '文章标题不能为空!' }
        ]
        const contentVal = ref('')
        const contentRules: RulesProp = [
            { type: 'required', message: '文章内容不能为空!' }
        ]
        const imgIdVal = ref('')

        // 更新Post
        const { postId } = route.query
        const isEditMode = !!postId
        const uploadedImgData = ref()

        // markdown
        const editorOptions: Options = { spellChecker: false }
        const editorRef = ref<null | EditorInstance>(null)
        const editorStatus = reactive({
            isValid: true,
            message: ''
        })
        const checkEditor = () => {
            if (contentVal.value.trim() === '') {
                editorStatus.isValid = false
                editorStatus.message = '请输入文章详情!'
            } else {
                editorStatus.isValid = true
                editorStatus.message = ''
            }
        }

        // 创建/更新 Post
        const onFormSubmit = (result: boolean) => {
            // markdown编译器验证
            checkEditor()
            if (result && editorStatus.isValid) {
                const { column, _id } = store.state.user
                if (column && _id) {
                    const newPost: createPostProps = {
                        title: titleVal.value,
                        content: contentVal.value,
                        image: imgIdVal.value,
                        column,
                        author: _id
                    }
                    const actionName = isEditMode ? 'patchPost' : 'createPost'
                    const sendData = isEditMode ? {
                        postId,
                        payload: newPost
                    } : newPost
                    store.dispatch(actionName, sendData).then(() => {
                        createMessage('文章发表成功,2秒后跳转至我的专栏', 'success', 2000)
                        setTimeout(() => {
                            router.push({ name: 'columnDetail', params: { id: column } })
                        }, 2000)
                    })
                }
            }
        }
        // 图片上上传前,验证函数
        const uploadCheck = (file: File) => {
            const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
            const { passed, error } = result
            if (error === 'format') {
                createMessage('上传图片只能是 JPG/PNG 格式', 'error', 2000)
            }
            if (error === 'size') {
                createMessage('上传图片大小不能超过 1MB', 'error', 2000)
            }
            return passed
        }
        // 图片上传成功
        const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
            imgIdVal.value = rawData.data._id as string
            createMessage(`上传成功! 图片ID:${rawData.data._id}`, 'success', 2000)
        }
        // 图片上上传失败
        const uploadedError = (result: any) => {
            console.log(result);
        }

        onMounted(() => {
            if (editorRef.value) {
                console.log(editorRef.value.getMDEInstance());
            }
            if (isEditMode) {
                const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(postId))
                if (currentPost.value && postId) {
                    uploadedImgData.value = currentPost.value.image
                    titleVal.value = currentPost.value.title
                    contentVal.value = currentPost.value.content
                }
            }
        })

        return {
            titleVal, titleRules, contentVal, contentRules,
            onFormSubmit, uploadCheck, onFileUploaded, uploadedError,
            uploadedImgData, isEditMode, editorOptions, editorRef, editorStatus, checkEditor
        }
    }
})
</script>

<style>
.create-post-page .file-upload-container {
    height: 200px;
    cursor: pointer
}

.create-post-page .file-upload-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>