<template>
  <div
    class="si-icon-detail"
    :class="{enter: state.enter}">
    <div class="si-bread-crumb">
      <router-link to="/">Icons</router-link>
      <span> / </span>
      <router-link :to="`/${state.iconInfo.project.alias}`">{{ state.iconInfo.project.name }} <span class="si-proj-alias">{{ state.iconInfo.project.alias || '' }}</span></router-link>
      <span> / </span>
      <span>{{ state.iconInfo.svgInfo.name || '' }}</span>  
    </div>
    <div class="si-icon-name">{{ state.iconInfo.svgInfo.name || '' }}</div>
    <div class="si-examples">
      <div class="si-example-box si-example-large">
        <vue-icon
          original
          width="260px"
          height="260px"
          :svg-data="state.iconInfo.svgInfo"></vue-icon>
      </div>
      <div class="si-example-box si-example-big">
        <vue-icon
          original
          width="130px"
          height="130px"
          :svg-data="state.iconInfo.svgInfo"></vue-icon>
      </div>
      <div class="si-example-box si-example-middle">
        <vue-icon
          original
          width="50px"
          height="50px"
          :svg-data="state.iconInfo.svgInfo"></vue-icon>
      </div>
      <div class="si-example-box si-example-small">
        <vue-icon
          original
          width="24px"
          height="24px"
          :svg-data="state.iconInfo.svgInfo"></vue-icon>
      </div>
    </div>
    <div class="si-icon-name" style="margin-top: 30px;">
      基础用法
      <router-link
        class="si-to-docs"
        to="/docs">详细使用文档 &gt;&gt;</router-link>
      <div class="si-icon-ctrls">
        <div
          @click="copy"
          class="si-icon-copy">
          <simple-icon name="icon-copy1"></simple-icon>
          复制代码
        </div>
        <post-download
          ref="form"
          :action="`/v1/feicons/project/export?type=svg&id=${state.iconInfo.svgInfo._id}`">
          <div
            @click="download"
            class="si-icon-download">
            <simple-icon name="icon-down-load"></simple-icon>
            svg 文件
          </div>
        </post-download>
      </div>
    </div>
    <article
      class="si-icon-code markdown-body entry-content container-lg" itemprop="text">
      <p>// 使用</p>
      <div class="highlight highlight-source-js"><pre><span class="pl-k">import</span> <span class="pl-v">Vue</span> <span class="pl-k">from</span> <span class="pl-s">'vue'</span><span class="pl-kos">;</span>
<span class="pl-k">import</span> <span class="pl-v">SvgIcon</span> <span class="pl-k">from</span> <span class="pl-s">'@megvii-icons/vue-svg-icons'</span><span class="pl-kos">;</span>

<span class="pl-v">Vue</span><span class="pl-kos">.</span><span class="pl-en">use</span><span class="pl-kos">(</span><span class="pl-v">SvgIcon</span><span class="pl-kos">,</span> <span class="pl-kos">{</span>
  <span class="pl-c1">tagName</span>: <span class="pl-s">'meg-icon'</span>
<span class="pl-kos">}</span><span class="pl-kos">)</span><span class="pl-kos">;</span></pre></div>
      <p>// template</p>
      <div class="highlight highlight-text-html-basic"><pre><span class="pl-kos">&lt;</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span>
  <span class="pl-kos">&lt;</span><span class="pl-ent">meg-icon</span> <span class="pl-c1">name</span>="<span class="pl-s">{{ state.iconInfo.svgInfo.name }}</span>"<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">meg-icon</span><span class="pl-kos">&gt;</span>
<span class="pl-kos">&lt;/</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span></pre></div>
    </article>
  </div>
  <message
    v-model="state.message.show"
    :type="state.message.type"
    :message="state.message.msg"></message>
</template>
<script>
import SimpleIcon from '/@/components/simple-icon.vue';
import PostDownload from '/@/components/post-download.vue';
import Message from '/@/components/message.vue';
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { copyToClipboard } from '/@/utils/index.js';

export default {
  components: {
    Message,
    SimpleIcon,
    PostDownload
  },
  setup() {
    const state = reactive({
      enter: false,
      message: {
        show: false,
        type: '',
        msg: ''
      },
      iconInfo: {
        project: {},
        svgInfo: {}
      }
    });

    onMounted(async () => {
      setTimeout(() => {
        state.enter = true;
      }, 0);
      const route = useRoute();
      const { alias, id } = route.params;
      const { code, data } = await fetch('/v1/feicons/svg/detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alias,
          id
        })
      }).then((res) => res.json());
      if (code === 2100) {
        state.iconInfo = data;
      }
    });

    return {
      state
    }
  },
  methods: {
    download() {
      const { form } = this.$refs;
      if (form) {
        form.$el.submit();
      }
    },
    copy() {
      const text = `<meg-icon name="${this.state.iconInfo.svgInfo.name}"></meg-icon>`;
      copyToClipboard(text);
      this.state.message = {
        show: true,
        type: 'success',
        msg: `copied!, ${text}`
      }
    }
  }
}
</script>
<style lang="scss">
.si-icon-detail {
  opacity: 0;
  transform: translateX(5px);
  transition: all .3s;
}
.si-icon-detail.enter {
  opacity: 1;
  transform: translateX(0);
}
.si-icon-name {
  color: #181725;
  font-size: 24px;
  line-height: 1;
  position: relative;
  .icon-copy1 {
    margin-right: 2px;
  }
  .si-icon-ctrls div {
    cursor: pointer;
    margin-left: 20px;
    transition: all .35s;
    &:hover {
      color: rgb(3, 102, 214);
    }
  }
}

.si-examples {
  margin-top: 30px;
  display: flex;
}

.si-to-docs {
  font-size: 14px;
  margin-left: 15px;
}

.si-example-box {
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 24px;
}
.si-example-large {
  width: 540px;
  height: 420px;
}
.si-example-big {
  width: 265px;
  height: 214px;
}
.si-example-middle {
  width: 165px;
  height: 134px;
}
.si-example-small {
  width: 75px;
  height: 75px;
  margin-right: 0;
}
.si-icon-code {
  border: 1px solid #eee;
  margin-bottom: 80px!important;
  background: #f7f7f7!important;
  padding: 10px 0 5px 15px !important;
  margin-top: 15px;
  span {
    text-shadow: none;
  }
  &::before,&::after {
    box-shadow: none!important;
  }
  p {
    font-family: auto;
    font-size: 13px;
    margin-bottom: 0!important;
  }
  pre {
    padding: 5px 0!important;
    margin-bottom: 5px!important;
  }
}
.si-icon-ctrls {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  font-size: 14px;
  color: #666;
  line-height: 30px;
}
</style>