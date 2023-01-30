import { createApp, h, render } from 'vue'
import Message from "./Message.vue";
export type MessageType = 'success' | 'error' | 'default'
export const createMessage = (message: string, type: MessageType, timeout?: number) => {

    const messageVnode = h(Message, {
        message, type
    })

    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    // 将 vnodo 渲染到 dom 节点上
    render(messageVnode, mountNode)

    const distroy = () => {
        render(null, mountNode)
        document.body.removeChild(mountNode)
    }
    if (timeout) {
        setTimeout(() => {
            distroy()
        }, timeout)
    }
    return {
        distroy
    }
}