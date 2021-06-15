const express = require("express");

const inventoryRoute = require("./Insurance.routes");

const router = express.Router();

const defaultRoutes = [{
    path: "/api",
    route: inventoryRoute,
},
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;