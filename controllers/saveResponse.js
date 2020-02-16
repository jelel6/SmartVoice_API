const handleSaveResponse = (req, res, db) => {
  const { id, query, writtenResponse } = req.body;
  if (!query || !id) {
    return res.status(400).json('invalid response data')
  }
 db('history')
   .returning('*')
   .insert({
      id: id,
      query: query,
      response: writtenResponse
  })
    .then(response => {
      res.json(response[0]);
    })
    .catch(err => res.status(400).json('unable to save duplicate query')) 
}

module.exports = {
  handleSaveResponse: handleSaveResponse,
}