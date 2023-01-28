<template>
    <div class="validate-input-container">
        <input v-if="tag !== 'textarea'" v-bind="$attrs" :class="{ 'form-control': true, 'is-invalid': inputRef.error }"
            v-model="inputRef.val" @input="updateValue" @blur="validateInput" autocomplete="off">
        <textarea v-else v-bind="$attrs" :class="{ 'form-control': true, 'is-invalid': inputRef.error }"
            v-model="inputRef.val" @input="updateValue" @blur="validateInput" autocomplete="off"></textarea>
        <div v-if="inputRef.error" class="invalid-feedback">
            {{ inputRef.message }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, onMounted } from 'vue'
import { validateEmitter, ClearEmitter } from './VaildateForm.vue'
interface RuleProp {
    type: 'required' | 'email' | 'range',
    message?: string,
    min?: {
        message: string,
        length: number
    },
    max?: {
        message: string,
        length: number
    }
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'

export default defineComponent({
    name: 'ValidateInput',
    props: {
        rules: Array as PropType<RulesProp>,
        modelValue: String,
        tag: {
            type: String as PropType<TagType>,
            default: 'input'
        }
    },
    inheritAttrs: false,
    setup(props, context) {
        const inputRef = reactive({
            val: props.modelValue || '',
            error: false,
            message: '',
        })
        // 自定义组件的v-model
        const updateValue = (e: Event) => {
            const targetValue = (e.target as HTMLInputElement).value
            inputRef.val = targetValue
            /* ！！！！！！！！！！！！！！！！！！！！！*/
            context.emit('update:modelValue', targetValue)
        }
        // 验证表单
        const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
        const validateInput = () => {
            if (props.rules) {
                const allPassed = props.rules.every((rule) => {
                    let passed = true;
                    switch (rule.type) {
                        case 'required':
                            inputRef.message = (rule.message as string)
                            passed = (inputRef.val.trim() !== '')
                            break;
                        case 'email':
                            inputRef.message = (rule.message as string)
                            passed = emailReg.test(inputRef.val)
                            break;
                        case 'range':
                            if (rule.min && (inputRef.val.length < rule.min.length)) {
                                passed = false
                                inputRef.message = rule.min.message
                            }
                            if (rule.max && (inputRef.val.length > rule.max.length)) {
                                passed = false
                                inputRef.message = rule.max.message
                            }
                            break;
                        default:
                            break;
                    }
                    return passed
                })
                inputRef.error = !allPassed;
                return allPassed
            }
            return true
        }
        // 清空表单
        const clearInputs = () => {
            if (inputRef.val) {
                inputRef.val = ''
                inputRef.error = false
                inputRef.message = ''
            }
        }
        // 绑定 获取input 验证函数
        onMounted(() => {
            validateEmitter.emit('form-item-created', validateInput)
            ClearEmitter.emit('form-item-cleared', clearInputs)
        })
        return {
            inputRef, updateValue, validateInput, clearInputs
        }
    }
})

</script>


<style scoped>

</style>
