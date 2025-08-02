"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "(pages-dir-node)/./src/createEmotionCache.ts":
/*!***********************************!*\
  !*** ./src/createEmotionCache.ts ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ createEmotionCache)\n/* harmony export */ });\n/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/cache */ \"@emotion/cache\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_emotion_cache__WEBPACK_IMPORTED_MODULE_0__]);\n_emotion_cache__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// In ai_pills/frontend/client_nextjs/src/createEmotionCache.ts\n\n// prepend: true moves MUI styles to the top of the <head> so they're loaded first.\n// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.\nfunction createEmotionCache() {\n    return (0,_emotion_cache__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n        key: 'css',\n        prepend: true\n    });\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jcmVhdGVFbW90aW9uQ2FjaGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSwrREFBK0Q7QUFDdEI7QUFFekMsbUZBQW1GO0FBQ25GLHFHQUFxRztBQUN0RixTQUFTQztJQUN0QixPQUFPRCwwREFBV0EsQ0FBQztRQUFFRSxLQUFLO1FBQU9DLFNBQVM7SUFBSztBQUNqRCIsInNvdXJjZXMiOlsiL1VzZXJzL3B1cnVzaG90aGFtX3NpcmVlc2hhQG9wdHVtLmNvbS9Eb2N1bWVudHMvQUlfUElMTC9Gcm9udGVuZC9zcmMvY3JlYXRlRW1vdGlvbkNhY2hlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEluIGFpX3BpbGxzL2Zyb250ZW5kL2NsaWVudF9uZXh0anMvc3JjL2NyZWF0ZUVtb3Rpb25DYWNoZS50c1xuaW1wb3J0IGNyZWF0ZUNhY2hlIGZyb20gJ0BlbW90aW9uL2NhY2hlJztcblxuLy8gcHJlcGVuZDogdHJ1ZSBtb3ZlcyBNVUkgc3R5bGVzIHRvIHRoZSB0b3Agb2YgdGhlIDxoZWFkPiBzbyB0aGV5J3JlIGxvYWRlZCBmaXJzdC5cbi8vIEl0IGFsbG93cyBkZXZlbG9wZXJzIHRvIGVhc2lseSBvdmVycmlkZSBNVUkgc3R5bGVzIHdpdGggb3RoZXIgc3R5bGluZyBzb2x1dGlvbnMsIGxpa2UgQ1NTIG1vZHVsZXMuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVFbW90aW9uQ2FjaGUoKSB7XG4gIHJldHVybiBjcmVhdGVDYWNoZSh7IGtleTogJ2NzcycsIHByZXBlbmQ6IHRydWUgfSk7XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2FjaGUiLCJjcmVhdGVFbW90aW9uQ2FjaGUiLCJrZXkiLCJwcmVwZW5kIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/createEmotionCache.ts\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_document.tsx":
