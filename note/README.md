# danboard-cli

### 知识点整理

> 关于eslint [创建配置]

- npm i eslint
- npx eslint --init
- vscode中配置eslint，保存时修复

---

> 关于vue-cli [主要做的是拉取模板，模板里配置的是webpack]

- vue create projectname
- vue ui ...

---

> 关于Object.keys()与Reflect.ownKeys()的区别 [https://blog.csdn.net/oxgos/article/details/82854848]

- Object.keys() 返回属性key，但不包括不可枚举的属性
- Reflect.ownKeys() 返回所有属性的key，包括不可枚举的属性
- Object.keys() 相当于返回属性的数组
- Reflect.ownKeys() 相当于Object.getOwnPropertyName(target).cancat(Object.getOwnPropertySymbols(target))
  - > 总结
  - Object.kes() 主要用于遍历对象自有的可枚举属性，不包括继承自原型的属性和不可枚举的属性
  - Reflect.ownKeys() 返回所有属性的key，不管是否可枚举，但不包括继承自原型的属性

  ---

  > 关于git接口文档
  
  - https://developer.github.com/v3/repos/ [github文档]
    - GET /orgs/:org/repos [组织 | 组织名 | 仓库] 获取组织下的仓库 [例如：https://api.github.com/orgs/danboard-cli-templates/repos]

  ---

  > 关于create功能 [创建项目]

  - 拉取所有项目列出来，供用户选择， 安装哪个项目 projectName 
    - 关于创建tag [tag git tag v1.0.1 git push origin v1.0.1]
  - 选择后，显示所有的版本号 [例：v1.0.1]
  - 可能还需要用户配置一些选项，结合渲染拉取下来的项目

  ---

  > 关于拉取模板

  - 模板分为两种类型
    - 简单模板：拷贝下来就可以用
    - 复杂模板：含有ask文件，需要选择编译模板
      - 让用户填写信息
      - 用户填写的信息去渲染模板