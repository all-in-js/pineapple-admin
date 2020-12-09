<template>
  <div
    :class="{enter: state.enter}"
    class="search-page">
    <div class="search-res">
      <span>{{route.query.key}}</span> 的查询结果
    </div>
    <template
      v-for="projAlias of Object.keys(state.projsObj)">
      <div
        :key="projAlias"
        v-if="state.projsObj[projAlias].icons.length"
        class="project-icons">
        <div class="project-name">
          <router-link
            :to="`/${projAlias}`"
            class="si-proj-name">{{ state.projsObj[projAlias].name }} <span class="si-proj-alias">{{ projAlias }}</span></router-link>
        </div>
        <div class="si-project-icons">
          <svg-icon
            v-for="svgInfo of state.projsObj[projAlias].icons"
            :show-ctrls="false"
            :key="svgInfo.name"
            :svg-info="svgInfo"
            @message="showMessage">
          </svg-icon>
        </div>
      </div>
    </template>
  </div>
  <message
    v-model="state.message.show"
    :type="state.message.type"
    :message="state.message.msg"></message>
</template>
<script>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Message from '/@/components/message.vue';
import SimpleIcon from '/@/components/simple-icon.vue';
import SvgIcon from '/@/components/svg-icon.vue';

export default {
  components: {
    Message,
    SimpleIcon,
    SvgIcon
  },
  setup() {
    const state = reactive({
      enter: false,
      svgs: [],
      projsObj: {},
      message: {
        show: false
      }
    });

    const route = useRoute();

    const showMessage = (msgInfo) => {
      state.message = msgInfo;
    }

    const getSvgs = async () => {
      const { type, key } = route.query;
      const { code, data } = await fetch(`/v1/feicons/svg/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          key
        })
      }).then((res) => res.json());
      if (code === 2100 && data.length) {
        data.forEach((item) => {
          state.projsObj[item.alias].icons.push(item);
        });
      }
    }

    onMounted(async () => {
      setTimeout(() => {
        state.enter = true;
      }, 0);
      const { code, data } = await fetch('/v1/feicons/project/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ icons: false })
      }).then((res) => res.json());
      if (code === 2100 && data.length) {
        state.projsObj = data.reduce((obj, item) => {
          obj[item.alias] = {
            name: item.name,
            icons: []
          }
          return obj;
        }, {});
      }

      getSvgs();
    });

    return {
      route,
      state,
      getSvgs,
      showMessage
    }
  }
}
</script>
<style lang="scss">
.search-page {
  opacity: 0;
  transform: translateX(10px);
  transition: all .3s;
}
.search-page.enter {
  opacity: 1;
  transform: translateX(0);
}
.search-res {
  font-size: 13px;
  color: #999;
  line-height: 50px;
  span {
    color: #0366d6;
  }
}

</style>