/*!*********************************!*\
  !*** ./src/pages/_document.tsx ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyDocument)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/document */ \"(pages-dir-node)/./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/server/create-instance */ \"@emotion/server/create-instance\");\n/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../theme */ \"(pages-dir-node)/./src/theme.ts\");\n/* harmony import */ var _createEmotionCache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../createEmotionCache */ \"(pages-dir-node)/./src/createEmotionCache.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_3__, _theme__WEBPACK_IMPORTED_MODULE_4__, _createEmotionCache__WEBPACK_IMPORTED_MODULE_5__]);\n([_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_3__, _theme__WEBPACK_IMPORTED_MODULE_4__, _createEmotionCache__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n// In ai_pills/frontend/client_nextjs/src/pages/_document.tsx\n\n\n // Added DocumentContext\n\n\n\nclass MyDocument extends (next_document__WEBPACK_IMPORTED_MODULE_2___default()) {\n    render() {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Html, {\n            lang: \"en\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Head, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                            name: \"theme-color\",\n                            content: _theme__WEBPACK_IMPORTED_MODULE_4__[\"default\"].palette.primary.main\n                        }, void 0, false, {\n                            fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n                            lineNumber: 18,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                            rel: \"shortcut icon\",\n                            href: \"/favicon.ico\"\n                        }, void 0, false, {\n                            fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n                            lineNumber: 19,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                            rel: \"stylesheet\",\n                            href: \"https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap\"\n                        }, void 0, false, {\n                            fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n                            lineNumber: 20,\n                            columnNumber: 11\n                        }, this),\n                        this.props.emotionStyleTags\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n                    lineNumber: 16,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"body\", {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Main, {}, void 0, false, {\n                            fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n                            lineNumber: 28,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.NextScript, {}, void 0, false, {\n                            fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n                            lineNumber: 29,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n                    lineNumber: 27,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n            lineNumber: 15,\n            columnNumber: 7\n        }, this);\n    }\n}\nMyDocument.getInitialProps = async (ctx)=>{\n    const originalRenderPage = ctx.renderPage;\n    const cache = (0,_createEmotionCache__WEBPACK_IMPORTED_MODULE_5__[\"default\"])();\n    const { extractCriticalToChunks } = (0,_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(cache);\n    ctx.renderPage = ()=>originalRenderPage({\n            enhanceApp: (App)=>function EnhanceApp(props) {\n                    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(App, {\n                        emotionCache: cache,\n                        ...props\n                    }, void 0, false, {\n                        fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n                        lineNumber: 45,\n                        columnNumber: 18\n                    }, this);\n                }\n        });\n    const initialProps = await next_document__WEBPACK_IMPORTED_MODULE_2___default().getInitialProps(ctx);\n    const emotionStyles = extractCriticalToChunks(initialProps.html);\n    const emotionStyleTags = emotionStyles.styles.map((style)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"style\", {\n            \"data-emotion\": `${style.key} ${style.ids.join(' ')}`,\n            // eslint-disable-next-line react/no-danger\n            dangerouslySetInnerHTML: {\n                __html: style.css\n            }\n        }, style.key, false, {\n            fileName: \"/Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/_document.tsx\",\n            lineNumber: 52,\n            columnNumber: 5\n        }, undefined));\n    return {\n        ...initialProps,\n        emotionStyleTags\n    };\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fZG9jdW1lbnQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2REFBNkQ7O0FBQzlCO0FBQ3dFLENBQUMsd0JBQXdCO0FBQzlEO0FBQ3JDO0FBQzBCO0FBTXhDLE1BQU1TLG1CQUFtQlIsc0RBQVFBO0lBQzlDUyxTQUFTO1FBQ1AscUJBQ0UsOERBQUNSLCtDQUFJQTtZQUFDUyxNQUFLOzs4QkFDVCw4REFBQ1IsK0NBQUlBOztzQ0FFSCw4REFBQ1M7NEJBQUtDLE1BQUs7NEJBQWNDLFNBQVNQLHNEQUFhLENBQUNTLE9BQU8sQ0FBQ0MsSUFBSTs7Ozs7O3NDQUM1RCw4REFBQ0M7NEJBQUtDLEtBQUk7NEJBQWdCQyxNQUFLOzs7Ozs7c0NBQy9CLDhEQUFDRjs0QkFDQ0MsS0FBSTs0QkFDSkMsTUFBSzs7Ozs7O3dCQUdOLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxnQkFBZ0I7Ozs7Ozs7OEJBRTlCLDhEQUFDQzs7c0NBQ0MsOERBQUNuQiwrQ0FBSUE7Ozs7O3NDQUNMLDhEQUFDQyxxREFBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSW5CO0FBQ0Y7QUFFQUksV0FBV2UsZUFBZSxHQUFHLE9BQU9DO0lBQ2xDLE1BQU1DLHFCQUFxQkQsSUFBSUUsVUFBVTtJQUN6QyxNQUFNQyxRQUFRcEIsK0RBQWtCQTtJQUNoQyxNQUFNLEVBQUVxQix1QkFBdUIsRUFBRSxHQUFHdkIsMkVBQW1CQSxDQUFDc0I7SUFFeERILElBQUlFLFVBQVUsR0FBRyxJQUNmRCxtQkFBbUI7WUFDakJJLFlBQVksQ0FBQ0MsTUFDWCxTQUFTQyxXQUFXWCxLQUFLO29CQUN2QixxQkFBTyw4REFBQ1U7d0JBQUlFLGNBQWNMO3dCQUFRLEdBQUdQLEtBQUs7Ozs7OztnQkFDNUM7UUFDSjtJQUVGLE1BQU1hLGVBQWUsTUFBTWpDLG9FQUF3QixDQUFDd0I7SUFDcEQsTUFBTVUsZ0JBQWdCTix3QkFBd0JLLGFBQWFFLElBQUk7SUFDL0QsTUFBTWQsbUJBQW1CYSxjQUFjRSxNQUFNLENBQUNDLEdBQUcsQ0FBQyxDQUFDQyxzQkFDakQsOERBQUNBO1lBQ0NDLGdCQUFjLEdBQUdELE1BQU1FLEdBQUcsQ0FBQyxDQUFDLEVBQUVGLE1BQU1HLEdBQUcsQ0FBQ0MsSUFBSSxDQUFDLE1BQU07WUFFbkQsMkNBQTJDO1lBQzNDQyx5QkFBeUI7Z0JBQUVDLFFBQVFOLE1BQU1PLEdBQUc7WUFBQztXQUZ4Q1AsTUFBTUUsR0FBRzs7Ozs7SUFNbEIsT0FBTztRQUNMLEdBQUdQLFlBQVk7UUFDZlo7SUFDRjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvcHVydXNob3RoYW1fc2lyZWVzaGFAb3B0dW0uY29tL0RvY3VtZW50cy9BSV9QSUxML0Zyb250ZW5kL3NyYy9wYWdlcy9fZG9jdW1lbnQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIEluIGFpX3BpbGxzL2Zyb250ZW5kL2NsaWVudF9uZXh0anMvc3JjL3BhZ2VzL19kb2N1bWVudC50c3hcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBEb2N1bWVudCwgeyBIdG1sLCBIZWFkLCBNYWluLCBOZXh0U2NyaXB0LCBEb2N1bWVudFByb3BzLCBEb2N1bWVudENvbnRleHQgfSBmcm9tICduZXh0L2RvY3VtZW50JzsgLy8gQWRkZWQgRG9jdW1lbnRDb250ZXh0XG5pbXBvcnQgY3JlYXRlRW1vdGlvblNlcnZlciBmcm9tICdAZW1vdGlvbi9zZXJ2ZXIvY3JlYXRlLWluc3RhbmNlJztcbmltcG9ydCB0aGVtZSBmcm9tICcuLi90aGVtZSc7XG5pbXBvcnQgY3JlYXRlRW1vdGlvbkNhY2hlIGZyb20gJy4uL2NyZWF0ZUVtb3Rpb25DYWNoZSc7XG5cbmludGVyZmFjZSBNeURvY3VtZW50UHJvcHMgZXh0ZW5kcyBEb2N1bWVudFByb3BzIHtcbiAgZW1vdGlvblN0eWxlVGFnczogSlNYLkVsZW1lbnRbXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXlEb2N1bWVudCBleHRlbmRzIERvY3VtZW50PE15RG9jdW1lbnRQcm9wcz4ge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxIdG1sIGxhbmc9XCJlblwiPlxuICAgICAgICA8SGVhZD5cbiAgICAgICAgICB7LyogUFdBIHByaW1hcnkgY29sb3IgKi99XG4gICAgICAgICAgPG1ldGEgbmFtZT1cInRoZW1lLWNvbG9yXCIgY29udGVudD17dGhlbWUucGFsZXR0ZS5wcmltYXJ5Lm1haW59IC8+XG4gICAgICAgICAgPGxpbmsgcmVsPVwic2hvcnRjdXQgaWNvblwiIGhyZWY9XCIvZmF2aWNvbi5pY29cIiAvPlxuICAgICAgICAgIDxsaW5rXG4gICAgICAgICAgICByZWw9XCJzdHlsZXNoZWV0XCJcbiAgICAgICAgICAgIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvOjMwMCw0MDAsNTAwLDcwMCZkaXNwbGF5PXN3YXBcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgey8qIEluamVjdCBNVUkgc3R5bGVzIGZpcnN0IHRvIG1hdGNoIHdpdGggdGhlIHByZXBlbmQ6IHRydWUgY29uZmlndXJhdGlvbi4gKi99XG4gICAgICAgICAge3RoaXMucHJvcHMuZW1vdGlvblN0eWxlVGFnc31cbiAgICAgICAgPC9IZWFkPlxuICAgICAgICA8Ym9keT5cbiAgICAgICAgICA8TWFpbiAvPlxuICAgICAgICAgIDxOZXh0U2NyaXB0IC8+XG4gICAgICAgIDwvYm9keT5cbiAgICAgIDwvSHRtbD5cbiAgICApO1xuICB9XG59XG5cbk15RG9jdW1lbnQuZ2V0SW5pdGlhbFByb3BzID0gYXN5bmMgKGN0eDogRG9jdW1lbnRDb250ZXh0KSA9PiB7IC8vIFR5cGVkIGN0eFxuICBjb25zdCBvcmlnaW5hbFJlbmRlclBhZ2UgPSBjdHgucmVuZGVyUGFnZTtcbiAgY29uc3QgY2FjaGUgPSBjcmVhdGVFbW90aW9uQ2FjaGUoKTtcbiAgY29uc3QgeyBleHRyYWN0Q3JpdGljYWxUb0NodW5rcyB9ID0gY3JlYXRlRW1vdGlvblNlcnZlcihjYWNoZSk7XG5cbiAgY3R4LnJlbmRlclBhZ2UgPSAoKSA9PlxuICAgIG9yaWdpbmFsUmVuZGVyUGFnZSh7XG4gICAgICBlbmhhbmNlQXBwOiAoQXBwOiBhbnkpID0+IC8vIENvbnNpZGVyIG1vcmUgc3BlY2lmaWMgdHlwZSBmb3IgQXBwIGlmIGF2YWlsYWJsZVxuICAgICAgICBmdW5jdGlvbiBFbmhhbmNlQXBwKHByb3BzKSB7IC8vIHByb3BzIHNob3VsZCBhbHNvIGJlIHR5cGVkIGlmIHBvc3NpYmxlXG4gICAgICAgICAgcmV0dXJuIDxBcHAgZW1vdGlvbkNhY2hlPXtjYWNoZX0gey4uLnByb3BzfSAvPjtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICBjb25zdCBpbml0aWFsUHJvcHMgPSBhd2FpdCBEb2N1bWVudC5nZXRJbml0aWFsUHJvcHMoY3R4KTtcbiAgY29uc3QgZW1vdGlvblN0eWxlcyA9IGV4dHJhY3RDcml0aWNhbFRvQ2h1bmtzKGluaXRpYWxQcm9wcy5odG1sKTtcbiAgY29uc3QgZW1vdGlvblN0eWxlVGFncyA9IGVtb3Rpb25TdHlsZXMuc3R5bGVzLm1hcCgoc3R5bGUpID0+IChcbiAgICA8c3R5bGVcbiAgICAgIGRhdGEtZW1vdGlvbj17YCR7c3R5bGUua2V5fSAke3N0eWxlLmlkcy5qb2luKCcgJyl9YH1cbiAgICAgIGtleT17c3R5bGUua2V5fVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWRhbmdlclxuICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBzdHlsZS5jc3MgfX1cbiAgICAvPlxuICApKTtcblxuICByZXR1cm4ge1xuICAgIC4uLmluaXRpYWxQcm9wcyxcbiAgICBlbW90aW9uU3R5bGVUYWdzLFxuICB9O1xufTtcbiJdLCJuYW1lcyI6WyJSZWFjdCIsIkRvY3VtZW50IiwiSHRtbCIsIkhlYWQiLCJNYWluIiwiTmV4dFNjcmlwdCIsImNyZWF0ZUVtb3Rpb25TZXJ2ZXIiLCJ0aGVtZSIsImNyZWF0ZUVtb3Rpb25DYWNoZSIsIk15RG9jdW1lbnQiLCJyZW5kZXIiLCJsYW5nIiwibWV0YSIsIm5hbWUiLCJjb250ZW50IiwicGFsZXR0ZSIsInByaW1hcnkiLCJtYWluIiwibGluayIsInJlbCIsImhyZWYiLCJwcm9wcyIsImVtb3Rpb25TdHlsZVRhZ3MiLCJib2R5IiwiZ2V0SW5pdGlhbFByb3BzIiwiY3R4Iiwib3JpZ2luYWxSZW5kZXJQYWdlIiwicmVuZGVyUGFnZSIsImNhY2hlIiwiZXh0cmFjdENyaXRpY2FsVG9DaHVua3MiLCJlbmhhbmNlQXBwIiwiQXBwIiwiRW5oYW5jZUFwcCIsImVtb3Rpb25DYWNoZSIsImluaXRpYWxQcm9wcyIsImVtb3Rpb25TdHlsZXMiLCJodG1sIiwic3R5bGVzIiwibWFwIiwic3R5bGUiLCJkYXRhLWVtb3Rpb24iLCJrZXkiLCJpZHMiLCJqb2luIiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJfX2h0bWwiLCJjc3MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_document.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./src/theme.ts":
