### 待办

一、 编辑器相关:

* [x] 预览模式
* [x] 源码模式
* [ ] 左右分屏 （低优先级）
* [x] 斜杠命令
* [x] ~~编辑器行号增加设置开关~~ 大部分MD编辑器没有行号
* [x] 鼠标右键菜单与功能：~~插入、段落调整、文本格式修改~~、复制、粘贴、全选等
* [x] 前置Yaml解析
* [x] image、附件、md文件索引、点击跳转等功能
* [x] image上传、拖拽上传
* [ ] 脑图、流程图、时序图、五线谱支持（低优先级）
* [ ] 自定义HTML支持（低优先级）
* [ ] 编辑时自动保存，考虑增加开关
* [x] 顶部工具栏：前进后退按钮
* [ ] 顶部工具栏：前进后退按钮需要history，当前的ReactRouter很难获取，考虑更换到tanstack测试
* [ ] 顶部工具栏：如果非自动保存，则显示当前是否是待保存状态
* [ ] 底部状态栏：~~显示行、列，~~ 自动保存时在状态栏显示
* [ ] 大纲显示（右侧侧边栏）
* [ ] 多页签（低优先级）

二、资源管理器相关

* [x] 增加排序方式：按修改时间、按名称、按创建时间 正序和倒序
* [ ] 增加拖拽移动文件/文件夹功能
* [ ] 增加多选功能（同时支持多选拖拽移动位置、多选时右键菜单使用不同的菜单）
* [ ] 资源管理器选择项与编辑器联动（前进后退自动聚焦新文件，文件改名自动重新打开编辑器等）

三、移动端支持

* [ ] 增加移动端UI入口
* [ ] 选型移动端UI库，考虑继续使用@radix-ui/themes，或者是切换到移动端专用UI: framework7等
* [ ] 尝试移动端路由：framework7、tanstack，需考虑IOS的原生右滑返回功能
* [ ] 移动端UI编写
* [ ] 移动端编辑器针对优化，增加快速操作小部件
* [ ] 尝试支持移动端与桌面端UI布局切换 （假如在iPad端, 就可以使用桌面端布局, 并且连接外设键盘）

四、同步相关

* [ ] 支持拉取git同步，以及其他git命令，考虑支持直接输入git命令（移动端）
* [ ] 支持webdav同步
* [ ] 更多同步方式

五、其他

* [ ] 增加全局搜索功能
* [ ] 打包时自动封装安装程序, 并接入更新检查与自动更新（使用Github查询更新）
* [ ] 增加README介绍
* [ ] 发布移动端APP
* [ ] 增加多语言支持
