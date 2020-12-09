<template>
  <div
    class="si-docs-page"
    :class="{enter: state.enter}">
    <div class="si-bread-crumb">
      <router-link to="/">Icons</router-link>
      <span> / </span>
      <span>使用文档</span>  
    </div>
    <article class="markdown-body entry-content container-lg" itemprop="text">
    <h2>Megvii-SVG-Icons</h2>
    <blockquote> 
      <p>基于 svg 的图标管理和组件化方案</p> 
    </blockquote> 
    <p align="left">
      <img :src="state.flowChart" />
    </p> 
    <p>整体工作流程分为两步：</p> 
    <ol> 
      <li><a href="https://fe-cms.mcd.megvii-inc.com/project" target="_blank">管理平台</a>，在这里可以新建一个项目，然后导入需要使用的 svg 图标，当然也能对图标进行增删改查等操作；</li> 
      <li>项目中使用，在管理平台上的项目都有一个唯一标识 alias，通过这个标识符，可以在项目中使用时只拉取该项目下的图标，避免引入项目以外的图标；</li> 
    </ol> 
    <p>为了能够使各个项目的图标能够独立维护，且不加载项目以外的额外的图标，所以将图标的数据与组件进行了剥离，也就是按需加载项目所需的图标；并且能够保证数据有更新后，项目里能够即时同步，只需要配置一个 webpack loader，将项目的 alias 传入该 loader，即可实现管理平台上图标有更新后，无需重新构建和发布组件包即可使用到最新的图标；</p>
    <h3>
      <svg class="octicon octicon-link" viewbox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>
      </svg>vue 组件，@megvii-icons/vue-svg-icons</h3> 
    <p>支持设置渐变、多色、兼容本地 svg 组件等特性，支持通过配置 webpack loader 自动同步管理平台上的图标数据集，也可以加载本地的图标数据集；</p> 
    <ul> 
      <li><strong>安装及使用</strong></li> 
    </ul>
    <install-code />
    <div class="highlight highlight-source-js">
      <pre style="width:100%"><span class="pl-k">import</span> <span class="pl-v">Vue</span> <span class="pl-k">from</span> <span class="pl-s">'vue'</span><span class="pl-kos">;</span>
<span class="pl-k">import</span> <span class="pl-v">VueSvgIcons</span> <span class="pl-k">from</span> <span class="pl-s">'@megvii-icons/vue-svg-icons'</span><span class="pl-kos">;</span>

<span class="pl-v">Vue</span><span class="pl-kos">.</span><span class="pl-en">use</span><span class="pl-kos">(</span><span class="pl-v">VueSvgIcons</span><span class="pl-kos">,</span> <span class="pl-kos">{</span>
  <span class="pl-c1">tagName</span>: <span class="pl-s">'meg-icon'</span>
<span class="pl-kos">}</span><span class="pl-kos">)</span><span class="pl-kos">;</span></pre>
    </div> 
    <ul> 
      <li><strong>基本用法</strong></li> 
    </ul> 
    <div class="highlight highlight-text-html-basic">
      <div class="si-docs-example-show">
        <vue-icon
          original
          width="30px"
          height="30px"
          color="#607D8B"
          name="svgs/face"></vue-icon>
      </div>
      <pre><span class="pl-kos">&lt;</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span>
  <span class="pl-kos">&lt;</span><span class="pl-ent">meg-icon</span> <span class="pl-c1">name</span>=&quot;<span class="pl-s">svgs/face</span>&quot;<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">meg-icon</span><span class="pl-kos">&gt;</span>
<span class="pl-kos">&lt;/</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span></pre>
    </div>
    <ul> 
      <li><strong>width / height</strong></li> 
    </ul> 
    <div class="highlight highlight-text-html-basic">
      <div class="si-docs-example-show">
        <vue-icon
          original
          width="45px"
          height="45px"
          color="#607D8B"
          name="svgs/size"></vue-icon>
      </div>
      <pre>
<span class="pl-kos">&lt;</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span>
  <span class="pl-kos">&lt;</span><span class="pl-ent">meg-icon</span>
    <span class="pl-c1">width</span>=&quot;<span class="pl-s">45px</span>&quot;
    <span class="pl-c1">height</span>=&quot;<span class="pl-s">45px</span>&quot;
    <span class="pl-c1">name</span>=&quot;<span class="pl-s">svgs/size</span>&quot;<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">meg-icon</span><span class="pl-kos">&gt;</span>
