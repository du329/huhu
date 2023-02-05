// 通用的验证函数
import { ColumnProps, AuthorProps, ImageProps } from './store/store'

// 验证条件(格式jpg、png.. 大小)
interface CheckCondition {
    format?: string[],
    size?: number
}
type ErrorType = 'size' | 'format' | null

// 图片验证
export function beforeUploadCheck(file: File, condition: CheckCondition) {
    const { format, size } = condition
    // format truly变量执行左边，falsly变量执行右边
    const isValidFormat = format ? format.includes(file.type) : true
    const isValidSize = size ? (file.size / 1024 / 1024 < size) : true

    let error: ErrorType = null

    if (!isValidFormat) {
        error = 'format'
    }
    if (!isValidSize) {
        error = 'size'
    }
    return {
        passed: isValidFormat && isValidSize,
        error
    }
}

// 生成合适的图片
export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
    if (data && data.url) {
        // reduce 累加
        const formatStr = format.reduce((prev, current) => {
            return current + ',' + prev
        }, '')
        data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
    }
}

// 处理头图
export function handleAvatar(data: ColumnProps | AuthorProps, width: number, height: number) {
    const { avatar } = data
    if (avatar && avatar.url) {
        generateFitUrl(avatar, width, height)
    } else {
        // 使用默认图片
        const { title } = data as ColumnProps
        data.avatar = {
            fitUrl: new URL(title ? './assets/column.jpg' : './assets/avatar.jpg', import.meta.url).href
        }
    }
}

// 数组 <==> 对象
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
    // 叠加
    return arr.reduce((prev, current) => {
        if (current._id) {
            prev[current._id] = current
        }
        return prev
    }, {} as { [key: string]: T })
}

export const objToArr = <T>(obj: { [key: string]: T }) => {
    return Object.keys(obj).map((key) => obj[key])
}