test:
	mkdir -p logs #create log folder
	@NODE_ENV=test ./node_modules/.bin/mocha -R spec
.PHONY: test
