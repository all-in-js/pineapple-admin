<template>
  <form
    :action="host + action"
    method="post">
    <slot>
      <button
        :class="btnClass"
        type="submit">{{ btnText }}</button>
    </slot>
  </form>
</template>
<script>
export default {
  props: {
    action: {
      type: String,
      required: true,
      default: ''
    },
    btnText: {
      type: String,
      default: '下载'
    },
    btnClass: {
      type: String,
      default: ''
    }
  }
}
</script>