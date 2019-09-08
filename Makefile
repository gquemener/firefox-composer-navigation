release:
	# bump version in manifest.json files
	# tag a new version of the repository
	# create separate archives

build-firefox:
	-rm ./build/firefox.zip
	mkdir -p ./build
	zip -r -FS ./build/firefox.zip firefox/*
	@echo "You may now manually submit the ./build/firefox.zip archive to https://addons.mozilla.org"
	@echo "More info: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on"

build-chrome:
	-rm ./build/chrome.zip
	mkdir -p ./build
	zip -r -FS ./build/chrome.zip chrome/*
