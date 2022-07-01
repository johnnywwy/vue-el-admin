<template>
  <div id="app">
    <div class="card">
      <div class="card-header">头部</div>
      <div class="card-body">头部</div>
      <div class="card-footer">头部</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      radio: '1'
    };
  },
  methods:{
    change(e){
      console.log(e)
    }
  }
}
</script>

<style>

</style>
