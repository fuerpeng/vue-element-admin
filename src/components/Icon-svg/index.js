import Vue from 'vue'

function registerAllComponents(requireContext) {
  return requireContext.keys().forEach(comp => {
    const vueComp = requireContext(comp)
    const compName = vueComp.name ? vueComp.name.toLowerCase() : /\/([\w-]+)\.vue$/.exec(comp)[1]
    Vue.component(compName, vueComp)
  })
}
/**
require.context 有三个参数：

directory：说明需要检索的目录
useSubdirectories：是否检索子目录
regExp: 匹配文件的正则表达式
 */
registerAllComponents(require.context('./', false, /\.vue$/))
console.log(require.context('./', false, /\.vue$/));