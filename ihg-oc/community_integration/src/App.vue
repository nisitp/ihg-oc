<template>
  <div id="owners-community-integration" data-initialized>
    <keep-alive include="index">
      <router-view :args="args"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  props: {
    args: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./utils";

  #owners-community-integration {
    font-family: "Roboto", Helvetica, Arial, sans-serif;
    font-size: 16px;
    color: $color-text;
    background-color: $color-bg;
    padding: 30px;
    box-sizing: border-box;
  }
</style>
