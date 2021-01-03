<template>
  <div>
    <gl-row v-for="(row,rowIndex) in rows" :key="rowIndex">
      <gl-cell v-bind="cell" v-for="(cell,cellIndex) in row.cols" :key="cellIndex">
        <template v-if="cell.rows">
          <gl-form-item :rows="cell.rows" :properties="properties" :form="form" :glRefControls="glRefControls"
                        :glVars="glVars"
                        @propertyUpdate="onPropertyUpdate"
                        @loadRefData="onLoadRefData"></gl-form-item>
        </template>
        <template v-else>
          <gl-label v-if="cell.label" :label="cell.label" :property="getProperty(cell.field)"></gl-label>
          <gl-control :ref="getProperty(cell.field).gid" v-if="!cell.label" :form="form"
                      :property="getProperty(cell.field)" :vars="glVars"
                      @propertyUpdate="onPropertyUpdate" @loadRefData="onLoadRefData"></gl-control>
        </template>
      </gl-cell>
      <!-- 当cell的width百分比加起来不到100%时，通过冗余该div，将占余下的空间-->
      <div></div>
    </gl-row>
  </div>
</template>

<script>
  export default {
    name: "GlFormItem",
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
      },
      glRefControls: {
        type: Object,
        required: true
      },
      glVars: {
        type: Object
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
    mounted() {
      this.$_generateRefControl()
    },
    destroyed() {
      this.$_clearRefControl()
    },
    updated() {
    },
    methods: {
      getValue() {

      },
      resetProperty(property, key, value) {

      },
      setAsTableContainer(isTableContainer) {
        if (typeof this.$parent.setAsTableContainer === "function") {
          this.$parent.setAsTableContainer(isTableContainer)
        }
      },
      getProperty(name) {
        if (!name || !this.properties[name]) {
          return {control: 'null', title: ' ', gid: this.$gl.utils.uuid(8)}
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
        console.log('geelato-ui-ant > formItem > loadRefData', {property})
        this.$emit('loadRefData', {property})
      },
      $_generateRefControl(componentName) {
        for (let i in this.$refs) {
          if (this.$refs[i]) {
            this.glRefControls[i] = this.$refs[i].length !== undefined ? this.$refs[i][0] : this.$refs[i]
          }
        }
        console.log(`geelato-ui-ant > gl-form-item > $_generateRefControl() > [${componentName}] $refs,glRefControls: `, this.$refs, this.glRefControls)
        return this.glRefControls
      },
      $_clearRefControl() {
        for (let i in this.$refs) {
          delete this.glRefControls[i]
        }
        console.log('geelato-ui-ant > gl-form-item > $_clearRefControl() > $refs,glRefControls: ', this.$refs, this.glRefControls)
      },
      $_getRefControlByGid(gid) {
        if (!this.glRefControls && !this.glRefControls[gid] && Object.keys(this.glRefControls).length === 0) {
          // 未初始化，则先进行初始化
          this.$_generateRefControl()
        }
        return this.glRefControls[gid]
      }
    }
  }
</script>

<style scoped>

</style>
