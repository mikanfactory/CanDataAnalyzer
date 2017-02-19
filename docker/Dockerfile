FROM ubuntu:latest

# Copy CanDataAnalyzer to work dir
RUN mkdir -p /home/worker/go/src/github.com/mikanfactory/CanDataAnalyzer

# Set GOPATH
ENV GOPATH /home/worker/go

# Update
RUN apt-get update
RUN apt-get install -y git curl vim

# Install Node.js
RUN apt-get install -y nodejs npm
RUN npm cache clean
RUN npm install n -g
RUN n 6.3.0
RUN ln -sf /usr/local/bin/node /usr/bin/node
RUN apt-get purge -y nodejs npm

# Install Go lang
RUN curl -O https://storage.googleapis.com/golang/go1.7.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.7.linux-amd64.tar.gz
ENV PATH $PATH:/usr/local/go/bin
ENV PATH $GOPATH/bin:$PATH
RUN go get github.com/tools/godep
RUN go get golang.org/x/sys/unix
RUN rm go1.7.linux-amd64.tar.gz

# Install MySQL
RUN echo "mysql-server mysql-server/root_password password passw0rd" | debconf-set-selections && \
    echo "mysql-server mysql-server/root_password_again password passw0rd" | debconf-set-selections && \
    apt-get -y install mysql-server
