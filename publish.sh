cp -TR ./build/ ./dist/
cd  ./dist
git add .
git commit -a -m 'publish'
git push origin master
cd ..