/*!**********************!*\
  !*** ./src/theme.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mui/material/styles */ \"(pages-dir-node)/./node_modules/@mui/material/esm/styles/index.js\");\n/* harmony import */ var _mui_material_colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/material/colors */ \"(pages-dir-node)/./node_modules/@mui/material/esm/colors/index.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_mui_material_styles__WEBPACK_IMPORTED_MODULE_0__]);\n_mui_material_styles__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// In ai_pills/frontend/client_nextjs/src/theme.ts\n\n\n// Create a theme instance.\nconst theme = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_0__.createTheme)({\n    palette: {\n        primary: {\n            main: '#556cd6'\n        },\n        secondary: {\n            main: '#19857b'\n        },\n        error: {\n            main: _mui_material_colors__WEBPACK_IMPORTED_MODULE_1__.red.A400\n        }\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (theme);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy90aGVtZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxrREFBa0Q7QUFDQztBQUNSO0FBRTNDLDJCQUEyQjtBQUMzQixNQUFNRSxRQUFRRixpRUFBV0EsQ0FBQztJQUN4QkcsU0FBUztRQUNQQyxTQUFTO1lBQ1BDLE1BQU07UUFDUjtRQUNBQyxXQUFXO1lBQ1RELE1BQU07UUFDUjtRQUNBRSxPQUFPO1lBQ0xGLE1BQU1KLHFEQUFHQSxDQUFDTyxJQUFJO1FBQ2hCO0lBQ0Y7QUFDRjtBQUVBLGlFQUFlTixLQUFLQSxFQUFDIiwic291cmNlcyI6WyIvVXNlcnMvcHVydXNob3RoYW1fc2lyZWVzaGFAb3B0dW0uY29tL0RvY3VtZW50cy9BSV9QSUxML0Zyb250ZW5kL3NyYy90aGVtZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbiBhaV9waWxscy9mcm9udGVuZC9jbGllbnRfbmV4dGpzL3NyYy90aGVtZS50c1xuaW1wb3J0IHsgY3JlYXRlVGhlbWUgfSBmcm9tICdAbXVpL21hdGVyaWFsL3N0eWxlcyc7XG5pbXBvcnQgeyByZWQgfSBmcm9tICdAbXVpL21hdGVyaWFsL2NvbG9ycyc7XG5cbi8vIENyZWF0ZSBhIHRoZW1lIGluc3RhbmNlLlxuY29uc3QgdGhlbWUgPSBjcmVhdGVUaGVtZSh7XG4gIHBhbGV0dGU6IHtcbiAgICBwcmltYXJ5OiB7XG4gICAgICBtYWluOiAnIzU1NmNkNicsXG4gICAgfSxcbiAgICBzZWNvbmRhcnk6IHtcbiAgICAgIG1haW46ICcjMTk4NTdiJyxcbiAgICB9LFxuICAgIGVycm9yOiB7XG4gICAgICBtYWluOiByZWQuQTQwMCxcbiAgICB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHRoZW1lO1xuIl0sIm5hbWVzIjpbImNyZWF0ZVRoZW1lIiwicmVkIiwidGhlbWUiLCJwYWxldHRlIiwicHJpbWFyeSIsIm1haW4iLCJzZWNvbmRhcnkiLCJlcnJvciIsIkE0MDAiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/theme.ts\n");

