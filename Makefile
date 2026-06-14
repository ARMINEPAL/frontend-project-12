build:
	cd frontend && npm install && npm run build
	rm -rf build
	cp -r frontend/dist build

start:
	npx start-server -s ./build