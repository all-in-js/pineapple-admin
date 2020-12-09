<template>
  <div class="index-page">
    <div class="si-introduce">
      <div class="si-main-info">
        <div
          class="si-icons-show si-icons-fade">
          <i
            :style="{color: state.randColor}"
            :class="['iconfont', state.randIcon]"></i>
        </div>
        <p class="si-site-name">MegIcon 图标库</p>
        <div class="si-site-slogn">一个集成和管理 SVG 图标的平台</div>
        <div class="si-extra-link">
          <span>latest: v{{ state.pkg['dist-tags'].latest }}</span>
          <router-link to="/docs"><span>使用文档</span></router-link>
          <a target="_blank" href="https://design.megvii-inc.com/docs/company/base/icon"><span>MegIcon 组件</span></a>
          <a target="_blank" href="https://fe-cms.mcd.megvii-inc.com/project"><span>图标管理</span></a>
          <router-link to="/about">关于</router-link>
        </div>
      </div>
    </div>
    <div class="si-quick-start-title">Quick Start</div>
    <div class="si-quick-start-wrapper">
      <article
        :class="['si-quick-start language-javascript', state.showQuickStartText ? 'active' : '']"
        class="markdown-body entry-content container-lg" itemprop="text"><p>// 安装</p>
        <install-code />
        <p>// 使用</p>
        <div class="highlight highlight-source-js"><pre><span class="pl-k">import</span> <span class="pl-v">Vue</span> <span class="pl-k">from</span> <span class="pl-s">'vue'</span><span class="pl-kos">;</span>
<span class="pl-k">import</span> <span class="pl-v">SvgIcon</span> <span class="pl-k">from</span> <span class="pl-s">'@megvii-icons/vue-svg-icons'</span><span class="pl-kos">;</span>

<span class="pl-v">Vue</span><span class="pl-kos">.</span><span class="pl-en">use</span><span class="pl-kos">(</span><span class="pl-v">SvgIcon</span><span class="pl-kos">,</span> <span class="pl-kos">{</span>
  <span class="pl-c1">tagName</span>: <span class="pl-s">'meg-icon'</span>
<span class="pl-kos">}</span><span class="pl-kos">)</span><span class="pl-kos">;</span></pre></div>
        <p>// template</p>
        <div class="highlight highlight-text-html-basic"><pre><span class="pl-kos">&lt;</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span>
  <span class="pl-kos">&lt;</span><span class="pl-ent">meg-icon</span> <span class="pl-c1">name</span>="<span class="pl-s">svg-name</span>"<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">meg-icon</span><span class="pl-kos">&gt;</span>
<span class="pl-kos">&lt;/</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span></pre></div>
      </article>
      <div
        @click="toggleQuickStart"
        :class="['si-qs-tooglebar', state.showQuickStartText ? 'active' : '']">
        <simple-icon name="icon-caret-down1"></simple-icon>
      </div>
    </div>
    <div class="top-content">
      <div class="si-search">
        <simple-icon
          size="24px"
          name="icon-search"></simple-icon>
        <simple-icon
          size="15px"
          name="icon-close"
          @click="clear"></simple-icon>
        <input
          type="text"
          class="search-input"
          placeholder="按项目名称或alias搜索"
          v-model="state.projPage.searchKey"
          @keyup.enter="search"
          />
      </div>
      <!-- <div
        @click="addNewProject"
        class="new-project-btn">
        <simple-icon
          size="17px"
          name="icon-add_1"></simple-icon>
        新建项目
      </div> -->
    </div>
    <div
      class="cards">
      <div
        class="si-loading"
        v-if="showLoading">
        <simple-icon name="icon-spinner2"></simple-icon>
        努力请求中...
      </div>
      <router-link
        v-for="item of state.projects"
        :key="item._id"
        class="card-item"
        :to="`/${item.alias}`">
        <div class="card-title">
          {{ item.name }}
          <span>{{ item.alias }}</span>
        </div>
        <template v-if="projIcons(item).data.length">
          <vue-icon
            original
            v-for="svg of projIcons(item).data"
            :key="svg._id"
            :svg-data="svg"
            height="24px"
            width="24px"></vue-icon>
          <simple-icon
            class="vue-icon"
            v-if="projIcons(item).showMore"
            name="icon-Dot"></simple-icon>
        </template>
        <img
          v-else
          :src="item.poster" />
      </router-link>
      <div>
        <div
          class="si-load-projs"
          @click="getProjects"
          v-if="state.hasMoreProj">
            加载更多
            <simple-icon
              v-if="state.loading"
              name="icon-spinner2"></simple-icon>
          </div>
        <div
          class="si-no-more"
          v-else-if="!showLoading">没有更多项目了~</div>
      </div>
    </div>
    <ul class="si-site-des">
      <li>
        <vue-icon
          original
          style="top: 2px;"
          width="28px"
          height="28px"
          name="svgs/svg1"></vue-icon>
        <div>
          <p>设计师和开发者</p>
          <p>设计师通过CMS管理图标，开发者只需复制代码使用</p>
        </div>
      </li>
      <li>
        <vue-icon
          original
          width="34px"
          height="34px"
          name="svgs/svg2"></vue-icon>
        <div>
          <p>项目制</p>
          <p>按业务线分类来托管图标，每个项目只使用各自的图标</p>
        </div>
      </li>
      <li>
        <vue-icon
          original
          style="top: -3px;"
          width="34px"
          height="34px"
          name="svgs/svg4"></vue-icon>
        <div>
          <p>增强特性</p>
          <p>对SVG进行优化改造，去除多余节点和信息，通过组件化扩展多种特性</p>
        </div>
      </li>
      <li>
        <vue-icon
          original
          width="33px"
          height="33px"
          name="svgs/svg3"></vue-icon>
        <div>
          <p>自动同步</p>
          <p>通过自动化的方式，当图标更新后，项目中无需修改即可自动同步</p>
        </div>
      </li>
    </ul>
    <simple-dialog
      @confirm="confirm"
      v-model="state.showDialog"
      title="新建项目">
      <div class="form-item">
        <div class="form-label">名称</div>
        <input
          v-model="state.form.name"
          style="width: 270px;"
          type="text"
          class="form-input"
          placeholder="请输入项目名称"/>
      </div>
      <div class="form-item">
        <div class="form-label">alias</div>
        <input
          v-model="state.form.alias"
          style="width: 270px;"
          type="text"
          class="form-input"
          placeholder="请输入alias"/>
      </div>
      <div class="form-item">
        <div class="form-label">备注</div>
        <input
          v-model="state.form.mark"
          style="width: 270px;"
          type="text"
          class="form-input"
          placeholder="请输入项目备注"/>
      </div>
    </simple-dialog>
    <message
      v-model="state.message.show"
      :type="state.message.type"
      :message="state.message.msg"></message>
  </div>
