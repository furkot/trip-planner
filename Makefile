PROJECT=trip-planner
GLOBALVAR=furkotTripPlanner
BUILD_DIR=build
SCRIPT_NAME=$(BUILD_DIR)/furkot-$(PROJECT)

BIN=./node_modules/.bin
SRC = $(wildcard lib/*.js)

%.gz: %
	gzip --best --stdout $< > $@

%.min.js: %.js
	$(BIN)/uglifyjs $< --mangle --no-copyright --compress --output $@

all: check compile

check: lint test

lint: node_modules
	$(BIN)/jshint lib test

test: node_modules
	$(BIN)/mocha --recursive --require should

compile: $(SCRIPT_NAME).js

build:
	mkdir -p $@

$(SCRIPT_NAME).js: node_modules $(SRC) | build
	$(BIN)/browserify --require ./lib/index.js:$(PROJECT) --standalone ${GLOBALVAR} --outfile $@

.DELETE_ON_ERROR: $(SCRIPT_NAME).js

node_modules: package.json
	npm install

clean:
	rm -rf $(BUILD_DIR)

distclean: clean
	rm -rf node_modules

.PRECIOUS: $(SCRIPT_NAME).min.js

dist: $(SCRIPT_NAME).min.js.gz

.PHONY: all lint test compile dist clean distclean
