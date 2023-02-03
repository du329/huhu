<template>
    <div class="file-uploaded">
        <div class="file-upload-container" v-bind="$attrs" @click.prevent="handleRiggerCilck">
            <slot v-if="fileStatus === 'loading'" name="loading">
                <!-- <button class="btn btn-primary" disabled>正在上传...</button> -->
            </slot>
            <!-- 作用域插槽 -->
            <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
                <!-- <button class="btn btn-primary" disabled>上传成功</button> -->
            </slot>
            <slot v-else name="default">
                <!-- <button class="btn btn-primary">点击上传</button> -->
            </slot>
        </div>
        <div class="file-upload-help mb-3" v-if="fileStatus === 'success'">
            <button class="btn btn-primary" @click="handleRiggerCilck">点击重新上传</button>
            <button class="btn btn-primary mx-3" @click="handleFileCancelUpload">点击取消上传</button>
        </div>
        <input type="file" name="file" class="file-input d-none" ref="fileInput" @change.prevent="handleFileChange" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue';
import { post } from '../../utils/request'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
    name: 'UpLoader',
    props: {
        action: {
            type: String,
            required: true
        },
        beforeUpload: {
            type: Function as PropType<CheckFunction>
        },
        uploadedImgData: {
            type: Object
        }
    },
    inheritAttrs: false,
    emits: ['file-uploaded', 'file-uploaded-error'],
    setup(props, content) {
        const fileInput = ref<null | HTMLInputElement>(null)
        const fileStatus = ref<UploadStatus>(props.uploadedImgData ? 'success' : 'ready')
        // 作用域插槽
        const uploadedData = ref(props.uploadedImgData)
        // watch第一个参数：响应式对象,若不是则使用getter形式 
        watch(() => props.uploadedImgData, (newValue) => {
            fileStatus.value = 'success'
            uploadedData.value = newValue
        })
        // 点击上传
        const handleRiggerCilck = () => {
            if (fileInput.value) {
                fileInput.value.click()
            }
        }
        // 点击取消
        const handleFileCancelUpload = () => {
            fileStatus.value = 'ready'
        }
        // 处理上传
        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement
            // target.files: 类数组对象
            if (target.files) {
                const files = Array.from(target.files)
                // 上传前
                if (props.beforeUpload) {
                    // 判断是否是JPG格式
                    const isJpg = props.beforeUpload(files[0])
                    if (!isJpg) {
                        // 还原fileInput的值
                        if (fileInput.value) {
                            fileInput.value.value = ''
                        }
                        return
                    }
                }

                fileStatus.value = 'loading'
                const formData = new FormData()
                formData.append('file', files[0])

                // 上传图片： 成功/失败/最终
                post(props.action, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(resp => {
                    fileStatus.value = 'success'
                    uploadedData.value = resp.data
                    content.emit('file-uploaded', resp)
                }).catch(err => {
                    fileStatus.value = 'error'
                    content.emit('file-uploaded-error', err)
                }).finally(() => {
                    // 还原fileInput的值
                    if (fileInput.value) {
                        fileInput.value.value = ''
                    }
                })
            }

        }

        return {
            fileInput, fileStatus, handleRiggerCilck, handleFileCancelUpload, handleFileChange, uploadedData,
        }
    }
})
</script>
<style scoped>
.file-upload-help {
    display: flex;
    justify-content: center;
}
</style>