<span class="pl-kos">&lt;/</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span></pre>
    </div>
    <ul> 
      <li><strong>color</strong></li> 
    </ul> 
    <div class="highlight highlight-text-html-basic">
      <div class="si-docs-example-show">
        <vue-icon
          original
          width="30px"
          height="30px"
          color="#5668ad"
          name="svgs/color"></vue-icon>
      </div>
      <pre>
<span class="pl-kos">&lt;</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span>
  <span class="pl-kos">&lt;</span><span class="pl-ent">meg-icon</span>
    <span class="pl-c1">color</span>=&quot;<span class="pl-s">#5668ad</span>&quot;
    <span class="pl-c1">name</span>=&quot;<span class="pl-s">svgs/color</span>&quot;<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">meg-icon</span><span class="pl-kos">&gt;</span>
<span class="pl-kos">&lt;/</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span></pre>
    </div>
    <ul> 
      <li><strong>color: 设置多色</strong></li> 
    </ul> 
    <div class="highlight highlight-text-html-basic">
      <div class="si-docs-example-show">
        <vue-icon
          original
          width="30px"
          height="30px"
          color="yellow red"
          name="svgs/favor_color"></vue-icon>
      </div>
      <pre>
<span class="pl-kos">&lt;</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span>
  <span class="pl-kos">&lt;</span><span class="pl-ent">meg-icon</span>
    <span class="pl-c1">color</span>=&quot;<span class="pl-s">yellow red</span>&quot;
    <span class="pl-c1">name</span>=&quot;<span class="pl-s">svgs/favor_color</span>&quot;<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">meg-icon</span><span class="pl-kos">&gt;</span>
<span class="pl-kos">&lt;/</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span></pre>
    </div>
    <ul> 
      <li><strong>spin</strong></li> 
    </ul> 
    <div class="highlight highlight-text-html-basic">
      <div class="si-docs-example-show">
        <vue-icon
          original
          spin
          width="30px"
          height="30px"
          name="svgs/circle_spin"></vue-icon>
      </div>
      <pre>
<span class="pl-kos">&lt;</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span>
  <span class="pl-kos">&lt;</span><span class="pl-ent">meg-icon</span>
    <span class="pl-c1">spin</span>
    <span class="pl-c1">name</span>=&quot;<span class="pl-s">svgs/circle_spin</span>&quot;<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">meg-icon</span><span class="pl-kos">&gt;</span>
