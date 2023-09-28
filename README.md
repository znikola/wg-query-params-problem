# WunderGraph Query params issue

## Description

This repo demonstrates an issue where WunderGraph (WG) does not send query parameters to the API server when `statusCodeUnions` config is enabled. Additionally, it can be observed that WG was not able to properly resolve the result, and is throwing an error.

The repo was created by running `npx create-wundergraph-app@latest wg-query-params --example simple` and modifying some configuration files.

To compare the results, notice there are two introspections in the `wundergraph.config.ts`:

1. `wizGood`, which is able to properly send query parameters _and_ resolve the result.
2. `wizBad`, which is _not_ sending query parameters _and_ is not able to resolve the result.

## Installation

1. git clone the repo
2. `npm ci` - install dependencies
3. `npm run build` - cleans and generates wundergraph files
4. `npm run start` - starts the WG server in debug mode

## Reproducing

While the WG server is running, run the following:

1. `npx ts-node good.ts` - runs a script which demonstrates WG was able to successfully send the query parameters and resolve the API server's response. In the WG's logs, we can see `GET /Wizards?FirstName=Tom&LastName=Riddle HTTP/1.1` confirming the query params have been sent.
2. `npx ts-node bad.ts` - runs a script and demonstrates a case where WG was not able to send query params. This can be confirmed in the WG's logs where we can see `GET /Wizards HTTP/1.1` w/o query params. Because there are no query params, API server responded with all wizards, which can be seen in the WG's logs. For completeness sake, there's a cryptic error when WG tries to resolve the response:

```js
13:45:58.644 ERROR @wundergraph/node (apihandler/errorhandler.go:115) hooks pipeline failed reqId="a7d246f6-67ea-dc7a-c8f4-4c387016dce4" operationName="WizBadGetWizards" operationType="QUERY" error="ResolveGraphQLResponse failed: Key path not found"
github.com/wundergraph/wundergraph/pkg/apihandler.(*errorHandler).Done
        /Users/runner/work/wundergraph/wundergraph/pkg/apihandler/errorhandler.go:115
github.com/wundergraph/wundergraph/pkg/apihandler.(*QueryHandler).ServeHTTP
        /Users/runner/work/wundergraph/wundergraph/pkg/apihandler/apihandler.go:956
github.com/wundergraph/wundergraph/pkg/apihandler.(*operationMetricsHandler).Handler.func1
        /Users/runner/work/wundergraph/wundergraph/pkg/apihandler/metrics.go:125
net/http.HandlerFunc.ServeHTTP
        /Users/runner/hostedtoolcache/go/1.20.8/x64/src/net/http/server.go:2122
github.com/wundergraph/wundergraph/pkg/authentication.NewCSRFMw.func1.1
        /Users/runner/work/wundergraph/wundergraph/pkg/authentication/authentication.go:948
net/http.HandlerFunc.ServeHTTP
        /Users/runner/hostedtoolcache/go/1.20.8/x64/src/net/http/server.go:2122
github.com/wundergraph/wundergraph/pkg/authentication.NewLoadUserMw.func1.1
        /Users/runner/work/wundergraph/wundergraph/pkg/authentication/authentication.go:769
net/http.HandlerFunc.ServeHTTP
        /Users/runner/hostedtoolcache/go/1.20.8/x64/src/net/http/server.go:2122
github.com/wundergraph/wundergraph/pkg/apihandler.(*Builder).BuildAndMountApiHandler.func1.1
        /Users/runner/work/wundergraph/wundergraph/pkg/apihandler/apihandler.go:245
net/http.HandlerFunc.ServeHTTP
        /Users/runner/hostedtoolcache/go/1.20.8/x64/src/net/http/server.go:2122
github.com/gorilla/mux.(*Router).ServeHTTP
        /Users/runner/go/pkg/mod/github.com/gorilla/mux@v1.8.0/mux.go:210
github.com/rs/cors.(*Cors).Handler.func1
        /Users/runner/go/pkg/mod/github.com/rs/cors@v1.7.0/cors.go:219
net/http.HandlerFunc.ServeHTTP
        /Users/runner/hostedtoolcache/go/1.20.8/x64/src/net/http/server.go:2122
github.com/wundergraph/wundergraph/pkg/node.logRequestResponseHandler.func1
        /Users/runner/work/wundergraph/wundergraph/pkg/node/node.go:941
net/http.HandlerFunc.ServeHTTP
        /Users/runner/hostedtoolcache/go/1.20.8/x64/src/net/http/server.go:2122
net/http.serverHandler.ServeHTTP
        /Users/runner/hostedtoolcache/go/1.20.8/x64/src/net/http/server.go:2936
net/http.(*conn).serve
        /Users/runner/hostedtoolcache/go/1.20.8/x64/src/net/http/server.go:1995
outgoing response: HTTP/1.1 500 Internal Server Error
```

## Additional notes

1. The main issue is the fact that WG is not sending query parameters, and that is the reason for reporting this. We are not sure about the response error, and we mentioning it only for completeness.
2. This issue is blocking us from upgrading to the latest WG version.
3. On our current version (`0.167.1`), the situation is as follows:
   1. `npx ts-node good.ts` is sending the query parameters.
   2. `npx ts-node bad.ts` _is also sending the query parameters_.
4. We believe this started happening on `^0.172.0`.
