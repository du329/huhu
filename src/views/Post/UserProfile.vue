<template>
    <div class="user-profile-component">
        <div class="d-flex align-items-center">
            <img :src="fitUrl" :alt="author.nickName" class="rounded-circle img-thumbnail">
            <div class="detail mx-2">
                <h6 class="d-block mb-0">{{ author.nickName }}</h6>
                <span class="text-truncate text-muted d-block">{{ author.description }}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { AuthorProps } from '../../store/store'
import { handleAvatar } from '../../hleps'
export default defineComponent({
    name: 'UserProfile',
    props: {
        author: {
            type: Object as PropType<AuthorProps>,
            required: true
        }
    },
    setup(props) {

        const fitUrl = computed(() => {
            handleAvatar(props.author, 50, 50)
            const { avatar } = props.author
            return avatar && avatar.fitUrl
        })

        return {
            fitUrl
        }
    }
})
</script>
<style>
.user-profile-component img {
    width: 50px;
    height: 50px;
}
</style>