/***/ }),

/***/ "@emotion/cache":
/*!*********************************!*\
  !*** external "@emotion/cache" ***!
  \*********************************/
/***/ ((module) => {

module.exports = import("@emotion/cache");;

/***/ }),

/***/ "@emotion/server/create-instance":
/*!**************************************************!*\
  !*** external "@emotion/server/create-instance" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = import("@emotion/server/create-instance");;

/***/ }),

/***/ "@mui/system":
/*!******************************!*\
  !*** external "@mui/system" ***!
  \******************************/
/***/ ((module) => {

module.exports = import("@mui/system");;

/***/ }),

/***/ "@mui/system/InitColorSchemeScript":
/*!****************************************************!*\
  !*** external "@mui/system/InitColorSchemeScript" ***!
  \****************************************************/
/***/ ((module) => {

module.exports = import("@mui/system/InitColorSchemeScript");;

/***/ }),

/***/ "@mui/system/colorManipulator":
/*!***********************************************!*\
  !*** external "@mui/system/colorManipulator" ***!
  \***********************************************/
/***/ ((module) => {

module.exports = import("@mui/system/colorManipulator");;

/***/ }),

/***/ "@mui/system/createBreakpoints":
/*!************************************************!*\
  !*** external "@mui/system/createBreakpoints" ***!
  \************************************************/
