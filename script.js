// Frontend fetch request (localhost:5500)
async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/posts?postID=579a109d-eeec-45a5-a984-eb1bc1610c09', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // You can add other headers here as needed, such as 'Authorization'
            },
            credentials: 'same-origin', // Include credentials if necessary (cookies, etc.)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);  // Handle your data here
    } catch (error) {
        console.error('Error:', error);
    }
}
fetchData()