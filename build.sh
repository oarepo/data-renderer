json=$(realpath $(dirname $0)/node_modules/.bin/json)
bili=$(realpath $(dirname $0)/node_modules/.bin/bili)

rm -rf dist
echo bla
ls
cd library
$bili -c bili.config.js --plugins.vue --format esm ./index.js
mv dist/index.esm.js dist/oarepo-data-renderer.esm.js
cat ../package.json | $json -e "delete this.scripts; delete this.devDependencies; delete this.dependencies" >dist/package.json
cp ../README.md dist
cp -r ../library/css dist
mv dist ..
