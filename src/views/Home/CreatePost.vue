<template>
    <div class="create-post-page">
        <UpLoader action="/upload" :beforeUpLoad="uploadCheck" @file-uploaded="onFileUploaded"
            @file-uploaded-error="upLoadedError"
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
                <img :src="dataProps.upLoadedData.url" :alt="dataProps.upLoadedData.filename" width="500">
            </template>
        </UpLoader>
        <VaildateForm @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">文章标题：</label>
                <ValidataInput :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">文章详情：</label>
                <ValidataInput :rules="contentRules" v-model="contentVal" placeholder="请输入文章内容" rows='10'
                    tag="textarea" />
            </div>
            <template #submit>
                <button class="btn btn-primary btn-large" @click.prevent="">发表文章</button>
            </template>
        </VaildateForm>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { ResponseType, ImageProps } from '../../store/store'
import { useRouter } from 'vue-router';
import { GlobalDataProps, createPostProps } from '../../store/store'
import VaildateForm from '../Login/VaildateForm.vue';
import ValidataInput, { RulesProp } from '../Login/ValidateInput.vue';
import UpLoader from './UpLoader.vue';
import { createMessage } from '../../components/Message/createMessage';
import { beforeUploadCheck } from '../../hleps'

export default defineComponent({
    name: 'CreatePost',
    components: {
        VaildateForm,
        ValidataInput,
        UpLoader
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        const router = useRouter()

        const titleVal = ref('')
        const titleRules: RulesProp = [
            { type: 'required', message: '文章标题不能为空!' }
        ]
        const contentVal = ref('')
        const contentRules: RulesProp = [
            { type: 'required', message: '文章内容不能为空!' }
        ]
        const imgIdVal = ref('')

        // 创建newPost
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const { column, _id } = store.state.user
                if (column && _id) {
                    const newPost: createPostProps = {
                        title: titleVal.value,
                        content: contentVal.value,
                        image: imgIdVal.value,
                        column,
                        author: _id
                    }
                    store.dispatch('createPost', newPost).then(() => {
                        createMessage('发表成功,2秒后跳转至个人专栏', 'success', 2000)
                        setTimeout(() => {
                            router.push({ name: 'columnDetail', params: { id: column } })
                        }, 2000)
                    })
                }
            }
        }

        // 上传前,验证函数
        const uploadCheck = (file: File,) => {
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

        // 上传成功
        const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
            imgIdVal.value = rawData.data._id as string
            createMessage(`上传成功! 图片ID:${rawData.data._id}`, 'success', 2000)
        }

        // 上传失败
        const upLoadedError = (result: any) => {
            console.log(result);
        }

        return {
            titleVal, titleRules, contentVal, contentRules,
            onFormSubmit, uploadCheck, onFileUploaded, upLoadedError
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