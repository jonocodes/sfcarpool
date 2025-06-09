# show list of commands
help:
	just --list

# Install node dependencies
setup:	
	npm install

# Run local frontend
fe:
	npm run dev

test: ## Run tests
	npm run test

# Run local backend (Postgres and Electric)
be:
	cd db && docker compose up --force-recreate

# Run local storybook for component development
storybook:
	npm run storybook



# deploy:	## Deploy to prod
# 	fly deploy

# .ONESHELL:
# .SHELLFLAGS: -e
# deploy-storybook-gh: ## Deploy storybook to github pages


