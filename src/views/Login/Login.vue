<template>
    <div class="login-page">
        <VaildateForm @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">邮箱地址:</label>
                <ValidataInput :rules="emailRules" v-model="emailValue" type="text" placeholder="请输入您的邮箱地址"
                    ref="emailRef" />
            </div>
            <div class="mb-3">
                <label class="form-label">密码:</label>
                <ValidataInput :rules="passwordRules" v-model="passwordValue" type="password" placeholder="请输入您的密码"
                    ref="passwordRef" />
            </div>
            <template #submit></template>
        </VaildateForm>
    </div>

</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import VaildateForm from './VaildateForm.vue';
import ValidataInput, { RulesProp } from './ValidateInput.vue';
export default defineComponent({
    name: 'Login',
    components: { VaildateForm, ValidataInput },
    setup() {
        const router = useRouter()
        const store = useStore()

        const emailRef = ref<any>()
        const emailValue = ref('')
        const emailRules: RulesProp = [
            { type: 'required', message: '请输入您的邮箱地址!' },
            { type: 'email', message: '请输入正确的邮箱格式!' }
        ]

        const passwordRef = ref<any>()
        const passwordValue = ref('')
        const passwordRules: RulesProp = [
            { type: 'required', message: '密码不能为空' },
            { type: 'range', min: { message: '你的密码至少包括六位，不能含有空格', length: 6 } }
        ]

        // 获取提交时的验证信息
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const payload = { email: emailValue.value, password: passwordValue.value }
                store.dispatch('login', payload).then(resp => console.log(resp))
                router.push({ name: 'home' })
            }
        }

        return {
            emailRef, emailValue, emailRules, passwordRef, passwordValue, passwordRules, onFormSubmit
        }
    }
})
</script>
