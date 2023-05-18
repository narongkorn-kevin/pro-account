const axios = require('axios');

app.post('/send-message', (req, res) => {
  const recipientId = req.body.recipientId;
  const message = req.body.message;

  axios.post('https://graph.facebook.com/v13.0/me/messages', {
    recipient: {
      id: recipientId
    },
    message: {
      text: message
    }
  }, {
    params: {
      access_token: 'EAACa5iDAEsMBALNFzxn4c8NphtXizlOPffxSkZBGBKAZBjEZBX5WqVzhObutJGYMO6VXqcCQWM6Y6EeHivhWmCJSNpGHpaU7sObXyHUxtDu1TRlrIneZCisNvfPrg6Oz0QUwRqyR4gFlBBZBGBNlZAYu2H2K3dK7y5auZAbIxJpZCCxhhC2akTd5'
    }
  })
  .then(response => {
    res.send(response.data);
  })
  .catch(error => {
    res.send(error);
  });
});
