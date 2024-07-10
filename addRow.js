const fs = require('fs');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const credentials = JSON.parse(fs.readFileSync('./credentials.json'));
const auth = new GoogleAuth({
	credentials,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1E62_zILUtivHASDM6TPt_FDaZcFMGm8l58__PIybTfM'; // Change this with your google sheet id found in the url
const range = 'Sheet1';

async function addRow(data) {
	try {
		if (data.length === 0) {
			throw new Error('No data provided');
		}

		const headers = Object.keys(data[0]);

		const existingHeadersResponse = await sheets.spreadsheets.values.get({
			spreadsheetId: spreadsheetId,
			range: `${range}!1:1`,
		});

		const existingHeaders = existingHeadersResponse.data.values
			? existingHeadersResponse.data.values[0]
			: [];

		if (existingHeaders.length === 0) {
			await sheets.spreadsheets.values.append({
				spreadsheetId: spreadsheetId,
				range: range,
				valueInputOption: 'RAW',
				resource: {
					values: [headers], // Add headers as the first row
				},
			});
		}

		const values = data.map((row) => headers.map((header) => row[header]));

		// Append data rows
		const response = await sheets.spreadsheets.values.append({
			spreadsheetId: spreadsheetId,
			range: range,
			valueInputOption: 'RAW',
			resource: {
				values,
			},
		});

		console.log('Data stored successfully:', response.data);
	} catch (error) {
		console.error('Error storing data:', error);
	}
}

module.exports = { addRow };
