<template>
    <teleport to="#modal">
        <div class="modal d-block" tabindex="-1" v-if="visible">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="onClose">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"
                            @click="onClose">取消</button>
                        <button type="button" class="btn btn-primary" @click="onConfirm">确定</button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>
<script lang="ts">
import { defineComponent, } from 'vue';
import { useCreateDom } from '../../hooks/useCreateDom'

export default defineComponent({
    name: 'ModalComponent',
    props: {
        title: String,
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['modal-confirm', 'modal-close'],
    setup(props, content) {
        // 创建并挂载至#moda
        useCreateDom('modal')

        const onClose = () => {
            content.emit('modal-close')
        }
        const onConfirm = () => {
            content.emit('modal-confirm')
        }
        return {
            onClose, onConfirm
        }
    }
})
</script>