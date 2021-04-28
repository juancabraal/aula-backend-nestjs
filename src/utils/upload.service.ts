import {
    UploadedFileMetadata,
    AzureStorageService,
} from '@nestjs/azure-storage';

const azure = require('azure-storage');

import slug = require('slug');

import moment = require('moment');

import { ConfigService } from '@nestjs/config';

export class UploadService {
    public configService: ConfigService = new ConfigService();

    private readonly azureStorage: AzureStorageService = new AzureStorageService(
        {
            accountName: this.configService.get('AZURE_STORAGE_NAME'),
            containerName: this.configService.get('AZURE_STORAGE_CONTAINER'),
            sasKey: this.configService.get('AZURE_STORAGE_SAS_KEY'),
        },
    );

    constructor() {}

    async upload(file: UploadedFileMetadata) {
        try {
            let originalName = file.originalname.split('.');

            const fileType = originalName.pop();

            originalName = slug(originalName.join('.'), { lower: true });

            const fileName =
                originalName +
                '-' +
                moment().format('YMMDDHHss') +
                '.' +
                fileType;

            await this.azureStorage.upload({
                ...file,
                originalname: fileName,
            });

            return fileName;
        } catch (error) {
            throw error;
        }
    }

    delete(fileName) {
        return new Promise((resolve, reject) => {
            const blobServiceClient = azure.createBlobService(
                this.configService.get('AZURE_STORAGE_CONNECTION_STRING'),
            );

            blobServiceClient.deleteBlobIfExists(
                this.configService.get('AZURE_STORAGE_CONTAINER'),
                fileName,
                (error, result) => {
                    if (error) {
                        console.log(error);

                        reject(error);
                    } else {
                        resolve(result);
                    }
                },
            );
        });
    }
}
