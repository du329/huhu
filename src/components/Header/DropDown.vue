
<template>
    <div class="dropdown" ref="dropdownRef">
        <a class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleState">
            {{ title }}
        </a>
        <ul v-if="isOpen" class="dropdown-menu" :style="{ display: 'block' }" @click="toggleState">
            <slot></slot>
        </ul>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useClickOutside } from '../../hooks/useClickOutside'
export default defineComponent({
    name: 'DropDown',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup() {

        // 是否打开
        const isOpen = ref(false)
        const toggleState = () => {
            isOpen.value = !isOpen.value;
        }

        // 是否点击至外部
        const dropdownRef = ref<null | HTMLElement>(null)
        const isClickOutside = useClickOutside(dropdownRef);

        watch(isClickOutside, () => {
            if (isClickOutside.value && isOpen.value) {
                isOpen.value = false
            }
            // if (!isClickOutside.value && isOpen.value) {
            //     isOpen.value = false
            // }
        })
        return {
            isOpen, toggleState, dropdownRef
        }

        // const dropdownHandle = (e: MouseEvent) => {
        //     if (dropdownRef.value) {
        //         // !当dropdownRef.value包含e.target（dropdowwnItem）时 && isOpen
        //         if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
        //             isOpen.value = false
        //         }
        //     }
        // }
    }

})
</script>


<style scoped>

</style>
