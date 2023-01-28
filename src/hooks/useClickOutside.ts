import { ref, Ref, onMounted, onUnmounted } from 'vue'
// Ref是类型
export const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
    const isClickOutside = ref(false)

    const handle = (e: MouseEvent) => {
        if (elementRef.value) {
            if (elementRef.value.contains(e.target as HTMLElement)) {
                // 未点击至外部: elementRef包含当前点击的项目
                isClickOutside.value = false
            } else {
                isClickOutside.value = true
            }
        }
    }
    onMounted(() => {
        document.addEventListener('click', handle)
    })
    onUnmounted(() => {
        document.removeEventListener('click', handle)
    })
    return isClickOutside
}