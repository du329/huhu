<template>
    <form class="validate-form-container">
        <slot name="default"></slot>
        <div class="sumbit-loyout mb-5">
            <div class="submit-area d-inline-block" @click.prevent="submitForm">
                <slot name="submit">
                    <button type="submit" class="btn btn-primary">提交</button>
                </slot>
            </div>
        </div>

    </form>
</template>
<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'

type ValidateFunc = () => boolean;
type ClearFunc = () => void;

type ValidateEvent = {
    'form-item-created': ValidateFunc
}
type ClearEvent = {
    'form-item-cleared': ClearFunc
}
export const validateEmitter = mitt<ValidateEvent>()
export const ClearEmitter = mitt<ClearEvent>()
export default defineComponent({
    name: 'ValidateForm',
    emits: ['form-submit'],
    setup(props, context) {
        let ValidateFuncArr: ValidateFunc[] = []
        // 获取validateInput中的 验证函数
        const callbackValidate = (func: ValidateFunc) => {
            if (func) {
                ValidateFuncArr.push(func)
            }
        }
        validateEmitter.on('form-item-created', callbackValidate)
        // 获取表单验证结果
        const submitForm = () => {
            // map执行每一个验证函数、every判断是否全部验证通过
            const result = ValidateFuncArr.map(func => func()).every(result => result)
            // 点击提交、触发、传递验证结果
            context.emit('form-submit', result)
            // clearForm()
        }

        let ClearFuncArr: ClearFunc[] = []
        // 获取validateInput中的 清除函数
        const callbackClear = (func: ClearFunc) => {
            if (func) {
                ClearFuncArr.push(func)
            }
        }
        ClearEmitter.on('form-item-cleared', callbackClear)
        // 清空表单数据
        const clearForm = () => {
            ClearFuncArr.map(func => func())
        }

        // 卸载绑定的事件
        onUnmounted(() => {
            validateEmitter.off('form-item-created', callbackValidate)
            ClearEmitter.off('form-item-cleared', callbackClear)
            ValidateFuncArr = []
            ClearFuncArr = []
        })

        return {
            submitForm, clearForm
        }
    }

})
</script>
<style>
.sumbit-loyout {
    text-align: center;
}
</style>