</template>
<script>
import { reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import CardFrame from '/@/components/card-frame.vue';
import SimpleIcon from '/@/components/simple-icon.vue';
import SimpleDialog from '/@/components/dialog.vue';
import Message from '/@/components/message.vue';
import SvgIcon from '/@/components/svg-icon.vue';
import InstallCode from '/@/components/install-code.vue';
import { copyToClipboard } from '/@/utils/index.js';

const IndexPage = {
  components: { 
    SimpleIcon,
    SvgIcon,
    InstallCode,
    CardFrame,
    Message,
    SimpleDialog
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      randColor: '#d4237a',
      randIcon: 'icon-liwubeifen',
      loading: false,
      hasMoreProj: false,
      showQuickStartText: false,
      searchType: 'icon',
      showDialog: false,
      projects: [],
      form: {
        name: '',
        alias: '',
        mark: ''
      },
      message: {
        show: false,
        type: 'error',
        msg: ''
      },
      projPage: {
        searchKey: '',
        pageSize: 6,
        pageNum: 0
      },
      pkg: {
        'dist-tags': {
          latest: pkgVersion
        }
      }
    });
    const addNewProject = () => {
      state.showDialog = true;
    }
    const closeDialog = () => {
      state.showDialog = false;
    }
    const updateMsg = (info) => {
      state.message = info;
    }
    const getProjects = async () => {
      state.loading = true;
      state.projPage.pageNum += 1;
      const { code, data, total, msg } = await fetch('/v1/feicons/project/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.projPage)
      }).then(res => res.json());
      state.loading = false;
      if (code === 2100 && data) {
        state.projects = state.projects.concat(data);
        if (data.length + (state.projPage.pageNum - 1) * state.projPage.pageSize < total) {
          state.hasMoreProj = true;
        } else {
          state.hasMoreProj = false;
        }
      } else {
        updateMsg({
          type: 'error',
          msg,
          show: true
        });
      }
    }
    const toggleQuickStart = () => {
      state.showQuickStartText = !state.showQuickStartText;
    }
    const showLoading = computed(() => {
      return state.loading && !state.projects.length;
    });
    const getLatestVersion = async () => {
      const res = await fetch('https://npm-registry.megvii-inc.com/@megvii-icons/vue-svg-icons').then(res => res.json());
      if (res && res['dist-tags'] && res['dist-tags'].latest) {
        state.pkg = res;
      }
    }

    onMounted(async () => {
      let i = 1;
      const icons = ['icon-liwubeifen', 'icon-anquanjisu', 'icon-department', 'icon-camera', 'icon-department1', 'icon-department2', 'icon-gengyijian', 'icon-department3', 'icon-department4', 'icon-yaodian', 'icon-dingwei'];
      const colors = ['#d4237a', '#1296db', '#8a8a8a', '#f4ea2a', '#707070', '#13227a', '#1564cf', '#1afa29', '#1564cf', '#1296db'];
      setInterval(() => {
        state.randIcon = icons[i];
        state.randColor = colors[i];
        i ++;
        if (i >= icons.length) {
          i = 0;
        }
      }, 3000);
      await Promise.all([
        getProjects(),
        getLatestVersion()
      ]);
    });

    const search = async () => {
      state.projects = [];
      state.projPage.pageNum = 0;
      state.hasMoreProj = false;
      await getProjects();
    }
    const clear = () => {
      state.loading = true;
      state.projPage.searchKey = '';
      search();
    }

    return {
      clear,
      state,
      search,
      addNewProject,
      closeDialog,
      updateMsg,
      getProjects,
      showLoading,
      toggleQuickStart
    }
  },
  methods: {
    projIcons(item) {
      const data = item.icons.slice(0, 14);
      return {
        data,
        showMore: data.length >= 14
      };
    },
    async confirm() {
      // TODO: redirect to cms
      const { form } = this.state;
      if (!form.name) {
        return this.updateMsg({
          show: true,
          type: 'error',
          msg: '请输入名称'
        });
      }
      if (!/^[\w\-]{2,30}$/.test(form.alias)) {
        return this.updateMsg({
          show: true,
          type: 'error',
          msg: '请输入2-30位数字字母下划线横杠组成的别名'
        });
      }
      const { code, result, msg } = await fetch('/v1/feicons/project/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          name: form.name,
          alias: form.alias,
          mark: form.mark,
          userId: '-'
        })
      }).then(res => res.json());
      if (code === 2100) {
        this.updateMsg({
          show: true,
          type: 'success',
          msg: '项目创建成功'
        });
        this.closeDialog();
        this.getProjects();
      } else {
        this.updateMsg({
          show: true,
          type: 'error',
          msg
        });
      }
    }
  },
}

