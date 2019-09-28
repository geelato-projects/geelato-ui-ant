<template>
  <div>
    <a-row v-for="(row,rowIndex) in rows" :gutter="row.gutter" :key="rowIndex">
      <a-col v-for="(col,colIndex) in row.cols" :span="col.span" :offset="col.offset" :key="colIndex">
        <!--设置col.cardConfig的值-->
        <template v-if="col.card&&(col.cardConfig=getCardConfig(col.card))">
          <a-card v-bind="col.cardConfig">
            <span href="#" slot="title">
              <a-icon v-if="col.cardConfig.icon" :type="col.cardConfig.icon"/>
              {{col.cardConfig.title}}
            </span>
            <!--<component :ref="col.card" :is="getCardComponent(col.card)"-->
            <!--:opts="col.cardConfig.opts"-->
            <!--:query="col.cardConfig.query">-->
            <!--正在加载...-->
            <!--</component>-->
            <component :ref="col.card" :is="getCardComponent(col.card)"
                       v-bind="col.cardConfig.content.props">
              正在加载...
            </component>
            <span href="#" slot="extra">
              <!--<a><a-icon type="eye-invisible" @click="col.cardConfig.visible=false;$nextTick()"/></a>-->
            </span>
          </a-card>
        </template>
        <template v-else-if="col.rows">
          <gl-card-layout-item :rows="col.rows" :cardMap="cardMap"></gl-card-layout-item>
        </template>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: "GlCardLayoutItem",
    props: {
      cardMap: {
        type: Object,
        required: true
      },
      rows: {
        type: Array,
        required: true
      }
    },
    methods: {
      getCardConfig(cardId) {
        return this.cardMap[cardId]
      },
      getCardComponent(cardId) {
        let card = this.getCardConfig(cardId)
        return Vue.component(card.content.component)
      }
    }
  }
</script>

<style scoped>

</style>
