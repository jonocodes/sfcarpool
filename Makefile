
# TODO: run fly local? use image

# test

.PHONY: setup
setup:	# Install node dependencies
	yarn install

.PHONY: web
web: ## Run local frontend
	yarn redwood dev web

.PHONY: api
api: ## Run local backend (Postgres and Hasura)
	cd hasura && docker compose up

.PHONY: storybook
storybook: ## Run local storybook for component development
	yarn redwood storybook

.PHONY: deploy
deploy:	## Deploy to prod
	fly deploy

.PHONY: help
help: ## Show this help
	@grep -E -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
