const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const load = (roomId) => {
	const params = {
		Bucket: 'witebord',
		Key: `${roomId}.png`
	};

	// return the data
}

export const save = (roomId, data) => {
	const params = {
		Bucket: 'witebord',
		Key: `${roomId}.png`,
		Body: JSON.stringify(data, null, 2)
	};

	s3.upload(params, function (err, data) {
		console.log(err, data);
	});
}