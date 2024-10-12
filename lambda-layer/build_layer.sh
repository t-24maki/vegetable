#!/bin/bash

# Dockerイメージのビルド
docker build -t lambda-pdf-builder .

# Dockerコンテナの実行とパッケージの作成
docker run --rm -v $(pwd)/output:/output lambda-pdf-builder

echo "Lambda deployment package has been created in the output directory."