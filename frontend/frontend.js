// public/frontend.js
function sendQuery() {
  const userQuery = document.getElementById('userQuery').value;

  if (userQuery.trim() === '') {
      alert('Please enter a query.');
      return;
  }

  // Make API request to the server
  fetch('http://localhost:3000/api/google', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userQuery }),
  })
  .then(response => response.json())
  .then(data => {
      const chatbotResponse = data.response || 'No response from ChatGPT.';
      document.getElementById('chatbotResponse').innerHTML = `<p>${chatbotResponse}</p>`;
  })
  .catch(error => {
      console.error('Error:', error.message);
      alert('An error occurred while processing the request.');
  });

  // Clear input field
  document.getElementById('userQuery').value = '';
}