<span class="pl-kos">&lt;/</span><span class="pl-ent">template</span><span class="pl-kos">&gt;</span></pre>
    </div>
    <ul> 
      <li>Plugin Props</li> 
    </ul> 
    <table> 
      <thead> 
      <tr> 
        <th>名称</th> 
        <th>类型</th> 
        <th>默认值</th> 
        <th>说明</th> 
      </tr> 
      </thead> 
      <tbody> 
      <tr> 
        <td>svgIcons</td> 
        <td>object</td> 
        <td>-</td> 
        <td>svg数据集</td> 
      </tr> 
      <tr> 
        <td>tagName</td> 
        <td>string</td> 
        <td>meg-icon</td> 
        <td>组件名</td> 
      </tr> 
      <tr> 
        <td>classPrefix</td> 
        <td>string</td> 
        <td>meg</td> 
        <td>class前缀</td> 
      </tr> 
      <tr> 
        <td>isStroke</td> 
        <td>boolean</td> 
        <td>false</td> 
        <td>默认使用描边样式</td> 
      </tr> 
      <tr> 
        <td>defaultWidth</td> 
        <td>string</td> 
        <td>-</td> 
        <td>默认宽</td> 
      </tr> 
      <tr> 
        <td>defaultHeight</td> 
        <td>string</td> 
        <td>-</td> 
        <td>默认高</td> 
      </tr> 
      </tbody> 
    </table> 
    <ul> 
      <li>Component Props</li> 
    </ul> 
    <table> 
      <thead> 
      <tr> 
        <th>名称</th> 
        <th>类型</th> 
        <th>默认值</th> 
        <th>说明</th> 
      </tr> 
      </thead> 
      <tbody> 
      <tr> 
        <td>component</td> 
        <td>VueComponent</td> 
        <td>-</td> 
        <td>svg 组件</td> 
      </tr> 
      <tr> 
        <td>rotate</td> 
        <td>number</td> 
        <td>false</td> 
        <td>旋转角度</td> 
      </tr> 
      <tr> 
        <td>spin</td> 
        <td>boolean</td> 
        <td>false</td> 
        <td>是否添加旋转动画，实现loading效果</td> 
      </tr> 
      <tr> 
        <td>icon</td> 
        <td>string</td> 
        <td>-</td> 
        <td>图标名称</td> 
      </tr> 
      <tr> 
        <td>name</td> 
        <td>string</td> 
        <td>-</td> 
        <td>图标名称</td> 
      </tr> 
      <tr> 
        <td>width</td> 
        <td>string</td> 
        <td>-</td> 
        <td>图标宽</td> 
      </tr> 
      <tr> 
        <td>height</td> 
        <td>string</td> 
        <td>-</td> 
        <td>图标高</td> 
      </tr> 
      <tr> 
        <td>scale</td> 
        <td>number</td> 
        <td>-</td> 
        <td>放大倍数</td> 
      </tr> 
      <tr> 
        <td>fill</td> 
        <td>boolean</td> 
        <td>true</td> 
        <td>使用填充样式</td> 
      </tr> 
      <tr> 
        <td>color</td> 
        <td>string</td> 
        <td>-</td> 
        <td>颜色</td> 
      </tr> 
      <tr> 
        <td>title</td> 
        <td>string</td> 
        <td>-</td> 
        <td>标题</td> 
      </tr> 
      <tr> 
        <td>original</td> 
        <td>boolean</td> 
        <td>false</td> 
        <td>是否显示原色</td> 
      </tr>
      </tbody> 
    </table> 
    <p></p>
    <p>由于组件默认不携带 svg 数据集，所以仅仅依靠组件还无法使用图标，目前支持两种方式导入 svg 数据到项目里来使用：</p>
    <h3>使用 webpack loader 自动同步数据集</h3> 
    <p>在项目中安装 @megvii-icons/pull-svg-icons，并修改 webpack 配置，如下，复制粘贴，修改 projects 参数即可，projects 为项目的 alias 值，一般不会有多个，如果有多个的话用逗号隔开：</p>
    <ul>
      <li>webpack 配置</li>
    </ul>
    <div class="highlight highlight-source-js">
      <pre style="width:100%">rules: <span class="pl-kos">[</span>
  <span class="pl-kos">{</span>
    <span class="pl-c1">test</span>: <span class="pl-pds">/<span class="pl-cce">\.</span>js<span class="pl-cce">$</span>/</span><span class="pl-kos">,</span>
    <span class="pl-c1">loader</span>: <span class="pl-s">'@megvii-icons/pull-svg-icons'</span><span class="pl-kos">,</span>
    <span class="pl-c1">options</span>: <span class="pl-kos">{</span>
      <span class="pl-c1">requestUri</span>: <span class="pl-s">'https://fe-cms.mcd.megvii-inc.com/v1/feicons/svg/pullSvgIcons'</span><span class="pl-kos">,</span>
      <span class="pl-c1">projects</span>: <span class="pl-s">'megdesign'</span>
    <span class="pl-kos">}</span>
  <span class="pl-kos">}</span>
<span class="pl-kos">]</span></pre>
    </div> 
    <ul>
      <li>webpack-chain 配置</li>
    </ul>
    <div class="highlight highlight-source-js"><pre style="width:100%"><span class="pl-en">chainWebpack</span><span class="pl-kos">(</span><span class="pl-s1">config</span><span class="pl-kos">)</span><span class="pl-kos"></span> <span class="pl-kos">{</span>
  <span class="pl-s1">config</span><span class="pl-kos">.</span><span class="pl-c1">module</span>
    <span class="pl-kos">.</span><span class="pl-en">rule</span><span class="pl-kos">(</span><span class="pl-s">'meg-icon'</span><span class="pl-kos">)</span>
    <span class="pl-kos">.</span><span class="pl-en">test</span><span class="pl-kos">(</span><span class="pl-pds">/<span class="pl-cce">\.</span>js<span class="pl-cce">$</span>/</span><span class="pl-kos">)</span>
    <span class="pl-kos">.</span><span class="pl-en">use</span><span class="pl-kos">(</span><span class="pl-s">'pull-svg-icons'</span><span class="pl-kos">)</span>
    <span class="pl-kos">.</span><span class="pl-en">loader</span><span class="pl-kos">(</span><span class="pl-s">'@megvii-icons/pull-svg-icons'</span><span class="pl-kos">)</span>
    <span class="pl-kos">.</span><span class="pl-en">tap</span><span class="pl-kos">(</span><span class="pl-kos">(</span><span class="pl-kos">)</span> <span class="pl-c1">=&gt;</span> <span class="pl-kos">{</span>
      <span class="pl-k">return</span> <span class="pl-kos">{</span>
        <span class="pl-c1">requestUri</span>: <span class="pl-s">'https://fe-cms.mcd.megvii-inc.com/v1/feicons/svg/pullSvgIcons'</span><span class="pl-kos">,</span>
        <span class="pl-c1">projects</span>: <span class="pl-s">'cbg-icons'</span>
      <span class="pl-kos">}</span>
    <span class="pl-kos">}</span><span class="pl-kos">)</span><span class="pl-kos">;</span>
<span class="pl-kos">}</span></pre></div>
    <p>相关配置参数：</p> 
    <table> 
      <thead> 
      <tr> 
        <th>名称</th> 
        <th>类型</th> 
        <th>默认值</th> 
        <th>说明</th> 
      </tr> 
      </thead> 
      <tbody> 
      <tr> 
        <td>requestUri</td> 
        <td>string</td> 
        <td>-</td> 
        <td>拉取图标数据集的接口</td> 
      </tr> 
      <tr> 
        <td>projects</td> 
        <td>string</td> 
        <td>common</td> 
        <td>项目 alias，多个用逗号隔开</td> 
      </tr> 
      <tr> 
        <td>cacheResponse</td> 
        <td>boolean</td> 
        <td>true</td> 
        <td>是否缓存已拉取过来的图标数据集，为 true 时，当图标有更新后，需要重启应用</td> 
      </tr> 
      </tbody> 
    </table> 
    <h3>使用 svg2js 生成的数据集</h3> 
    <p>支持使用包自带的 svg2js 命令将本地的 svg 文件转换成组件可用的数据集；</p> 
    <div class="highlight highlight-source-js">
      <pre style="width:100%"><span class="pl-s1">svg2js</span> <span class="pl-s1">assets</span>/<span class="pl-s1">svgs</span> <span class="pl-c1">--</span><span class="pl-s1">outFile</span> <span class="pl-s1">svgs</span><span class="pl-kos">.</span><span class="pl-c1">js</span></pre>
    </div>
    <h3>使用 pull-svg 拉取管理平台上的图标数据</h3> 
    <p>支持使用包自带的 pull-svg 命令拉取管理平台上的图标数据；</p> 
    <div class="highlight highlight-source-js">
      <pre style="width:100%"><span class="pl-s1">pull-svg</span> <span class="pl-c1">--</span><span class="pl-s1">projects</span> <span class="pl-s1">demo</span> <span class="pl-c1">--</span><span class="pl-s1">outFile</span> <span class="pl-s1">svgs</span><span class="pl-kos">.</span><span class="pl-c1">js</span></pre>
    </div> 
    <h3>使用生成的数据集</h3> 
    <div class="highlight highlight-source-js">
      <pre style="width:100%">
