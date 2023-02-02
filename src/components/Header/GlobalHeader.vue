
<template>
    <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
        <router-link to="/"><a class="navbar-brand" href="#">乎乎专栏</a></router-link>
        <ul v-if="!user.isLogin" class="list-inline mb-0">
            <li class="list-inline-item">
                <router-link to="/login">
                    <a href="#" class="btn btn-outline-light my-2">登录</a>
                </router-link>
            </li>
            <li class="list-inline-item">
                <router-link to="/register">
                    <a href="#" class="btn btn-outline-light my-2">注册</a>
                </router-link>
            </li>
        </ul>
        <ul v-else class="list-inline mb-0">
            <li class="list-inline-item">
                <DropDown :title="`您好 ${user.nickName}`">
                    <router-link :to="{ name: 'createPost' }">
                        <DropDownItem><a class="dropdown-item" href="#">新建文章</a></DropDownItem>
                    </router-link>
                    <DropDownItem disabled><a class="dropdown-item" href="#">编辑资料</a></DropDownItem>
                    <DropDownItem @click.prevent="signOut"><a class="dropdown-item" href="#">退出登录</a></DropDownItem>
                </DropDown>
            </li>
        </ul>
    </nav>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import store, { UserProps } from '../../store/store'
import DropDown from './DropDown.vue';
import DropDownItem from './DropDownItem.vue';

export default defineComponent({
    name: 'GlobalHeader',
    components: {
        DropDown,
        DropDownItem
    },
    props: {
        user: {
            type: Object as PropType<UserProps>,
            required: true
        }
    },
    setup() {
        // 退出
        const signOut = () => {
            store.commit('signOut')
        }
        return {
            signOut
        }
    }
})
</script>

<style scoped>

</style>
