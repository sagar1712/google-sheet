const express = require('express');
const { addRow } = require('./addRow');

const app = express();
app.use(express.json());
// Sample req body
// {
//     "data": [
//       {
//         "id": 2,
//         "name": "A",
//         "image": "A.png"
//       },
//   {
//         "id": 3,
//         "name": "B",
//         "image": "B.png"
//       },
//   {
//         "id": 4,
//         "name": "C",
//         "image": "C.png"
//       }
//     ]
//   }
app.post('/add-row', async (req, res) => {
	try {
		await addRow(req.body.data);
		res.status(200).send('Data stored successfully');
	} catch (error) {
		res.status(500).send('Error storing data: ' + error.message);
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
