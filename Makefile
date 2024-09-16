build-S3CopyFile:
	cp ./s3-copy-file/* $(ARTIFACTS_DIR) -r

	chmod +x $(ARTIFACTS_DIR)/extensions/s3_copy_file_nodejs
	chmod +x $(ARTIFACTS_DIR)/s3_copy_file_nodejs/index.js

	npm install -prefix $(ARTIFACTS_DIR)/s3_copy_file_nodejs
