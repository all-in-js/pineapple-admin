<template>
  <div
    :class="{enter: state.enter}"
    class="si-about-page">
    <div class="si-bread-crumb">
      <router-link to="/">Icons</router-link>
      <span> / </span>
      <span>关于</span>
    </div>
    <h1>关于</h1>
    <p>MegIcon 倾力打造公司矢量图标管理平台。</p>
    <p class="si-marginbottom">设计师/开发者将图标上传到 MegIcon 平台，用户以项目为单位创建项目 Icon 资源包，上传 SVG 资源，便于前端工程师自由调整与调用。</p>
    <h3>团队</h3>
    <p>中台前端部 <a href="mailto:cto-fe-base@megvii.com">&lt;cto-fe-base@megvii.com&gt;</a>、CBG前端部 <a href="mailto:sng-web@megvii.com">&lt;sng-web@megvii.com&gt;</a>、中台设计部 <a href="mailto:megdesign@megvii.com">&lt;megdesign@megvii.com&gt;</a></p>
    <div class="si-table si-marginbottom">
      <table>
        <tr>
          <td>
            <img :src="hufeng" />
            <span>
              <strong>胡峰</strong> <a href="mailto:hufeng@megvii.com">hufeng@megvii.com</a>（CBG）
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <img :src="chenyang" />
            <span>
              <strong>陈阳</strong> <a href="mailto:chenyang@megvii.com">chenyang@megvii.com</a> （EBG）
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <img :src="zhangyumeng" />
            <span>
              <strong>张雨蒙</strong> <a href="mailto:zhangyumeng@megvii.com">zhangyumeng@megvii.com</a>（中台前端部）
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <img :src="caihao" />
            <span>
              <strong>蔡皓</strong> <a href="mailto:caihao@megvii.com">caihao@megvii.com</a>（Data++）
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <img :src="qishu" />
            <span>
              <strong>张其姝</strong> <a href="mailto:zhangqishu@megvii.com">zhangqishu@megvii.com</a>（EBG）
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <img :src="lizonglei" />
            <span>
              <strong>李宗磊</strong> <a href="mailto:lizonglei@megvii.com">lizonglei@megvii.com</a>（中台设计部）
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <img :src="chenxi" />
            <span>
              <strong>王晨馨</strong> <a href="mailto:wangchenxin@megvii.com">wangchenxin@megvii.com</a>（中台设计部）
            </span>
          </td>
        </tr>
      </table>
    </div>
    <h3>获取帮助</h3>
    <div class="si-qa si-marginbottom">
      <div class="si-qa-item">
        <p>Q1: 如何登陆管理平台？</p>
        <p>A1: 管理平台地址：https://fe-cms.mcd.megvii-inc.com；如遇权限问题，请钉钉联系@胡峰 hufeng@megvii.com</p>
      </div>
      <div class="si-qa-item">
        <p>Q2: 如何在管理平台创建 Icon 项目并且导入 Icon？</p>
        <ul>
          <li>A2: 1. 成功登陆管理平台</li>
          <li>2. 左侧菜单进入 Icon 项目管理页</li>
          <li>3. 按要求完成新增项目</li>
          <li>4. 列表中查看项目 Icon</li>
          <li>5. 完成项目所需 Icon 导入即可</li>
        </ul>
      </div>
      <div class="si-qa-item">
        <p>Q3: 是不是每次更新图标后都需要在项目中重新安装包？</p>
        <p>A3: 通过 Webpack Loader，将项目的 alias 传入该 loader，即可实现即时生效。</p>
      </div>
      <div class="si-qa-item">
        <p>Q4: Icon使用文档中只有在 Vue 中的使用案例，是不是不支持其它框架？</p>
        <p>A4: 当前版本我们仅支持 Vue(2.x, 3.x) 的使用，下期迭代版本中将实现对多框架的支持，尽请期待。</p>
      </div>
    </div>
    <h3>加入我们</h3>
    <p class="si-marginbottom">目前 MegIcon 正处于更新迭代阶段，如果您对此比较感兴趣，请随时联系我们！欢迎您的加入！</p>
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue';
import zhangyumeng from '/@/assets/team/img/zhangyumeng.jpg';
import qishu from '/@/assets/team/img/qishu.jpeg';
import chenyang from '/@/assets/team/img/chenyang.png';
import chenxi from '/@/assets/team/img/chenxi.jpg';
import lizonglei from '/@/assets/team/img/lizonglei.jpg';
import hufeng from '/@/assets/team/img/hufeng.jpg';
import caihao from '/@/assets/team/img/caihao.jpg';

export default {
  data() {
    this.zhangyumeng = zhangyumeng;
    this.qishu = qishu;
    this.chenyang = chenyang;
    this.chenxi = chenxi;
    this.lizonglei = lizonglei;
    this.hufeng = hufeng;
    this.caihao = caihao;
  },
  setup() {
    const state = reactive({
      enter: false
    });

    onMounted(() => {
      setTimeout(() => {
        state.enter = true;
      }, 0);
    });

    return {
      state
    };
  }
}
</script>
<style lang="scss">
.si-about-page {
  opacity: 0;
  transform: translateX(5px);
  transition: all .3s;
}
.si-about-page.enter {
  opacity: 1;
  transform: translateX(0);
}
.si-about-page {
  p {
    font-size: 15px;
    color: #233333;
  }
  .si-table {
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, .125);
    width: 900px;
    margin: 15px 0;
    table {
      width: 100%;
      tr {
        border-top: 1px solid rgba(0, 0, 0, .125);
        &:first-child {
          border-top: 0;
        }
      }
      td {
        line-height: 32px;
        padding: 10px 15px;
        img {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          vertical-align: middle;
          margin-right: 15px;
        }
      }
    }
  }
  .si-qa-item {
    margin-bottom: 13px;
    p {
      line-height: 1.7;
      &:first-child {
        font-weight: bold;
      }
    }
    li {
      padding-left: 25px;
      &:first-child {
        padding-left: 0;
      }
    }
  }
  .si-marginbottom {
    margin-bottom: 40px;
  }
}
</style>