import { onUnmounted } from "vue"
export const useCreateDom = (id: string) => {
    const node = document.createElement('div')
    node.id = id
    document.body.appendChild(node)
    onUnmounted(()=>{
        document.body.removeChild(node)
    })
}