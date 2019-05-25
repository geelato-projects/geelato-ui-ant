<template>
  <div>
    <a-row v-for="(row,rowIndex) in rows" :gutter="row.gutter" :key="rowIndex">
      <a-col v-for="(col,colIndex) in row.cols" :span="col.span" :offset="col.offset" :key="colIndex">
        <template v-if="col.card">
          <a-card :title="getCardConfig(col.card).title" style="margin-top: 8px">
            <component :ref="col.card" :is="getCardComponent(col.card)"
                       :opts="getCardConfig(col.card).opts"
                       :query="getCardConfig(col.card).query">
              正在加载...
            </component>
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
    name: "gl-card-layout-item",
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
        return Vue.component(card.type)
      }
    }
  }
</script>

<style scoped>

</style>
