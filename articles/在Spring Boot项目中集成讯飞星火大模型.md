
# 一、项目概述

本文将介绍如何通过**Spring Boot 后端**调用讯飞星火大模型API，并将结果返回给**Vue3 + Element Plus** 前端页面进行交互式展示。文末有彩蛋哟。

> 小提示：可以去注册一个讯飞星火账号，注册后，对于Spark Lite模型，可以免费领取无限token。

# 二、环境准备

## 开发依赖

- JDK 17 + Spring Boot 3.x

- 前端：Vue3 + Element Plus + Axios

- 关键依赖（后端）：

  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.18.36</version>
      <scope>provided</scope>
  </dependency>
  
  ```

## 讯飞API准备

1. 前往讯飞开放平台注册账号，对于Spark Lite模型，注册后即可领取无限token
2. 本项目通过HTTP方式调用接口，所以需要创建应用并获取APIPassword
3. 开通「星火大模型」服务权限

# 三、后端实现详解

## 1. 配置管理（application.properties）

```properties
# 讯飞星火配置
xunfei.spark.api-url=你的接口地址
xunfei.spark.api-key=你的APIPassword
xunfei.spark.model=4.0Ultra  # 模型版本
xunfei.spark.temperature=0.5  # 生成文本的随机性（0-1）
xunfei.spark.max-tokens=1024   # 响应最大长度
```

## 2. 配置类解析

**XunfeiConfig.java** 通过 `@ConfigurationProperties` 绑定配置：

```java
@Configuration
@ConfigurationProperties(prefix = "xunfei.spark")
@Getter @Setter
public class XunfeiConfig {
    private String apiUrl;
    private String apiKey;  // 自动映射api-key
    private String model;
    private Double temperature;
    private Integer maxTokens; // 支持驼峰命名自动转换
}
```

## 3. 数据模型设计（关键POJO类）

### (1) 请求/响应数据结构

这些类定义了与讯飞API交互的数据结构，采用Lombok简化代码：

**① XunfeiRequest.java - API请求体**

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class XunfeiRequest {
    private String model;
    private String user; // 用户唯一ID
    private List<XunfeiMessage> messages;
    private Double temperature;
    private Integer top_k;
    private Boolean stream;
    private Integer max_tokens;
    private Integer presence_penalty;
    private Integer frequency_penalty;
}
```

**② XunfeiResponse.java - API响应体**

```java
@Data
public class XunfeiResponse {
    private List<XunfeiChoice> choices; // 生成的结果选项
    private String sid;                 // 会话ID（用于追踪）
}
```

### (2) 嵌套消息结构

**③ XunfeiMessage.java - 单条消息**

```java
@Data
public class XunfeiMessage {
    private String role;    
    private String content; // 消息内容
}
```

**④ XunfeiChoice.java - 生成选项**

```java
@Data
public class XunfeiChoice {
    private XunfeiMessage message; // AI返回的消息
}
```

- 请求中的`messages`是消息历史列表
- 响应中的`choices`包含AI生成结果（可能多个）
- 字段命名与讯飞官方API文档保持一致

## 3. 服务层实现

**XunfeiSparkServiceImpl.java** 核心逻辑：

```java
@Slf4j
@Service
public class XunfeiSparkServiceImpl implements XunfeiSparkService {
    private final RestTemplate restTemplate;
    private final XunfeiConfig config;

    @Autowired
    public XunfeiSparkServiceImpl(RestTemplate restTemplate, XunfeiConfig config) {
        this.restTemplate = restTemplate;
        this.config = config;
    }

    @Override
    public Result chatSync(String prompt) {
        try {
            // 1. 构建请求体（使用配置类参数）
            XunfeiRequest request = new XunfeiRequest(
                    config.getModel(),       // 从配置读取模型版本
                    "user123",               // 用户唯一ID
                    List.of(new XunfeiMessage("user", prompt)),
                    config.getTemperature(), // 从配置读取
                    4,                      // top_k（默认值）
                    false,                  // stream（同步调用设为false）
                    config.getMaxTokens(),  // 从配置读取
                    1,                      // presence_penalty（默认值）
                    1                       // frequency_penalty（默认值）
            );

            // 2. 发送请求
            ResponseEntity<XunfeiResponse> response = restTemplate.exchange(
                    config.getApiUrl(),
                    HttpMethod.POST,
                    new HttpEntity<>(request, buildHeaders()),
                    XunfeiResponse.class
            );

            // 3. 处理响应
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // 获取AI响应结果
                String content = response.getBody().getChoices().get(0).getMessage().getContent();
                return Result.success(content); // 直接返回成功Result
            } else {
                log.error("讯飞API返回非成功状态码: {}", response.getStatusCode());
                return Result.error("AI服务返回异常状态: " + response.getStatusCode());
            }

        } catch (HttpClientErrorException e) {
            log.error("HTTP调用失败，状态码: {}，响应体: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return Result.error("AI服务请求错误: " + e.getStatusCode());
        } catch (Exception e) {
            log.error("系统异常 - 类型: {}，信息: {}", e.getClass().getSimpleName(), e.getMessage());
            return Result.error("系统繁忙，请稍后重试");
        }
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + config.getApiKey()); // 使用配置的API Key
        return headers;
    }
}
```

## 4. 控制器设计

**ChatController.java**接收前端传递过来的参数

```java
@GetMapping("/chat")
public Result chat(String param) {
    log.info("收到请求: {}", param);
    return sparkService.chatSync(param);
}
```

# 四、前端实现关键点

## 1. 组件结构（TestAI.vue）

- **消息展示区**：使用Element Plus的`el-card`实现气泡对话框
- **输入区**：支持`Ctrl+Enter`快捷发送
- **自动滚动**：通过`scrollTop`实现消息自动定位

## 2. 核心交互逻辑

```javascript
const sendRequest = async () => {
    try {
        const response = await request.get('/chat', { 
            params: { param: userInput } 
        });
        
        // 更新消息记录
        messageHistory.value[lastIndex].ai = response.data.data;
    } catch (error) {
        // 错误处理
        messageHistory.value[lastIndex].error = error.response?.data?.msg;
    }
}
```

# 五、总结

通过本文的实践，完成了：

* Spring Boot与讯飞API的深度集成
* 前后端分离的对话交互实现

# 六、书籍推荐

在文章的末尾，我想给大家推荐一本书：《平凡的世界》。

路遥的这部百万字巨著，通过描写中国70年代中期到80年代中期社会各阶层普通人的生活，展现了主人公孙少安、孙少平在艰苦环境中不屈不挠的奋斗历程，描绘了书中人物在时代变革中展现出的善良、坚韧与担当。

> " 什么是人生，人生就是永不休止的奋斗。" ——《平凡的世界》
>
> "生活不能等待别人来安排，要自己去争取和奋斗。" ——《平凡的世界》

梦虽遥，追则能达；愿虽艰，持则可圆。愿屏幕前的你，也能坚持下去，不懈奋斗。

