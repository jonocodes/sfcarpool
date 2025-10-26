# show list of commands
help:
	just --list

# Install node dependencies
setup:	
	npm install --legacy-peer-deps

# Run local frontend
fe:
	npm run dev

# test: ## Run tests
# 	yarn rw test

# Run local backend
be:
	npx triplit dev --storage=sqlite --initWithSchema --schemaPath=schema.ts --seed=the-seed.ts

# Run local storybook for component development
storybook:
	npm run storybook
