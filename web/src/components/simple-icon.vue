<template>
  <i
    :style="style"
    :class="`iconfont ${name} simple-icon`">
    <slot></slot>
  </i>
</template>
<script>
import { reactive, computed } from 'vue';

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '16px'
    },
    color: {
      type: String,
      default: ''
    },
    spin: {
      type: Boolean,
      default: false
    },
    rotate: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const style = computed(() => {
      const { name, size, color, spin, rotate } = props;
      const style = {};
      if (size) style.fontSize = size;
      if (color) style.color = color;
      if (spin) style.animation = 'rotating 2s linear infinite';
      if (rotate) style.transform = `rotate(${rotate})`;
      return style;
    });

    return {
      style
    }

  }
};
</script>