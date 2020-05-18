FROM alpine:3.7

ENV CONSUL_VERSION 1.7.3
RUN mkdir -p /consul
RUN mkdir -p /consul/config
RUN apk --no-cache add \
  bash \
  ca-certificates \
  wget

RUN wget --quiet --output-document=/tmp/consul.zip https://releases.hashicorp.com/consul/${CONSUL_VERSION}/consul_${CONSUL_VERSION}_linux_amd64.zip && \
  unzip /tmp/consul.zip -d /consul && \
  rm -f /tmp/consul.zip && \
  chmod +x /consul/consul

ENV PATH="PATH=$PATH:$PWD/consul"

COPY ./config/consul-config.json /consul/config/config.json
EXPOSE 8300 8400 8500 8600
ENTRYPOINT ["consul"]