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
待完善

## FAQ
1. 编译docker镜像时报`jdk-11.0.10_linux-x64_bin.tar.gz`下载失败
    * jdk包被我临时放到一个服务器上了，不保证一直可用，出现问题时请修改下载路径，或者下载到本地，通过ADD命令拷贝
