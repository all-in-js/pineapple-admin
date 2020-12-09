<template>
  <transition>
    <div
      :class="[
        'message',
        type ? `message-${ type }` : ''
      ]"
      v-if="state.visible">
      <simple-icon
        :name="iconMap[type]"></simple-icon>
      <slot>
        <p
          class="message-content">
          {{ message }}
        </p>
      </slot>
    </div>
  </transition>
</template>

<script>
import { reactive, watchEffect, ref, computed, onMounted } from 'vue';
import SimpleIcon from '/@/components/simple-icon.vue';

const typeMap = {
  success: 'success',
  error: 'error'
};

export default {
  components: {
    SimpleIcon
  },
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 1500
    },
    type: {
      type: String,
      default: 'info'
    }
  },
  setup(props, cx) {
    let timer;
    const state = reactive({
      visible: false
    });
    const iconMap = ref({
      error: 'icon-Icon_info',
      success: 'icon-success'
    });
    const close = function() {
      state.visible = false;
      cx.emit('update:modelValue', false);
      if (timer) {
        clearTimeout(timer);
      }
    }
    watchEffect(() => {
      state.visible = props.modelValue;
      if (state.visible) {
        if (props.duration > 0) {
          timer = setTimeout(() => {
            if (state.visible) {
              close();
            }
          }, props.duration);
        }
      } else {
        if (timer) {
          clearTimeout(timer);
        }
      }
    });

    return {
      state,
      iconMap,
      close
    }
  },

  computed: {
    typeClass() {
      return this.type
        ? `meg-icon-${typeMap[this.type]}`
        : '';
    }
  },
  methods: {
    /**
     * 开启定时器
     */
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          console.log(this.state.visible);
          if (this.state.visible) {
            this.close();
          }
        }, this.duration);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.message-fade-enter,
.message-fade-leave-active {
  opacity: 0;
  transform: translate(-50%, -100%);
}
.message {
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  position: fixed;
  left: 50%;
  top: 20px;
  z-index: 1234;
  transform: translate(-50%);
  transition: opacity 0.3s, transform .4s;
  overflow: hidden;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  font-size: 13px;
  min-width: 240px;
  .iconfont {
    margin-right: 5px;
  }
}
.message-success {
  border-color: #a8e4ab;
  color: #46a653;
  background-color: #f2fdf2;
}
.message-error {
  color: #F44336;
  background-color: rgb(255, 239, 237);
  border-color: rgb(243, 192, 188);
}
</style>