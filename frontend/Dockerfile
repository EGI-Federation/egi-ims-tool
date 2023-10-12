FROM node:20-alpine

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
RUN envsubst '${EGI_CHECKIN_SERVER}${EGI_VO}${EGI_VO_ENROLL_URL}${LOCALE}${FALLBACK_LOCALE}${TRACE_ROLES}${SLM_API}' < /app/.env.template > /app/.env && \
    npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
