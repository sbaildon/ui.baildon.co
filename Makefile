BUILD_DIR=_build
SOURCE_DIR=source

NODE_BINARIES=node_modules/.bin

PUG=$(NODE_BINARIES)/pug
PUG_FLAGS=--pretty
PUG_FILES=$(shell find $(SOURCE_DIR)/views -maxdepth 1 -type f -name "*.pug")
PUG_INCLUDES=$(shell find $(SOURCE_DIR)/views/includes -type f -name "*.pug")
HTML_FILES=$(patsubst $(SOURCE_DIR)/views/%.pug, $(BUILD_DIR)/%.html, $(PUG_FILES))

SCSS=$(NODE_BINARIES)/node-sass
SCSS_FLAGS=--include-path node_modules/include-media/dist/
SCSS_FILES=$(shell find $(SOURCE_DIR)/css -maxdepth 1 -type f -name "*.scss")
SCSS_EXTRAS=$(shell find $(SOURCE_DIR)/css/helpers/ $(SOURCE_DIR)/css/modules/ -maxdepth 1 -type f -name "*.scss")
CSS_FILES=$(patsubst $(SOURCE_DIR)/css/%.scss, $(BUILD_DIR)/stylesheets/%.css, $(SCSS_FILES))
CSS_LIBS=node_modules/normalize.css/normalize.css

FONT_FILES_SOURCE=$(shell find $(SOURCE_DIR)/fonts/ -type  f)
FONT_FILES=$(patsubst $(SOURCE_DIR)/%, $(BUILD_DIR)/%, $(FONT_FILES_SOURCE))

all: node_modules/.yarn-integrity $(BUILD_DIR) $(FONT_FILES) $(HTML_FILES) $(CSS_FILES)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/stylesheets/%.css: $(SOURCE_DIR)/css/%.scss $(SCSS_EXTRAS)
	$(SCSS) $(SCSS_FLAGS) $< -o $(BUILD_DIR)/stylesheets/

$(BUILD_DIR)/%.html: $(SOURCE_DIR)/views/%.pug $(PUG_INCLUDES)
	$(PUG) $(PUG_FLAGS) $< -o $(BUILD_DIR)

$(BUILD_DIR)/fonts/%: $(SOURCE_DIR)/fonts/%
	mkdir -p `dirname $@`
	cp $^ $(dir $@)

node_modules/.yarn-integrity: package.json yarn.lock
	yarn install

.PHONY: devserver
devserver:
	$(eval IP_ADDR := $(shell ip route get 8.8.8.8 | awk '{print $$7; exit}'))
	devd --address $(IP_ADDR) -ol _build/

.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf $(BUILD_DIR)
