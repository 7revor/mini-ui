export default {
    /**
     * 判断是否为当前路由子节点
     */
    isActive(menu, currentRoute) {
        const path = menu.path.replace('/', '');
        const full_path = currentRoute.path.replace('/', '').split('/');
        return full_path.indexOf(path) !== -1
    },
    hasNext(menu) {
         return menu.children && menu.children.length && (menu.childType !== 'tab' && menu.childType !== 'overlay')
    }
}
