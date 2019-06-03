<template>
  <div>
    <!--基于静态代码样式示例-->
    <div class="gl-table">
      <div class="gl-table-row">
        <div class="gl-table-cell gl-col-12 gl-cell-table-container">
          <div class="gl-table">
            <div class="gl-table-row">
              <div class="gl-table-cell gl-col-8 label">
                标题
              </div>
              <div class="gl-table-cell gl-col-16">
                <a-input type="text"></a-input>
              </div>
            </div>
            <div class="gl-table-row">
              <div class="gl-table-cell gl-col-8 label">
                数值
              </div>
              <div class="gl-table-cell gl-col-16">
                <a-input-number style="width: 100%"/>
              </div>
            </div>
            <div class="gl-table-row">
              <div class="gl-table-cell gl-col-8 label">
                标题
              </div>
              <div class="gl-table-cell gl-col-16">
                <a-input type="text"></a-input>
              </div>
            </div>
            <div class="gl-table-row">
              <div class="gl-table-cell gl-col-8 label">
                标题
              </div>
              <div class="gl-table-cell gl-col-16">
                <a-input type="text"></a-input>
              </div>
            </div>
          </div>
          <div class="gl-table">
            <div class="gl-table-row">
              <div class="gl-table-cell gl-col-8 label">
                标题
              </div>
              <div class="gl-table-cell gl-col-16">
                <a-input type="text"></a-input>
              </div>
            </div>
          </div>
          <div class="gl-table">
            <div class="gl-table-row">
              <div class="gl-table-cell gl-col-8 label">
                标题
              </div>
              <div class="gl-table-cell gl-col-16">
                <a-input type="text"></a-input>
              </div>
            </div>
          </div>
        </div>
        <div class="gl-table-cell gl-col-4 label">
          标题
        </div>
        <div class="gl-table-cell gl-col-8">
          <div class="gl-table">
            <div class="gl-table-row">
              <div class="gl-table-cell gl-col-4">
                <a-textarea style="height: 138px"></a-textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gl-table">
      <div class="gl-table-row">
        <div class="gl-table-cell label gl-col-4">
          <span class="gl-form-required">*</span>1
        </div>
        <div class="gl-table-cell gl-col-8">
          <a-input type="text"></a-input>
        </div>
        <div class="gl-table-cell label gl-col-4">19</div>
        <div class="gl-table-cell gl-col-8">
          <a-date-picker style="width: 100%"/>
        </div>
      </div>
    </div>
    <div class="gl-table">
      <div class="gl-table-row">
        <div class="gl-table-cell label gl-col-4">1</div>
        <div class="gl-table-cell gl-col-8">
          <a-cascader
              :default-value="['1']"
              :options="[]"
          />
        </div>
        <div class="gl-table-cell label gl-col-4">19</div>
        <div class="gl-table-cell gl-col-8">
          <a-select default-value="1">
            <a-select-option value="1">
              Option 1
            </a-select-option>
            <a-select-option value="2">
              Option 2
            </a-select-option>
            <a-select-option value="3">
              Option 3
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <div class="gl-table">
      <div class="gl-table-row">
        <div class="gl-table-cell label gl-col-4">1</div>
        <div class="gl-table-cell gl-col-20">
          <a-input defaultValue="mysite">
            <a-select slot="addonBefore" defaultValue="Http://" style="width: 90px">
              <a-select-option value="Http://">Http://</a-select-option>
              <a-select-option value="Https://">Https://</a-select-option>
            </a-select>
            <a-select slot="addonAfter" defaultValue=".com" style="width: 80px">
              <a-select-option value=".com">.com</a-select-option>
              <a-select-option value=".jp">.jp</a-select-option>
              <a-select-option value=".cn">.cn</a-select-option>
              <a-select-option value=".org">.org</a-select-option>
            </a-select>
          </a-input>
        </div>
      </div>
    </div>
    <div class="gl-table">
      <div class="gl-table-row">
        <div class="gl-table-cell label gl-col-3">1</div>
        <div class="gl-table-cell gl-col-5"></div>
        <div class="gl-table-cell label gl-col-3">1</div>
        <div class="gl-table-cell gl-col-5"></div>
        <div class="gl-table-cell label gl-col-3">1</div>
        <div class="gl-table-cell gl-col-5"></div>
      </div>
    </div>
    <!--基于配置的表单样式示例-->
    <gl-magic-form :opts="config"></gl-magic-form>
  </div>
</template>

<script>
  import data from './data.js'

  export default {
    components: {},
    data() {
      return {
        config: data
      }
    },
    mounted() {
      console.log(' this.$route>', this.$options)
    },
    methods: {}
  }
</script>

<style scoped>

</style>
