<template>
  <div class="container">
    <GlobalHeader :user="currentUser" />
    <Loading v-if="isLoading" text="拼命加载中..." background="rgba(0,0,0,.8)" />
    <router-view></router-view>
    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex';
import { GlobalDataProps } from './store'
import GlobalHeader from './components/Header/GlobalHeader.vue';
import GlobalFooter from './components/Footer/GlobalFooter.vue';
import Loading from './components/Loading/Loader.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

const store = useStore<GlobalDataProps>()
const currentUser = computed(() => store.state.user)
const isLoading = computed(() => store.state.loading)

</script>