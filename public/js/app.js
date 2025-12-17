// API Helper
async function fetchAPI(url, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('vi-VN');
}
