<template>
    <a class="px-0 nav-link font-weight-bold text-white btn-signout" @click="signout"> <i
            class="fa fa-sign-out me-sm-2"></i> <span class="d-sm-inline d-none">{{ $t('app.signout.button') }}</span></a>
</template>

<script>
export default {
    name: 'SignOutButton',
    methods: {
        signout() {
            this.$store.dispatch('signout');
            this.$router.push('/signin');
        }
    }
};
</script>