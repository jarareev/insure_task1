const express = require('express');
const router = express.Router();

const { insuranceController } = require('../controllers')
const upload = require('../middleware/upload');


router.post('/upload', upload.single('file'), insuranceController.importData);
router.get('/pinfos',insuranceController.policyInfo)
router.get('/pinfo/:user_name', insuranceController.getPolicyInfo);

// let routes = (app) => {
//     router.post('/upload', upload.single('file'), fileupload);


//     app.use("/api", router);
// }

module.exports = router;