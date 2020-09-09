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