<script>


import LayoutTrackerMobility from "./public/pages/layout-tracker-mobility.component.vue";

export default {
  name: "app",
  components: {LayoutTrackerMobility},



  title: 'Elixir Control',

  created() {
    console.log('App created');
  }
}

</script>

<template>
  <router-view></router-view>
  <pv-toast />
  <pv-confirm-dialog group="default" />
  <pv-confirm-dialog />

</template>


<style>

</style>