<span class="pl-k">import</span> <span class="pl-v">Vue</span> <span class="pl-k">from</span> <span class="pl-s">'vue'</span><span class="pl-kos">;</span>
<span class="pl-k">import</span> <span class="pl-v">VueSvgIcons</span> <span class="pl-k">from</span> <span class="pl-s">'@megvii-icons/vue-svg-icons'</span><span class="pl-kos">;</span>
<span class="pl-k">import</span> <span class="pl-v">SvgIcons</span> <span class="pl-k">from</span> <span class="pl-s">'svgs.js'</span><span class="pl-kos">;</span>

<span class="pl-v">Vue</span><span class="pl-kos">.</span><span class="pl-en">use</span><span class="pl-kos">(</span><span class="pl-v">VueSvgIcons</span><span class="pl-kos">,</span> <span class="pl-kos">{</span>
  <span class="pl-c1">svgIcons</span>: <span class="pl-v">SvgIcons</span>
<span class="pl-kos">}</span><span class="pl-kos">)</span><span class="pl-kos">;</span></pre>
  </div> 
  <h3>@megvii-icons/svgo</h3> 
  <p>优化 svg 信息，删除多余节点，压缩 svg 体积，并将节点信息转为 js，方便统一管理和进一步的优化工作；</p> 
  <div class="highlight highlight-source-js">
    <pre style="width:100%"><span class="pl-k">const</span> <span class="pl-kos">{</span> SvgOptimize <span class="pl-kos">}</span> <span class="pl-c1">=</span> <span class="pl-en">require</span><span class="pl-kos">(</span><span class="pl-s">'@megvii-icons/svgo'</span><span class="pl-kos">)</span><span class="pl-kos">;</span>
