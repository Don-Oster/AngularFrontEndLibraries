###########################
###### BUILD CONTEXT ######
###########################
FROM timbru31/node-chrome as init

WORKDIR /app

COPY package.json package-lock.json .npmrc /app/

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . /app/

###########################
###### TEST PACKAGES ######
###########################
FROM init as test

RUN npm run video-library:test

############################
###### BUILD PACKAGES ######
############################
FROM test as AngularFrontEndLibraries.artifacts

RUN npm run all:build
RUN npm run all:package
RUN mkdir -p /artifacts/npm-packages && cp -R /app/dist/*/*.tgz /artifacts/npm-packages

#######################
###### BUILD DEMO #####
#######################
RUN npm run demo:build:prod
