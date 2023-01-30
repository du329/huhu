<template>
    <div class="create-post-page">
        <!-- <uploader
      action="/upload"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="dataProps.uploadedData && dataProps.uploadedData.data.url">
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader> -->
        <VaildateForm @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">文章标题：</label>
                <ValidataInput :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">文章详情：</label>
                <ValidataInput :rules="contentRules" v-model="contentVal" placeholder="请输入文章内容" rows='10'
                    tag="textarea" />
                <!-- 
                <editor v-model="contentVal" :options="editorOptions" @blur="checkEditor"
                    :class="{ 'is-invalid': !editorStatus.isValid }">
                </editor> -->
                <!-- <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span> -->
            </div>
            <template #submit>
                <button class="btn btn-primary btn-large" @click.prevent="">发表文章</button>
            </template>
        </VaildateForm>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { GlobalDataProps, PostProps } from '../../store'
import VaildateForm from '../Login/VaildateForm.vue';
import ValidataInput, { RulesProp } from '../Login/ValidateInput.vue';

export default defineComponent({
    name: 'CreatePost',
    components: {
        VaildateForm,
        ValidataInput
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

        return {
            titleVal, titleRules, contentVal, contentRules,
            onFormSubmit
        }
    }
})


</script>