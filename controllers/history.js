const handleHistory = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('history').where({
  id: id
  })
  .then(saved => {
    if(saved) {
      res.json(saved);
    } else {
      res.status(400).json('No Saved Queries')
    }     
  })
   .catch(err => res.status(400).json('not found'))
}

module.exports = {
	handleHistory: handleHistory,
}