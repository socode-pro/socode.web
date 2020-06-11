# To be verified: https://stackoverflow.com/a/47800439/346701
cd dist
find . -path ./.git -prune -o -path ./privacy -prune -o -path ./extension -prune -o -exec rm -rf {} \; 2> /dev/null
cd ..

cp -TR ./build/ ./dist/
cp -TR ./build/index.html ./dist/privacy/index.html
cp -TR ./build/index.html ./dist/extension/index.html
cd  ./dist
git add .
git commit -a -m 'publish'
git push origin master
cd ..