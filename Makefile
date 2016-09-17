NPM:=$(shell which npm)
NODE_MODULES := node_modules/.bin
WEBPACK:=$(NODE_MODULES)/webpack
ESLINT:=$(NODE_MODULES)/eslint
WEBPACK_JS:=webpack.config.js
ENV:=development

# TODO: Resolve the dependency of Go
deps:
	go get
	npm install

test:
	go test -v ./...

build:
	$(WEBPACK) -p --config $(WEBPACK_JS)

watch:
	$(WEBPACK) -w --config $(WEBPACK_JS)

lint:
	$(ESLINT) client/**/*.jsx

fix:
	$(ESLINT) --fix client/**/*.jsx
