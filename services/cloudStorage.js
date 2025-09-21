const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'kalakonnect-uploads';
const bucket = storage.bucket(bucketName);

class CloudStorageService {
    // Upload file to Google Cloud Storage
    async uploadFile(file, folder = 'products') {
        try {
            const fileName = `${folder}/${Date.now()}-${file.originalname}`;
            const blob = bucket.file(fileName);

            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype
                }
            });

            return new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    reject(err);
                });

                blobStream.on('finish', async () => {
                    // Make the file public
                    await blob.makePublic();
                    
                    // Get the public URL
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
                    
                    resolve({
                        url: publicUrl,
                        fileName: fileName
                    });
                });

                blobStream.end(file.buffer);
            });
        } catch (error) {
            console.error('Error uploading to Cloud Storage:', error);
            throw error;
        }
    }

    // Delete file from Cloud Storage
    async deleteFile(fileName) {
        try {
            await bucket.file(fileName).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting from Cloud Storage:', error);
            throw error;
        }
    }

    // Generate signed URL for temporary access
    async generateSignedUrl(fileName, expirationMinutes = 60) {
        try {
            const options = {
                version: 'v4',
                action: 'read',
                expires: Date.now() + expirationMinutes * 60 * 1000
            };

            const [url] = await bucket.file(fileName).getSignedUrl(options);
            return url;
        } catch (error) {
            console.error('Error generating signed URL:', error);
            throw error;
        }
    }
}

module.exports = new CloudStorageService();
