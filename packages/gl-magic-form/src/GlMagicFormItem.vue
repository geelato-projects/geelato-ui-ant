<template>
  <div>
    <gl-row type="" v-for="(row,rowIndex) in rows" :key="rowIndex">
      <gl-cell v-bind="cell" v-for="(cell,cellIndex) in row.cols" :key="cellIndex">
        <template v-if="cell.rows">
          <gl-magic-form-item :rows="cell.rows" :properties="properties" :form="form" @propertyUpdate="onPropertyUpdate"
                              @loadRefData="onLoadRefData"></gl-magic-form-item>
        </template>
        <template v-else>
          <gl-label v-if="cell.label" :label="cell.label" :property="getProperty(cell.field)"></gl-label>
          <gl-control v-if="!cell.label" :form="form" :property="getProperty(cell.field)"
                      @propertyUpdate="onPropertyUpdate" @loadRefData="onLoadRefData"></gl-control>
        </template>
      </gl-cell>
    </gl-row>
  </div>
</template>

<script>
  export default {
    name: "gl-magic-form-item",
    props: {
      /**
       * 布局
       */
      rows: {
        type: Array,
        default() {
          return []
        }
      },
      properties: {
        type: Object,
        default() {
          return {}
        }
      },
      form: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      // properties: {
      //   handler(val, oval) {
      //     console.log(val, oval)
      //   },
      //   immediate: true,
      //   deep: true
      // }
    },
    methods: {
      getValue() {

      },
      resetProterty(property, key, value) {

      },
      setAsTableContainer(isTableContainer) {
        if (typeof this.$parent.setAsTableContainer === "function") {
          this.$parent.setAsTableContainer(isTableContainer)
        }
      },
      getProperty(name) {
        if (!name || !this.properties[name]) {
          return {control: 'null', title: ' '}
        }
        return this.properties[name]
      },
      getFieldNameByCell(cell) {
        return Object.keys(cell)[0]
      },
      onPropertyUpdate({property, val, oval}) {
        this.$emit('propertyUpdate', {property, val, oval})
      },
      onLoadRefData({property}) {
        console.log('formItem > loadRefData', {property})
        this.$emit('loadRefData', {property})
      }
    }
  }
</script>

<style scoped>

</style>
