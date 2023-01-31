<template>
    <div class="create-post-page">
        <Uploader action="/upload" 
            :beforeUpLoad="beforeUpLoad" 
            @file-uploaded="onfileUploaded"
            @file-uploaded-error="upLoadedError"
        >
            <template #loading>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </template>
            <template #success="dataProps">
                <img :src="dataProps.upLoadedData.url" :alt="dataProps.upLoadedData.filename" width="500">
            </template>
        </Uploader>
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
import { ResponseType, ImageProps } from '../../store'
import { useRouter } from 'vue-router';
import { GlobalDataProps, PostProps } from '../../store'
import VaildateForm from '../Login/VaildateForm.vue';
import ValidataInput, { RulesProp } from '../Login/ValidateInput.vue';
import Uploader from './Uploader.vue';
import { createMessage } from '../../components/Message/createMessage';

export default defineComponent({
    name: 'CreatePost',
    components: {
        VaildateForm,
        ValidataInput,
        Uploader
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

        // 创建newPost
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const columnId = store.state.user.column
                if (columnId) {
                    const newPost: PostProps = {
                        _id: new Date().getTime().toString(),
                        title: titleVal.value,
                        content: contentVal.value,
                        column: columnId.toString(),
                        createdAt: new Date().toLocaleString(),
                    }
                    store.commit('createPost', newPost)
                    router.push({ name: 'columnDetail', params: { id: columnId } })
                }
            }
        }

        // 上传前
        const beforeUpLoad = (file: File) => {
            const isJpg = (file.type === 'image/jpeg')
            if (!isJpg) {
                createMessage('图片格式只能是 JPG 格式', 'error', 2000)
            }
            return isJpg
        }

        // 上传成功
        const onfileUploaded = (rawData: ResponseType<ImageProps>) => {
            createMessage(`上传成功! 图片ID:${rawData.data._id}`, 'success', 2000)
        }

        // 上传失败
        const upLoadedError = (result: any) => {
            console.log(result);
        }

        return {
            titleVal, titleRules, contentVal, contentRules,
            onFormSubmit, beforeUpLoad, onfileUploaded, upLoadedError
        }
    }
})


</script>