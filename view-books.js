const express = require('express');

const router = express.Router();

// ===========================================================
// GET /series
// Get all series
// ===========================================================
router.get('', (req, res, next) => {
  console.log("~~ GET /series");
  res.json(db.series);
});

// ===========================================================
// POST /series name=new_name
// Add a series
// ===========================================================
router.post('', (req, res, next) => {
  console.log("~~ POST /series name=new_name");

  // get name
  const sName = req.body.name;
  if (!sName) {
    res.status(400).json({ error: { message: 'must pass a name' } });
    return;
  }

  // check that name is unique
  if (db.series.find(testSeries => testSeries.name === sName)) {
    res.status(400).json({ error: { message: 'name already in db' } });
    return;
  }

  // create new series
  const newSeries = {
    id: uuid(),
    name: sName,
  };

  // add new series to db
  db.series.push(newSeries);

  // respond to caller
  res.status(201).json(newSeries);
});

// ===========================================================
// GET /series/:id
// Get a series
// ===========================================================
router.get('/:id', (req, res, next) => {
  console.log("~~ GET /series/:id");
  rteHelper.respondRecord(db.series, req.params.id, res);
  // const series = db.series.find(testSeries => testSeries.id === req.params.id);
  // if (!series) {
  //   res.status(404).json({ error: { message: 'unk series' } });
  //   return;
  // }
  // res.json(series);
});

// ===========================================================
// PUT /series/:id name=new_name
// Update a series with a new name
// ===========================================================
router.put('/:id', (req, res, next) => {
  console.log("~~ PUT /series/:id name=new_name");
  console.log("~~~~ id=", req.params.id);
  console.log("~~~~ name=", req.body.name);

  // find the series to update
  const oSeriesToUpdate = db.series.find(series => series.id === req.params.id);

  // check that series was found
  if (!oSeriesToUpdate) {
    res.status(404).json({ error: { message: 'series id not found' } });
    return;
  }

  // get new name param
  if (!req.body.name) {
    res.status(400).json({ error: { message: 'must pass a name' } });
    return;
  }

  // check that no other series has the same name
  // (not in requirements but should have been)
  if (db.series.find(series => series.name === req.body.name && series.id !== req.params.id)) {
    res.status(400).json({ error: { message: 'name already in db' } });
    return;
  }

  console.log("~~~~~~ found: ", oSeriesToUpdate);

  // change the series data
  oSeriesToUpdate.name = req.body.name;

  // respond to caller
  res.status(200).json(oSeriesToUpdate);
});

// ===========================================================
// DELETE /series/:id
// Delete a series
// ===========================================================
router.delete('/:id', (req, res, next) => {
  console.log("~~ DELETE /series/:id");
  console.log("~~~~ id=", req.params.id);

  rteHelper.respondDelete(db.series, req.params.id, res);

  // // find the index of series to delete
  // const idxSeriesToDelete = db.series.findIndex(series => series.id === req.params.id);
  //
  // // check that series was found
  // if (idxSeriesToDelete < 0) {
  //   res.status(404).json({ error: { message: 'series id not found' } });
  //   return;
  // }
  //
  // // remove item from db
  // const deletedSeries = db.series.splice(idxSeriesToDelete, 1);
  //
  // // respond to caller
  // res.status(200).json(deletedSeries);
});

// ===========================================================
// GET /series/:id/characters
// Get all characters for a series
// ===========================================================
router.get('/:id/characters', (req, res, next) => {
  console.log("~~ GET /series/:id/characters");

  // find the series
  const series = db.series.find(testSeries => testSeries.id === req.params.id);
  if (!series) {
    res.status(404).json({ error: { message: 'unk series' } });
    return;
  }

  // return array of characters in the series
  res.json(db.characters.filter(character => character.series_id === series.id));
});

module.exports = router;
