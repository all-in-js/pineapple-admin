<template>
  <div
    @mouseenter="handlein"
    @mouseleave="handleout"
    @click="go"
    :style="{ zIndex: state.zIndex }"
    class="svg-icon">
    <div
      @click.stop="copy"
      class="si-icon-copy">复制代码</div>
    <div>
      <vue-icon
        original
        :svg-data="$props.svgInfo"
        width="34px"
        height="34px"></vue-icon>
    </div>
    <p class="svg-name">{{ $props.svgInfo.name }}</p>
    <simple-icon
      v-if="showCtrls"
      class="icon-ctrls"
      size="24px"
      name="icon-dot"
      @click.stop>
      <div class="icon-ctrl-list">
        <post-download
          @click.stop
          btn-text="下载 svg"
          :action="`/v1/feicons/project/export?type=svg&id=${ svgInfo._id }`"
          class="icon-ctrl">
        </post-download>
        <div
          @click="downloadPng(svgInfo)"
          class="icon-ctrl">
          下载 png
        </div>
      </div>
    </simple-icon>
  </div>
</template>
<script>
import { reactive } from 'vue';
import Canvg from 'canvg';
import SimpleIcon from '/@/components/simple-icon.vue';
import PostDownload from '/@/components/post-download.vue';
import { copyToClipboard } from '/@/utils/index.js';

export default {
  components: {
    SimpleIcon,
    PostDownload
  },
  props: {
    showCtrls: {
      type: Boolean,
      default: true
    },
    svgInfo: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const state = reactive({
      zIndex: 'unset'
    });

    const handlein = () => {
      state.zIndex = 1;
    }

    const handleout = () => {
      state.zIndex = 'unset';
    }

    return {
      state,
      handlein,
      handleout
    }
  },
  methods: {
    go() {
      const { alias, _id } = this.svgInfo;
      this.$router.push({
        path: `/${alias}/${_id}`
      });
    },
    download() {
      const { form } = this.$refs;
      if (form) {
        form.$el.submit();
      }
    },
    renameStyle(content) {
      let styleShaeReg = /<(path|rect|circle|polygon|line|polyline|g|ellipse).+>/gi;
      let styleReg = /_fill=\"|_stroke="/gi;
      content = content.replace(styleShaeReg, function(shape) {
        return shape.replace(styleReg, function(styleName) {
          return styleName.replace(/^_/, '');
        });
      });

      return content;
    },
    downloadPng(svgInfo) {
      const { width, height, viewBox, data } = svgInfo;
      const svgStr = `<svg width="${width}" height="${height}" viewBox="${viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        ${this.renameStyle(data)}
      </svg>`;
      const canvas = document.querySelector('#canvas');
      const ctx = canvas.getContext('2d');
      const canvg = Canvg.fromString(ctx, svgStr);
      canvg.start();

      const base = canvas.toDataURL('image/png');
      const base64Img2Blob = function(code) {
        const parts = code.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; i += 1) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
      }
      const aLink = document.createElement('a');
      const blob = base64Img2Blob(base);

      aLink.setAttribute('href', URL.createObjectURL(blob));
      aLink.setAttribute('download', `${svgInfo.name}.png`);
      aLink.click();
    },
    copy() {
      const text = `<meg-icon name="${this.svgInfo.name}"></meg-icon>`;
      copyToClipboard(text);
      this.$emit('message', {
        show: true,
        type: 'success',
        msg: `copied!, ${text}`,
        duration: 2500
      }); 
    }
  },
}
</script>
<style lang="scss">
.svg-icon {
  width: 124px;
  height: 124px;
  display: inline-flex;
  align-items: center;
  flex-flow: column;
  justify-content: center;
  transition: all .3s;
  cursor: pointer;
  position: relative;
  margin-right: 28px;
  &:nth-child(7n) {
    margin-right: 0;
  }
  .si-icon-copy {
    color: #1067D1;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 32px;
    opacity: 0;
    transition: all .35s;
    transform: translateY(3px);
  }
  .svg-name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 105px;
    margin-top: 10px;
    text-align: center;
  }
  &:hover {
    border-radius: 4px;
    background: rgba(16, 103, 209, 0.1);
    .icon-ctrls {
      opacity: 1;
      transform: translateY(0);
    }
    .si-icon-copy {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .icon-ctrls {
    position: absolute;
    top: 5px;
    padding-right: 15px;
    right: -10px;
    color: #666;
    transition: all .35s;
    opacity: 0;
    transform: translateY(-3px);
    &:hover {
      color: #1067D1;
    }
    &:hover {
      color: #1067D1;
      .icon-ctrl-list {
        opacity: 1;
        right: -105px;
        transform: translateX(0);
      }
    }
    .icon-ctrl-list {
      font-size: 14px;
      position: absolute;
      right: -5200px;
      top: -5px;
      width: 110px;
      line-height: 2.3;
      z-index: 12;
      text-align: center;
      padding: 5px 0;
      background: #fff;
      opacity: 0;
      border-radius: 4px;
      transition: transform .35s;
      transform: translateX(5px);
      box-shadow: 0px 8px 10px 0px rgba(187, 187, 187, 0.5);
      .icon-ctrl {
        color: #666;
        transition: all .35s;
        &:hover {
          background: rgba(16, 103, 209, 0.1);
          color: #1067D1;
        }
        button {
          background: none;
          cursor: pointer;
        }
      }
    }
  }
}
</style>