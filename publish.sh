# To be verified: https://stackoverflow.com/a/22340057
cd dist
find . -path ./.git -prune -o \( \! -path ./privacy \) -exec rm -rf {} \; 2> /dev/null
cd ..

cp -TR ./build/ ./dist/
cp -TR ./build/index.html ./dist/privacy/index.html
cd  ./dist
git add .
git commit -a -m 'publish'
git push origin master
cd ..