<span class="pl-k">const</span> <span class="pl-s1">svgo</span> <span class="pl-c1">=</span> <span class="pl-k">new</span> <span class="pl-v">SvgOptimize</span><span class="pl-kos">(</span><span class="pl-kos">{</span><span class="pl-c">/* svgo options */</span><span class="pl-kos">}</span><span class="pl-kos">)</span><span class="pl-kos">;</span>

<span class="pl-kos">(</span><span class="pl-k">async</span> <span class="pl-kos">(</span><span class="pl-kos">)</span> <span class="pl-c1">=&gt;</span> <span class="pl-kos">{</span>
  <span class="pl-c">/**</span>
<span class="pl-c">   * svgInfo: {</span>
<span class="pl-c">   *  name: string;</span>
<span class="pl-c">   *  data: string;</span>
<span class="pl-c">   *  viewBox: string;</span>
<span class="pl-c">   *  width: number;</span>
<span class="pl-c">   *  height: number;</span>
<span class="pl-c">   * }</span>
<span class="pl-c">   */</span>
  <span class="pl-k">const</span> <span class="pl-s1">svgInfo</span> <span class="pl-c1">=</span> <span class="pl-k">await</span> <span class="pl-s1">svgo</span><span class="pl-kos">.</span><span class="pl-en">build</span><span class="pl-kos">(</span><span class="pl-s">'svg-filename'</span><span class="pl-kos">,</span> <span class="pl-s">'svg-content'</span><span class="pl-kos">)</span><span class="pl-kos">;</span>
<span class="pl-kos">}</span><span class="pl-kos">)</span><span class="pl-kos">(</span><span class="pl-kos">)</span><span class="pl-kos">;</span></pre>
    </div> 
    <h3>公共组件库集成</h3> 
    <ol>
      <li>当图标库被组件库集成时，由于组件库本身有图标数据，在项目中使用组件库时，项目也有自己的图标数据，就需要将两个地方的图标数据做一次合并，来给图标组件使用，并且需要保证图标可以自动同步；</li>
      <li>目前统一的集成方案是：为组件库添加 postinstall 脚本，并将 @megvii-icons/vue-svg-icons 添加到 webpack 的 externals 选项中；</li>
      <li>postinstall 脚本里通过一个 update-icon --projects 命令拉取指定项目的图标数据并将其挂载到 @megvii-icons/vue-svg-icons 组件中；</li>
      <li>当安装最新的 @megvii-icons/vue-svg-icons 时即可获得 update-icon 命令</li>
    </ol>
    </article>
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue';
import InstallCode from '/@/components/install-code.vue';
import flowChart from '../assets/flow-chart.jpg';

export default {
  components: {
    InstallCode
  },
  setup() {
    const state = reactive({
      enter: false,
      showCopyTip: false,
      flowChart
    });

    onMounted(() => {
      setTimeout(() => {
        state.enter = true;
      }, 0);
    });

    const copyInstall = () => {
      copyToClipboard(state.c);
      state.showCopyTip = true;
      setTimeout(() => {
        state.showCopyTip = false;
      }, 700);
    }

    return {
      state,
      copyInstall
    }
  }
}
</script>
<style lang="scss">
.si-docs-page {
  opacity: 0;
  transform: translateX(5px);
  transition: all .3s;
  &.enter {
    opacity: 1;
    transform: translateX(0);
  }
  ol, ul {
    list-style: disc;
  }
  .si-docs-example-show {
    position: absolute;
    top: 27px;
    left: 45%;
  }
  .markdown-body .highlight pre {
    width: 38%;
  }
  .si-install-copy-bar {
    top: 15px;
    left: 640px;
  }
  .si-copy-tip {
    left: 628px;
    top: -5px;
  }
}
</style>