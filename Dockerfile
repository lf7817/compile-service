FROM node:14

# 安装jdk11
WORKDIR /usr/local/java
# # 拷贝安装包到jdk路径（会自动解压）
RUN wget -P /usr/local/java http://115.231.255.14:81/download/jdk-11.0.10_linux-x64_bin.tar.gz
RUN tar -zxvf jdk-11.0.10_linux-x64_bin.tar.gz 
# 创建symbol link
RUN ln -s /usr/local/java/jdk-11.0.10 /usr/local/java/jdk
# 生成jre
RUN jdk/bin/jlink --module-path jmods --add-modules java.desktop --output ./jdk/jre
# 设置环境变量
ENV JAVA_HOME /usr/local/java/jdk
ENV JRE_HOME ${JAVA_HOME}/jre
ENV CLASSPATH .:${JAVA_HOME}/lib:${JRE_HOME}/lib
ENV PATH ${JAVA_HOME}/bin:$PATH
RUN rm -rf ./jdk-11.0.10_linux-x64_bin.tar.gz

# 安装go
WORKDIR /usr/local/go
RUN mkdir tmp 1.11 1.12
RUN wget -P ./tmp https://dl.google.com/go/go1.11.5.linux-amd64.tar.gz & wget -P ./tmp https://dl.google.com/go/go1.12.7.linux-amd64.tar.gz
RUN tar -zxvf ./tmp/go1.11.5.linux-amd64.tar.gz  -C ./1.11 & tar -zxvf ./tmp/go1.12.7.linux-amd64.tar.gz -C ./1.12
RUN rm -rf ./tmp

# 工作目录
WORKDIR /usr/src/app
# package.json到项目目录
COPY package.json ./
# 安装pm2
RUN npm install -g pm2 --silent --no-cache --registry=https://registry.npm.taobao.org
# # 安装pm2-logrotate插件
# RUN pm2 install pm2-logrotate@2.7.0
# # 设置日志大小上限
# RUN pm2 set pm2-logrotate:retain 100M
# # 设置保留的日志文件个数
# RUN pm2 set pm2-logrotate:retain 30
# # 设置日志文件名中的日期格式
# RUN pm2 set pm2-logrotate:dateFormat 'YYYY-MM-DD_HH-mm-ss'
# # 每天晚上0点分割日志
# RUN pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
# 安装npm依赖
RUN npm install --silent --no-cache --registry=https://registry.npm.taobao.org
# 拷贝整个目录
COPY ./ ./
# 编译代码
RUN npm run build
# 暴露端口
EXPOSE 4000

CMD ["pm2-runtime", "start", "pm2.json"]