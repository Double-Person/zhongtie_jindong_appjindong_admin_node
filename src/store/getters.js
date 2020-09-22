import Vue from 'vue'
import { USER_INFO, ROLE} from "@/store/mutation-types"
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  sysType: state => state.app.sysType,
  token: state => state.user.token,
  avatar: state => {state.user.avatar = Vue.ls.get(USER_INFO).avatar; return state.user.avatar},
  username: state => state.user.username,
  role: state => {state.user.role = Vue.ls.get(ROLE); return state.user.role},
  userinfo: state => {state.user.info = Vue.ls.get(USER_INFO); return state.user.info},
  nickname: state => {state.user.realname = Vue.ls.get(USER_INFO).realname; return state.user.realname},
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  userInfo: state => {state.user.info = Vue.ls.get(USER_INFO); return state.user.info},
  addRouters: state => state.permission.addRouters
}

export default getters