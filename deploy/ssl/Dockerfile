FROM nginx:1.23.0

MAINTAINER Levente Farkas (levente.farkas@egi.eu)

# Build-time environment variables specified by docker-compose.yml / .env
ARG SERVICE_EMAIL
ARG SERVICE_DOMAIN
ARG SERVICE_UI
ARG SERVICE_SYS
ARG SERVICE_SLM
ARG SERVICE_CAPM
ARG TELEMETRY_URL
ARG GRAFANA_URL
ARG CORS_ORIGINS
ARG CORS_HEADERS
ARG CORS_METHODS
ARG SSL_CERT_OPTIONS
ARG SSL_CERT_RENEW_INTERVAL
ARG LETSENCRYPT_DIR
ARG LETSENCRYPT_DRYRUN

# Run-time environment variables
ENV EMAIL ${SERVICE_EMAIL}
ENV DOMAIN ${SERVICE_DOMAIN}
ENV SSL_CERT_OPTIONS=${SSL_CERT_OPTIONS}
ENV SSL_CERT_RENEW_INTERVAL=${SSL_CERT_RENEW_INTERVAL}
ENV LETSENCRYPT_DIR=${LETSENCRYPT_DIR}
ENV LETSENCRYPT_DRYRUN=${LETSENCRYPT_DRYRUN}
ENV NGINX_DIR=/etc/nginx

# Install certbot and openssl
# Using inotifywait to watch our certificates and trigger actions on change
RUN apt-get -q -y update && \
    apt-get -q -y install inotify-tools openssl certbot gettext-base vim && \
    apt-get -q clean && \
    rm -rf /var/lib/apt/lists/*

# Configure website
COPY ssl/ /etc/ssl-options
COPY nginx.conf $NGINX_DIR/nginx.conf
COPY default.conf $NGINX_DIR/conf.d/default.conf.template
RUN envsubst '${DOMAIN}${SERVICE_UI}${SERVICE_SYS}${SERVICE_SLM}${SERVICE_CAPM}${GRAFANA_URL}${CORS_ORIGINS}${CORS_METHODS}${CORS_HEADERS}' < $NGINX_DIR/conf.d/default.conf.template > $NGINX_DIR/conf.d/default.conf && \
    rm -f $NGINX_DIR/conf.d/default.conf.template && \
    rm -f $NGINX_DIR/sites-enabled/default && \
    mkdir -p /var/cache/nginx/proxycache && \
    mkdir -p /var/cache/nginx/proxytemp

# Configure telemetry
WORKDIR /opt
ADD https://github.com/open-telemetry/opentelemetry-cpp-contrib/releases/download/webserver%2Fv1.0.3/opentelemetry-webserver-sdk-x64-linux.tgz .
RUN tar xvfz opentelemetry-webserver-sdk-x64-linux.tgz && \
    rm -f opentelemetry-webserver-sdk-x64-linux.tgz

WORKDIR /opt/opentelemetry-webserver-sdk
RUN ./install.sh

WORKDIR /opt
COPY telemetry.conf telemetry.conf
RUN envsubst '${TELEMETRY_URL}' < /opt/telemetry.conf > $NGINX_DIR/conf.d/opentelemetry_module.conf && \
    rm -f telemetry.conf

ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/opt/opentelemetry-webserver-sdk/sdk_lib/lib

# Configure entrypoint
COPY cert-entrypoint.sh entrypoint.sh
COPY cert-request.sh request.sh
COPY health-check.sh status.sh

RUN chmod a+x entrypoint.sh && \
    chmod a+x request.sh && \
    chmod a+x status.sh

EXPOSE 80 443 8080

ENTRYPOINT ["./entrypoint.sh"]
