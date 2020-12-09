<template>
  <div
    class="icons-page"
    :class="{enter: state.enter}">
    <div class="si-bread-crumb">
      <router-link to="/">Icons</router-link>
      <span> / </span>
      <span>{{ state.project.name || '' }} <span class="si-proj-alias">{{ state.project.alias || '' }}</span></span>  
    </div>
    <div class="si-icons-sear">
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
          placeholder="搜索图标关键词，点击图标可复制代码"
          v-model="state.iconsList.searchKey"
          @keyup.enter="search"
          />
      </div>
    </div>
    <div class="project-icons">
      <div class="project-name">
        <div class="si-proj-name">{{ state.project.name }} <span class="si-proj-alias">{{ state.project.alias }}</span></div>
        <p class="upload-info">{{ state.info }}</p>
        <!-- <label
          for="upload-field"
          class="upload-btn">
          <simple-icon
            size="17px"
            name="icon-add_1"></simple-icon>
          (批量)上传图标
        </label>
        <input
          hidden
          multiple
          type="file"
          name="svg"
          accept=".svg"
          id="upload-field"
          @change="upload" /> -->
        <!-- <post-download
          :action="`https://fe-cms.mcd.megvii-inc.com/v1/feicons/project/export?type=js&alias=${route.params.alias}`"
          :btnText="`导出 ${ route.params.alias }.js`"
          btnClass="upload-btn"></post-download> -->
        <post-download
          :action="`/v1/feicons/project/export?type=zip&alias=${route.params.alias}`"
          :btnText="`下载全部`"
          btnClass="upload-btn"></post-download>
      </div>
      <div class="si-project-icons">
        <div
          class="si-loading"
          v-if="showLoading">
          <simple-icon name="icon-spinner2"></simple-icon>
          努力请求中...
        </div>
        <svg-icon
          v-for="svgInfo of state.svgs"
          :key="svgInfo.name"
          :svg-info="svgInfo"
          @update-list="updateList"
          @message="showMessage">
        </svg-icon>
        <div>
          <div
            class="si-load-projs"
            @click="getSvgs"
            v-if="state.hasMoreProj">
              加载更多
              <simple-icon
                v-if="state.loading"
                name="icon-spinner2"></simple-icon>
            </div>
          <div
            class="si-no-more"
            v-else-if="!showLoading">没有更多图标了~</div>
        </div>
      </div>
    </div>
  </div>
  <message
    v-model="state.message.show"
    :type="state.message.type"
    :message="state.message.msg"></message>
</template>
<script>
import { reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import SimpleIcon from '/@/components/simple-icon.vue';
import SvgIcon from '/@/components/svg-icon.vue';
import Message from '/@/components/message.vue';
import PostDownload from '/@/components/post-download.vue';

let svgs;

export default {
  components: {
    SimpleIcon,
    SvgIcon,
    Message,
    PostDownload
  },
  setup() {
    const state = reactive({
      loading: true,
      hasMoreProj: false,
      enter: false,
      svgs: [],
      info: '',
      project: {},
      message: {
        show: false,
        type: '',
        msg: ''
      },
      iconsList: {
        searchKey: '',
        pageSize: 70,
        pageNum: 0
      }
    });
    const route = useRoute();

    const getSvgs = async () => {
      state.loading = true;
      state.iconsList.pageNum += 1;
      const { code, data, msg } = await fetch(`/v1/feicons/project/iconsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...state.iconsList,
          ...{
            alias: route.params.alias
          }
        })
      }).then((res) => res.json());
      state.loading = false;
      if (code === 2100) {
        state.svgs = state.svgs.concat(data.svgs || []);
        state.project = data.project || {};
        if (data.svgs.length + (state.iconsList.pageNum - 1) * state.iconsList.pageSize < data.total) {
          state.hasMoreProj = true;
        } else {
          state.hasMoreProj = false;
        }
      } else {
        state.message = {
          type: 'error',
          msg,
          show: true
        };
      }
    }

    const updateList = () => {
      getSvgs();
    }

    const showMessage = (msgInfo) => {
      state.message = msgInfo;
    }

    const showLoading = computed(() => {
      return state.loading && !state.svgs.length;
    });

    onMounted(async () => {
      setTimeout(() => {
        state.enter = true;
      }, 0);
      getSvgs();
    });

    const search = () => {
      state.svgs = [];
      state.hasMoreProj = false;
      state.iconsList.pageNum = 0;
      getSvgs();
    }

    const clear = () => {
      state.iconsList.searchKey = '';
      search();
    }

    return {
      search,
      clear,
      state,
      route,
      getSvgs,
      updateList,
      showMessage,
      showLoading
    }
  },
  methods: {
    async upload(e) {
      // TODO: redirect to cms
      const { files } = e.target;
      const { alias } = this.$route.params;
      if (files && files.length) {
        let all = 0;
        let suc = 0;
        let fails = [];
        for ( const file of Array.from(files)) {
          if (file.name.endsWith('.svg')) {
            const fd = new FormData();
            const name = file.name.replace(/\.svg$/, '');
            fd.append('svg', file);
            const { code } = await fetch(`/v1/feicons/svg/upload?alias=${alias}&name=${name}`, {
              method: 'POST',
              body: fd
            }).then((res) => res.json());
            all += 1;
            if (all >= files.length) {
              this.getSvgs();
            }
            if (code === 2100) {
              suc += 1;
            } else {
              fails.push(file.name);
            }
            this.state.info = `正在上传${files.length}个图标: 进度${parseInt(suc/files.length*100)}%; 成功${suc}个; 失败${fails.length}个: ${JSON.stringify(fails)}`;
          } else {
            this.state.message = {
              show: true,
              type: 'error',
              msg: `不支持上传此类文件：${file.name}`
            }
          }
        }
      }
    }
  },
}
</script>
<style lang="scss">
.icons-page {
  opacity: 0;
  transform: translateX(5px);
  transition: all .3s;
}
.icons-page.enter {
  opacity: 1;
  transform: translateX(0);
}
.si-icons-sear {
  display: flex;
  justify-content: center;
}
.project-name {
  margin: 10px 0 20px;
  line-height: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
  .si-proj-name {
    font-size: 16px;
    font-weight: 600;
    color: #181725;
  }
}
.si-proj-alias {
  font-size: 13px;
  color: #999;
}
.upload-btn {
  border: 1px solid #ccc;
  border-radius: 6px;
  color: #6b7177;
  background: #fafafa;
  cursor: pointer;
  line-height: 28px;
  height: 28px;
  padding: 0 20px;
  margin-left: 20px;
  transition: all .3s ease-in;
  &:hover {
    color: #0366d6;
    background: #f5fafd;
    border-color: #b6cee8;
  }
  .simple-icon {
    vertical-align: bottom;
  }
}
.upload-info {
  flex: 1;
  text-align: right;
  padding-right: 20px;
  font-size: 12px;
  color: #999;
  font-weight: normal;
  line-height: 1.5;
}
</style>