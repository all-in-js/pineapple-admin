<script>
import { h } from 'vue';

const CardFrame = {
  name: 'CardFrame',
  props: {
    // 容器渲染的tag标签
    tag: {
      type: String,
      default: 'div'
    },
    // 容器内卡片的最小宽度
    cardMinWidth: {
      type: Number,
      default: 200,
      required: true
    },
    // 卡片间距
    gap: {
      type: Number,
      default: 10
    }
  },
  render() {
    const { tag, cardMinWidth, gap, $slots } = this;
    return h(tag, {
      class: 'card-frame',
      style: {
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))`,
        gridGap: `${gap}px`
      }
    }, [
      $slots.default && $slots.default()
    ]);
  }
};

export default CardFrame;
</script>
<style lang="scss">
.card-frame {
  display: grid;
  grid-auto-rows: min-content;
}
</style>