export JWT_SECRET := env_var_or_default("JWT_SECRET", "")

# show list of commands
help:
	just --list

# Install node dependencies
setup:	
	npm install --legacy-peer-deps

# Run local frontend
fe:
	npm run dev

# Run local frontend, pointing to the prod remote db
fe-prod:
	npm run dev:prod

test: ## Run tests
	npm test

# Run local backend. uses built in default secret
be:
	VERBOSE_LOGS=true npx triplit dev --storage=sqlite --initWithSchema --schemaPath=schema.ts --seed=the-seed.ts

# run the local nodejs version
# Requires JWT_SECRET to be set: export JWT_SECRET=your-secret
be-server:
	@if [ -z "$${JWT_SECRET}" ]; then \
		echo "Error: JWT_SECRET is not set. Please run: export JWT_SECRET=your-secret"; \
		exit 1; \
	fi
	JWT_SECRET={{JWT_SECRET}} LOCAL_DATABASE_URL="data.db" node triplit/server.js

# run in docker. not sure if this works
be-docker:
	docker run -p 6545:8080 -e JWT_SECRET={{JWT_SECRET}} -e LOCAL_DATABASE_URL="./app.db" aspencloud/triplit-server 

seed:
	VERBOSE_LOGS=true npx triplit seed run --all

# Run local storybook for component development
storybook:
	npm run storybook
