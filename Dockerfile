# 基础镜像
FROM openjdk:17

#作者信息
MAINTAINER mashiro

#申明一个环境变量
ENV HOME_PATH /home

#指定容器启动时，执行命令会在该目录下执行
WORKDIR $HOME_PATH

#应用构建成功后的jar复制到容器指定目录下
ADD target/SpringBoot-0.0.1-SNAPSHOT.jar $HOME_PATH/app.jar

#指定容器内部端口
EXPOSE 38080

#容器启动时执行的命令
ENTRYPOINT ["java","-jar","app.jar"]