export default IndexPage;
</script>
<style lang="scss">
.si-introduce {
  position: absolute;
  left: 0;
  right: 0;
  top: 80px;
  background: #f1f6fc;
  z-index: 1;
  border-bottom: 12px solid #f1f6fd;
  height: 171px;
}
.si-main-info {
  width: 1120px;
  margin: 0 auto;
  padding-top: 40px;
  position: relative;
  background: url(../assets/bg.jpg) 108% center no-repeat;
}
.si-site-name {
  color: #1067D1;
  font-size: 25px;
  font-weight: normal;
  text-shadow: 0.5px 0;
  margin-bottom: 18px;
  line-height: 1;
}
.si-extra-link {
  line-height: 58px;
  a:before {
    content: '•';
    font-size: 18px;
    color: #333;
    margin: 0 10px;
    vertical-align: top;
  }
}
.si-site-slogn {
  color: #777;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(24, 23, 37, 0.06);
  width: 500px;
}
.si-extra-more {
  margin-top: 5px;
  a {
    margin-right: 20px;
  }
}
.si-site-des {
  color:rgba(24, 23, 37, 0.8);
  font-size: 15px;
  padding: 35px 0;
  border-top: 1px solid #eee;
  display: flex;
  align-items: end;
  justify-content: space-between;
  li {
    margin-bottom: 7px;
    line-height: 24px;
    width: 250px;
    display: flex;
    align-items: end;
    position: relative;
    .vue-icon {
      position: absolute;
      top: 0px;
      left: 0;
    }
    div {
      flex: 1;
      margin-top: 4px;
      margin-left: 40px;      
    }
    p:first-child {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    p:last-child {
      color: rgba(24, 23, 37, 0.6);
      line-height: 1.5;
      font-size: 14px;
    }
  }
}
.si-quick-start-title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 210px;
  line-height: 50px;
}
.si-quick-start-wrapper {
  position: relative;
  .si-qs-tooglebar {
    color: #999;
    height: 24px;
    border: 1px solid rgba(24, 23, 37, 0.1);
    box-sizing: border-box;
    bottom: -24px;
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      opacity: 0.75;
    }
    &.active {
      transform: rotate(-180deg);
    }
  }
}
.icon-caret-down {

}
.si-quick-start {
  background: #f7f7f7!important;
  margin: 0!important;
  padding: 10px 0 10px 15px!important;
  height: 50px!important;
  overflow: hidden!important;
  transition: height .3s;
  span {
    text-shadow: none;
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
  &.markdown-body .highlight {
    margin-bottom: 0;
  }
  &::before,&::after {
    box-shadow: none!important;
  }
  &.active {
    height: 300px!important;
  }
}
.card-item {
  width: 346px;
  margin: 0 40px 32px 0;
  background: #fff;
  height: 282px;
  border-radius: 4px;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  transition: all .3s;
  border: 1px solid rgba(24, 23, 37, 0.2);
  img {
    border: 0;
    width: 100%;
    height: 224px;
  }
  &:hover {
    text-decoration: none;
    box-shadow: 0px 17px 30px -15px #e1e2e3;
  }
  &:nth-child(3n) {
    margin-right: 0;
  }
  .vue-icon {
    margin-top: 37px;
    margin-left: 37px;
  }
  .icon-Dot {
    font-size: 18px;
    width: 24px;
    height: 24px;
    text-align: center;
  }
}
.card-title {
  line-height: 54px;
  font-weight: bold;
  color: #181725;
  font-size: 16px;
  border-bottom: 1px solid rgba(24, 23, 37, 0.1);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 10px 0 24px;
  span {
    font-size: 13px;
    color: #999;
  }
}
.simple-icon {
  display: inline-block;
  vertical-align: bottom;
}
.card-icons {
  padding: 28px 10px 0;
}
</style>