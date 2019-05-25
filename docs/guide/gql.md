# GQL
## 概述

​	gql是基于元数据的动态查询api，查询对像为实体（实体对应物理表或视图），gql即geelato query language。gql采用json格式，并通过key、value的特殊字符关键字，表示查询字段、查询条件等信息，最终由gql解析器转换成对实体的sql语句。

​	先来一个简单示例，查询用户信息

``` javascript
{"platform_user":{                          // 请求一个名为platform_user的实体
      "@p":"0,1"                       // 有这个参数，则表示分页数据组,没有则表示查询单个
      "sex":"0",                       // 等值条件
	  "age|gt":"20",                   // “|”表示过滤，gt即表示大于
	  "name|sw":"张",                  // 模糊查询 ，sw即startWith
	  "id|in":[1,2,3],                 // in   查询
      "@fs":"id,name,age",              // agesum是虚拟列
	  "@order":"age|+,name|-"          // 排序
    }
}
```

​	经解析之后的sql语句如下：

``` sql
-- 服务端解析实体platform_user为对应的表或视图,本例中实体platform_user对应的表名也为platform_user
select id,name,age from platform_user where sex=0 and age>20 and name like '%张' and id in(1,2,3) order by age asc,name desc
```

​	gql关键字如下

- @ 用于key，指关键字，如@p，表示需要分页查询
- $ 用于value，指变量，查询的字段变量
- ~ 用于key，指子查询
- | 用于key，指过滤，如“age|gt”:"20"，即按gt进行过滤，gt表示大于


## 查询

1. **@关键字**

   在查询配置中，关键字作为属性字段

  @p[可选]  page的简写，有则表示分页查询，无则表示查询所有

``` javascript
// 分页，每页10条记录，取第0页的数据
'@p':'0,10'
```

  @fs[可选]  fields的简写，有则表示查询指定列，无则表示查询所有

```javascript
// 查询列表，共三个列
'@fs':'id,name,description'
```

@group [可选]"userId|maxId>=100"、"userId|sum(age)>=100"

```javascript
// 分组

```

@having[可选]与@group一起使用

```javascript

```

 @order [可选]指定排序字段，如果有@order，则服务端默认排序无效。例如："@order":"name|-,age|+"

```javascript

```



  @key 在客户端发请求前自动生成，用于服务端解析缓存的key，客户端查询时，会自动依据实体名称、实体查询条件自动生成，规则如下：实体名称+属性数+@fs的字段数+TODO

  @w    [可选]where的简写，更高级的查询语句片段，暂不支持
**$ 指变量**，查询的字段变量
**~ 指子查询或子实体**，用于查询是子查询，用于保存则是子实体信息

2. **|过滤**


|后面的是过滤操作（函数）或比较表达式，支持的过滤操作有：
  max        maxId|max,取maxId的最大值
  min
  sumx
  avg
  count
  first
  last
  lcase
  ucase
  len
  mid  暂不支持
  now  暂不支持
  round  暂不支持
  format  暂不支持
  having having:maxId>=100，取maxId大于等于100的记录

as 别名，格式name as alias，例如agesum:age|sum表示将求和的列名重命名为agesum。as可用空格替代
:  参数，例如having:maxId>=100表示having的参数为：maxId>=100





/**

* 查询数组
* 多级对象
* 动态列
* 查询：
* 大于、小于、分组、in、
* eq("eq"), neq("neq"), lt("lt"), lte("lte"), gt("gt"), gte("gte"), startWith("sw"), endWith("ew"), contains("contains");
* in 已支持
  **/
* 

示例

``` javascript
{"platform_user":{                           //请求一个名为User的实体（Table或视图）
      "@p":"0,1"                       //有这个参数，则表示分页数据组,没有则表示查询单个
      "sex":"0",                       //等值条件
	  "age|gt":"20",                   //c即compare，表示大于、小于、等于...
	  "name|sw":"zh",                  //like 查询
	  "id|in":"1,2,3",                 //in   查询
      "@fs":"id,name,age,agesum",      //agesum是虚拟列，在服务端元数据管理中定义age|sum agesum
	  "@order":"age|+,name|-",         //如果有@order，则服务端默认排序无效；@fs排序无效，指定@order，可以指定先按哪个字段排序，可与@fs的不一致。
	  "@w":"sex=0",                    //更高级的查询语句片段
	  "@key":"USER8900"                 //在客户端发请求前自动生成，用于服务端解析缓存的key
	  "~Moment":{
		  "userId":"$../platform_user.id"          //缺省依赖路径，从同级Object的路径开始
		  "@fs":"id,userId,maxId|max id",     //结合下方的分组|g，取同组userId，Id的最大值|max，重命名为maxId
		  "@group":"userId"                //按userId分组(多个字段分组用逗号分隔userId,xx)
		  "@having":"maxId|gt:100,"
		},
	  "~Comment":{                    //请求一个名为Comment的Array
		"@p":"0,6",
		"momentId":"$Moment.id"   //完整依赖路径
	  }
    }
}
```

场景1：涉及关联子表查询，查询返回user列表中带有所属组织的名称列，同时查询条件中，带有组织名称的模糊查询。
方案：直接查询user视图，视图中带有组织表的组织名称列，简化客户端的规则


场景2：查找客户 "Bush" 或 "Adams" 拥有超过 1500 的订单总金额
SELECT Customer,SUM(OrderPrice) FROM Orders
WHERE Customer='Bush' OR Customer='Adams'
GROUP BY Customer
HAVING SUM(OrderPrice)>1500


## 更改

新增、修改信息

```javascript
{
    // 业务代码，用于在后端做业务规则检查用，暂未实现
    "@biz":"myBizCode",
    "platform_user":{
    	"name":"张三",
    	"loginName":"z3",
    	"password":"123456",
    	"email":geelato@geelato.org,
    	"age":18,
    	// 字典信息采用有直观含义的字符串信息来表示具体的值
    	"sex":"male",
    	"tel":"19999999999",
    	"province":"440000",
    	"city":"440100",
    	// enable 等boolean值，采用数值存储，在保存前需转换
    	"enable":"1",
    	"description":"",
    	"#platform_demo_entity":{
    	    "code":"$parent.province",
    		"name":"$parent.name"
    	}
    }
}

{
	'@biz':'xxxxx',
	'platform_page_config':{
	'code':'IUJDYWGS',
	'content':''
	}
}
```
注意：实体之间的数据存在依赖关系时，JSON结构上体现为父子节点的关系，子节点只能依赖父节点及以上节点的数据，不能依赖父节点兄弟节点的数据，所以变量只有$parent，只能上向引用。

## 安全

服务端在配置实体时，可以设置默认查询排序字段
服务端定义哪些字段可以模糊查询条件，哪些字段可以作为查询条件。
服务端定义哪些字段有权限可以查询出来，即限制@fs。

## 性能

为提高性能，服务端默认不自动去空
第一个字符是否为@,是的话则获取指令handler
检查“|”后的关键字是否支持
