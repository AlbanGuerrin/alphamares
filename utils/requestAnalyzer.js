const router = require('express').Router();

let statRequest = {}
let routes = [];
router.use((req, res, next) => {
    res.on('finish', () => {
        if (!statRequest[getRoute(req)])
            statRequest[getRoute(req)] = { [res.statusCode]: 1 }
        else if (!statRequest[getRoute(req)][res.statusCode])
            statRequest[getRoute(req)][res.statusCode] = 1
        else
            statRequest[getRoute(req)][res.statusCode]++
        process.stdout.write(`\x1B[${routes.length}A\x1B[K`);
        routes = Object.keys(statRequest).map((key) => [key, statRequest[key]])
        routes.forEach((route) => {
            console.log("   - ", ...route);
        })
    })
    next()
})

function getRoute(req) {
    const route = req.route ? req.route.path : '' // check if the handler exist
    const baseUrl = req.baseUrl ? req.baseUrl : '' // adding the base url if the handler is a child of another handler
    return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route'
}

module.exports.router = router;