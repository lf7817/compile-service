# COMPILE-SERVICE

## 描述
最近收到个面试题，挺有意思的，大意是提供一个在线编译的服务，支持java、go单文件编译（无第三方依赖）

## 思路
大体思路就是提前安装好jdk、go，采用`child_process`的`exec`方法在命令行调用jdk、go命令编译，编译成功后将编译后的文件及编译信息打包发送给前端

## 开发

> 前提安装docker、docker-compose。推荐使用`VS Code`安装 `Remote - Container`插件开发

```bash
$ npm run docker:dev
```

## 接口

### 编译java接口

- 请求方式: ``POST``

- 请求接口:  ``/compile/java``
- 描述: ``编译java文件，支持多文件``
- 请求参数:
  ```ts
    // 具体查看/src/modules/compile/dto/compile.dto.ts文件
    files: blob; // 支持多文件
    target?: number; // 目标版本,支持7-11
    source?: number; // 编译版本,支持7-11
    encoding?: string; // 指定源文件使用的字符编码
    g?: string; // 在生成的class文件中包含是否所有调试信息（行号、变量、源文件）
    verbose?: string; // 字符串bool型，支持传"true", "false",是否输出有关编译器正在执行的操作的消息，包括：classpath、加载的类文件信息
    nowarn?: string; // 字符串bool型，支持传"true", "false", 不生成任何警告
    deprecation?: string; // 字符串bool型，支持传"true", "false", 是否输出使用已过时的 API 的源位置
  ```
- 返回格式:
    - 成功时返回文件流
    - 失败时返回
        ```json
        {
            "status": 200,
            "message": "编译失败",
            "code": 10004,
            "path": "/compile/java",
            "method": "POST",
            "errors": {
                "killed": false,
                "code": 1,
                "signal": null,
                "cmd": "javac -d F:\\workspaces\\compile-service\\dist\\uploads\\2021-05-17/1621213307076  -g -verbose F:\\workspaces\\compile-service\\dist\\uploads\\2021-05-17\\HelloWorld.java",
                "stdout": "",
                "stderr": "'javac' �����ڲ����ⲿ���Ҳ���ǿ����еĳ���\r\n���������ļ���\r\n"
            },
            "timestamp": 1621213307095
        }
        ```

### 编译go接口

- 请求方式: ``POST``

- 请求接口:  ``/compile/go``
- 描述: ``编译go文件，支持多文件``
- 请求参数:
  ```ts
    // 具体查看/src/modules/compile/dto/compile.dto.ts文件
    files: blob; // 支持多文件
    version: number; // 目标版本,支持1.11、1.12两个版本
    o?: string; // 指定编译输出的名称，代替默认的包名
    i?: string; // 字符串bool型，支持传"true", "false", 安装作为目标的依赖关系的包(用于增量编译提速)
    v?: string; // 字符串bool型，支持传"true", "false", 编译时显示包名
    p?: number; // 开启并发编译，默认情况下该值为 CPU 逻辑核数
    a?: string; // 字符串bool型，支持传"true", "false", 强制重新构建
    n?: string; // 字符串bool型，支持传"true", "false", 打印编译时会用到的所有命令，但不真正执行
    x?: string; // 字符串bool型，支持传"true", "false", 打印编译时会用到的所有命令
    race?: string; // 字符串bool型，支持传"true", "false", 开启竞态检测
  ```
- 返回格式:
    - 成功时返回文件流
    - 失败时返回
        ```json
        {
            "status": 200,
            "message": "编译失败",
            "code": 10004,
            "path": "/compile/go",
            "method": "POST",
            "errors": {
                "killed": false,
                "code": 1,
                "signal": null,
                "cmd": "/usr/local/go/1.12/go/bin/go build -i  -o sss -p 2 -x -race F:\\workspaces\\compile-service\\dist\\uploads\\2021-05-17\\test.go",
                "stdout": "",
                "stderr": "ϵͳ�Ҳ���ָ����·����\r\n"
            },
            "timestamp": 1621213204920
        }
        ```
## FAQ
1. 编译docker镜像时报`jdk-11.0.10_linux-x64_bin.tar.gz`下载失败
    * jdk包被我临时放到一个服务器上了，不保证一直可用，出现问题时请修改下载路径，或者下载到本地，通过ADD命令拷贝
