<template>
    <div class="file-uploaded">
        <div class="file-upload-container d-inline-block" @click.prevent="handleRiggerCilck">
            <slot v-if="fileStatus === 'loading'" name="loading">
                <button class="btn btn-primary" disabled>正在上传...</button>
            </slot>
            <slot v-else-if="fileStatus === 'success'" name="success" :upLoadedData="upLoadedData">
                <button class="btn btn-primary" disabled>上传成功</button>
            </slot>
            <slot v-else name="default">
                <button class="btn btn-primary">点击上传</button>
            </slot>
        </div>
        <div class="file-upload-help" v-if="fileStatus === 'success'">
            <button class="btn btn-primary" @click="handleRiggerCilck">点击重新上传</button>
            <button class="btn btn-primary" @click="handleFileCancelUpLoad">点击取消上传</button>
        </div>
        <input type="file" name="file" class="file-input d-none" ref="fileInput" @change.prevent="handleFileChange" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { post } from '../../utils/request'

type UpLoadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
    name: 'UpLoader',
    props: {
        action: {
            type: String,
            required: true
        },
        beforeUpLoad: {
            type: Function as PropType<CheckFunction>
        }
    },
    emits: ['file-uploaded', 'file-uploaded-error'],
    setup(props, content) {
        const fileInput = ref<null | HTMLInputElement>(null)
        const fileStatus = ref<UpLoadStatus>('ready')
        const upLoadedData = ref()
        // btn代替file
        const handleRiggerCilck = (e: Event) => {
            console.log(e.target);
            if (fileInput.value) {
                fileInput.value.click()
            }
        }
        const handleFileCancelUpLoad = () => {
            fileStatus.value = 'ready'
        }

        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement
            // target.files: 类数组对象
            if (target.files) {
                const files = Array.from(target.files)
                // 上传前
                if (props.beforeUpLoad) {
                    // 判断是否是JPG格式
                    const isJpg = props.beforeUpLoad(files[0])
                    if (!isJpg) {
                        return
                    }
                }

                fileStatus.value = 'loading'
                const formData = new FormData()
                formData.append('file', files[0])

                post(props.action, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(resp => {
                    fileStatus.value = 'success'
                    upLoadedData.value = resp.data
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
            fileInput, fileStatus, handleRiggerCilck, handleFileCancelUpLoad, handleFileChange, upLoadedData,
        }
    }
})
</script>