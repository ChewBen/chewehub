# 基础镜像
# 使用官方 OpenJDK 镜像
# 如果网络较慢，可以使用国内镜像源或预先拉取: docker pull openjdk:17
FROM openjdk:17

#作者信息
MAINTAINER mashiro

#申明一个环境变量
ENV HOME_PATH /home

#指定容器启动时，执行命令会在该目录下执行
WORKDIR $HOME_PATH

#应用构建成功后的jar复制到容器指定目录下
# 注意：构建时需要先执行 mvn clean package，jar包位于 cheweHub-admin/target/cheweHub-admin.jar
ADD cheweHub-admin/target/cheweHub-admin.jar $HOME_PATH/app.jar

#指定容器内部端口
EXPOSE 38080

#容器启动时执行的命令
ENTRYPOINT ["java","-jar","app.jar"]

