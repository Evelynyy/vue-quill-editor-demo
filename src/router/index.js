import Vue from 'vue'
import Router from 'vue-router'
import MyQuillEditor from '@/components/MyQuillEditor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MyQuillEditor',
      component: MyQuillEditor
    }
  ]
})
