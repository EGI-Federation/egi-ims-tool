FROM node:20-alpine

ARG EGI_CHECKIN_SERVER
ARG EGI_VO
ARG EGI_VO_ENROLL_URL
ARG LOCALE
ARG FALLBACK_LOCALE
ARG TRACE_APIS
ARG TRACE_ROLES
ARG MAX_UPLOAD_SIZE
ARG IMS_API
ARG MSG_API
ARG SLM_API

# Install envsubst
ENV BUILD_DEPS="gettext"
ENV RUNTIME_DEPS="libintl"

RUN set -x && \
    apk add --update $RUNTIME_DEPS && \
    apk add --virtual build_deps $BUILD_DEPS &&  \
    cp /usr/bin/envsubst /usr/local/bin/envsubst && \
    apk del build_deps

# Install simple http server for serving static content
RUN npm install -g http-server

# Make the 'app' folder the current working directory
WORKDIR /app

# Copy both 'package.json' and 'package-lock.json' (if available)
COPY application/package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY application/ .

# Build app for production with minification
RUN envsubst '${EGI_CHECKIN_SERVER}${EGI_VO}${EGI_VO_ENROLL_URL}${LOCALE}${FALLBACK_LOCALE}${TRACE_APIS}${TRACE_ROLES}${IMS_API}${MSG_API}${SLM_API}${MAX_UPLOAD_SIZE}' < /app/.env.template > /app/.env && \
    npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
