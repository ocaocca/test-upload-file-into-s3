const express = require ("express");
const bodyParser = require ("body-parser")
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
require("dotenv").config()


const s3 = new AWS.S3();
const PORT = 3000;
const app = express()

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`,
  };
  return s3.upload(params).promise();
};

app.post('/upload-video', async (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(500).send(error);
    };

    try {
      const path = files.video[0].path;
      const buffer = fs.readFileSync(path);
      const type = await fileType.fromBuffer(buffer);
      const fileName = `videos/${Date.now().toString()}`;
      const data = await uploadFile(buffer, fileName, type);
      console.log(data.Location)

      return res.status(200).send(data);
    } catch (e) {
      console.log('MASUK KE CATCH ', e);
      return res.status(500).send(e);
    }
  })
})

app.post('/upload-file', async (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(500).send(error);
    };

    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = await fileType.fromBuffer(buffer);
      const fileName = `module/${Date.now().toString()}`;
      const data = await uploadFile(buffer, fileName, type);

      return res.status(200).send(data);
    } catch (e) {
      console.log('MASUK KE CATCH ', e);
      return res.status(500).send(e);
    }
  })
})

app.post('/upload-picture', async (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(500).send(error);
    };

    try {
      const path = files.picture[0].path;
      const buffer = fs.readFileSync(path);
      const type = await fileType.fromBuffer(buffer);
      const fileName = `picture/${Date.now().toString()}`;
      const data = await uploadFile(buffer, fileName, type);

      return res.status(200).send(data);
    } catch (e) {
      console.log('MASUK KE CATCH ', e);
      return res.status(500).send(e);
    }
  })
})

app.listen(PORT, () => {
  console.log(`Express is running on port http://localhost:${PORT}`);
});