<template>
  <transition
    name="slideDown">
    <div
      v-if="state.visible"
      class="admin-dialog">
      <div
        :style="{width}"
        class="admin-content">
        <div
          v-if="showHeader"
          class="admin-header">
          <slot name="title">{{ title }}</slot>
          <SimpleIcon
            @click="close"
            name="icon-close"></SimpleIcon>
        </div>
        <div class="admin-body">
          <slot></slot>
        </div>
        <div
          v-if="showFooter"
          class="admin-footer">
          <slot name="footer">
            <simple-icon
              spin
              name="icon-spinner2"
              v-if="btnLoading"></simple-icon>,
              <div
                @click="confirm"
                class="dialog-btn primary">
                {{ confirmText }}
              </div>
              <div
                @click="close"
                class="dialog-btn">
                {{ cancelText }}
              </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import SimpleIcon from '/@/components/simple-icon.vue';
import { reactive, watchEffect } from 'vue';

export default {
  components: {
    SimpleIcon
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    btnLoading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500px'
    }
  },
  setup(props, cx) {
    const state = reactive({
      visible: false
    });
    const close = () => {
      state.visible = false;
      cx.emit('close');
      cx.emit('update:modelValue', false);
    }
    const confirm = () => {
      cx.emit('confirm');
    }
    watchEffect(() => {
      state.visible = props.modelValue;
    });
    return {
      state,
      close,
      confirm
    }
  }
};
</script>
<style lang="scss" scoped>
.admin-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.admin-content {
  background: #fff;
  transition: all .3s ease-in;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
}
.admin-header {
  padding: 0 50px 0 30px;
  height: 54px;
  line-height: 54px;
  border-bottom: 1px solid #f3f3f3;
  position: relative;
  font-size: 16px;
  color: #435068;
  font-weight: bold;
  .iconfont {
    transition: all .3s ease-in;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 10px;
    line-height: 1;
    padding: 10px;
    &:hover {
      opacity: .65;
    }
  }
}
.admin-footer {
  padding: 15px 30px 15px 30px;
  text-align: right;
}
.dialog-btn {
  border-radius: 6px;
  padding: 5px 15px;
  display: inline-block;
  background: #eee;
  cursor: pointer;
  transition: all .3s ease-in;
  &.primary {
    background: #0366d6;
    color: #fff;
    margin-right: 15px;
  }
  &:hover {
    opacity: .7;
  }
}
.slideDown-enter-active,
.slideDown-leave-active {
  transition: opacity .35s ease;
}

.slideDown-enter-from,
.slideDown-leave-to {
  opacity: 0;
}
</style>