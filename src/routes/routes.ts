const router = require("express").Router();
const binController = require("../controllers/binController");
const dbController = require("../controllers/dbController");

router.get('/create-bin', binController.createNewBin);
router.get('/reset-db', dbController.resetDB);
// router.get('/delete-seed', dbController.deleteSeed);
router.get('/:id/instructions', binController.showInstructions);
router.get('/:id/view', binController.viewOneBin);
router.all("/:id", binController.catchRequestInBin);

export default router;