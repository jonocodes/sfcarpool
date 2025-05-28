# show list of commands
help:
	just --list

# Install node dependencies
setup:	
	npm install

# Run local frontend
fe:
	npm run dev

# test: ## Run tests
# 	yarn rw test

# Run local backend (Postgres and Electric)
be:
	cd db && docker compose up

# Run local storybook for component development
storybook:
	npm run storybook

# deploy:	## Deploy to prod
# 	fly deploy

# .ONESHELL:
# .SHELLFLAGS: -e
# deploy-storybook-gh: ## Deploy storybook to github pages

# #	yarn redwood storybook --build

# 	# workaround for https://github.com/redwoodjs/redwood/issues/5534#issuecomment-1481697193
# 	cp web/public/mockServiceWorker.js web/public/storybook/

# 	#sed -i 's/\/mockServiceWorker.js/mockServiceWorker.js/' web/public/storybook/main.*.iframe.bundle.js

# 	npx gh-pages -d web/public/storybook

# 	# yarn redwood storybook --build && cp web/public/mockServiceWorker.js web/public/storybook/mockServiceWorker.js && npx gh-pages -d web/public/storybook

# .PHONY: help
# help: ## Show this help
# 	@grep -E -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