/***/ ((module) => {

module.exports = import("@mui/system/createBreakpoints");;

/***/ }),

/***/ "@mui/system/createStyled":
/*!*******************************************!*\
  !*** external "@mui/system/createStyled" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = import("@mui/system/createStyled");;

/***/ }),

/***/ "@mui/system/createTheme":
/*!******************************************!*\
  !*** external "@mui/system/createTheme" ***!
  \******************************************/
/***/ ((module) => {

module.exports = import("@mui/system/createTheme");;

/***/ }),

/***/ "@mui/system/cssVars":
/*!**************************************!*\
  !*** external "@mui/system/cssVars" ***!
  \**************************************/
/***/ ((module) => {

module.exports = import("@mui/system/cssVars");;

/***/ }),

/***/ "@mui/system/spacing":
/*!**************************************!*\
  !*** external "@mui/system/spacing" ***!
  \**************************************/
/***/ ((module) => {

module.exports = import("@mui/system/spacing");;

/***/ }),

/***/ "@mui/system/styleFunctionSx":
/*!**********************************************!*\
  !*** external "@mui/system/styleFunctionSx" ***!
  \**********************************************/
/***/ ((module) => {

module.exports = import("@mui/system/styleFunctionSx");;

/***/ }),

/***/ "@mui/system/useThemeProps":
/*!********************************************!*\
  !*** external "@mui/system/useThemeProps" ***!
  \********************************************/
/***/ ((module) => {

module.exports = import("@mui/system/useThemeProps");;

/***/ }),

/***/ "@mui/utils/deepmerge":
/*!***************************************!*\
  !*** external "@mui/utils/deepmerge" ***!
  \***************************************/
/***/ ((module) => {

module.exports = import("@mui/utils/deepmerge");;

/***/ }),

/***/ "@mui/utils/formatMuiErrorMessage":
/*!***************************************************!*\
  !*** external "@mui/utils/formatMuiErrorMessage" ***!
  \***************************************************/
/***/ ((module) => {

module.exports = import("@mui/utils/formatMuiErrorMessage");;

/***/ }),

/***/ "@mui/utils/generateUtilityClass":
/*!**************************************************!*\
  !*** external "@mui/utils/generateUtilityClass" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = import("@mui/utils/generateUtilityClass");;

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("prop-types");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@mui","vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./src/pages/_document.tsx")));
module.exports = __webpack_exports__;

})();