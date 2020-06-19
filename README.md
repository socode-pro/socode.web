This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Tips

1 先安装 与 docsearch.js dependencies 版本匹配的 algoliasearch、autocomplete.js 包. 然后再安装 docsearch.js，这样 docsearch.js 内就不存在 node_modules 目录，可以节省最终打包体积。
warn: [docsearch.js github package.json](https://github.com/algolia/docsearch/blob/master/package.json) 描述不准确，应该是因为发布版本与源码不一致。要以 npm_module/docsearch.js/package.json 显示的实际版本为准

2 react-scripts 的 env 变量与[netlify build 环境变量](https://docs.netlify.com/configure-builds/environment-variables/#declare-variables)没有关联，必须在 Build command 字段填写：

```bash
env CI='' npm run build
```

才能避免 react-scripts 在 CI 环境下把 warn 定义为 error
