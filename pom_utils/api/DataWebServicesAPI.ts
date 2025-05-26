import https from 'https';
import { constants } from 'crypto';
import { createGunzip, Gunzip } from 'zlib';
import { IncomingMessage } from 'http';
import { config } from '../../playwright.config';

/**
 * Configuration for retry strategy
 */
interface RetryConfig {
    maxRetries: number;
    initialDelayMs: number;
    backoffFactor: number;
    retryableStatusCodes: number[];
}

export class DataWebServicesAPI {
    private readonly baseUrl: string;
    private readonly isQAEnvironment: boolean;
    private readonly retryConfig: RetryConfig;

    constructor(retryConfig?: Partial<RetryConfig>) {
        this.baseUrl = config.baseURL || 'https://my-qa.alldata.com';
        this.isQAEnvironment = config.environment === 'QA';

        // Default retry configuration
        this.retryConfig = {
            maxRetries: 3,
            initialDelayMs: 1000,
            backoffFactor: 2,
            retryableStatusCodes: [500, 502, 503, 504],
            ...retryConfig
        };
    }

    private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
        let lastError: Error | null = null;
        let delay = this.retryConfig.initialDelayMs;

        for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    console.log(`Retry attempt ${attempt}/${this.retryConfig.maxRetries}`);
                }

                const result = await operation();
                return result;
            } catch (error) {
                lastError = error;

                // Only retry for specific status codes
                const statusCode = error.statusCode || 0;
                const shouldRetry =
                    attempt < this.retryConfig.maxRetries &&
                    this.retryConfig.retryableStatusCodes.includes(statusCode);

                if (!shouldRetry) {
                    throw error;
                }

                console.log(`Request failed with status ${statusCode}. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= this.retryConfig.backoffFactor; // Exponential backoff
            }
        }
        throw lastError || new Error('Max retries exceeded');
    }

    async getVehicleDetailsByID(accessToken: string, carID: string = '61449'): Promise<{statusCode: number; body: any}> {
        return this.withRetry(() => this._getVehicleDetailsByID(accessToken, carID));
    }

    private async _getVehicleDetailsByID(accessToken: string, carID: string): Promise<{statusCode: number; body: any}> {
        const urlObj = new URL(`/ADAG/car-lookup/v3/carids/${carID}?locale=en_US&has-repair-data=true`, this.baseUrl);
        const headers = {
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': '*/*',
            'Cookie': `Access-Token=${accessToken}`
        };
        const agent = this.isQAEnvironment ? new https.Agent({
            rejectUnauthorized: false,
            secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT
        }) : undefined;

        return new Promise((resolve, reject) => {
            try {
                const options = {
                    method: 'GET',
                    headers,
                    agent,
                    hostname: urlObj.hostname,
                    path: urlObj.pathname + urlObj.search,
                    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80)
                };

                const request = https.request(options, (response: IncomingMessage) => {
                    const { statusCode } = response;
                    const encoding = response.headers['content-encoding'];
                    console.log('Response Encoding:', encoding);
                    console.log('Response Headers:', response.headers);

                    // Check for retryable status code
                    if (statusCode && this.retryConfig.retryableStatusCodes.includes(statusCode)) {
                        const error: any = new Error(`Server error: ${statusCode}`);
                        error.statusCode = statusCode;
                        reject(error);
                        return;
                    }

                    let responseStream: IncomingMessage | Gunzip = response;
                    if (encoding === 'gzip') {
                        responseStream = response.pipe(createGunzip());
                    }

                    const chunks: Buffer[] = [];
                    responseStream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));

                    responseStream.on('end', () => {
                        try {
                            const responseBuffer = Buffer.concat(chunks);
                            const responseText = responseBuffer.toString('utf8');
                            console.log('Raw Response:', responseText);

                            if (!responseText.trim()) {
                                throw new Error('Empty response received');
                            }

                            const parsedData = JSON.parse(responseText);
                            console.log('Parsed Response:', parsedData);

                            const carID = parsedData?.carid;
                            if (!carID) {
                                throw new Error('Car ID not found in response');
                            }

                            resolve({ statusCode: statusCode ?? 0, body: parsedData });
                        } catch (error) {
                            console.error('Error processing response:', error);
                            console.log('Response Buffer Length:', chunks.length);
                            reject(new Error(`Failed to process response: ${error.message}`));
                        }
                    });
                    responseStream.on('error', (error) => {
                        console.error('Error reading response:', error);
                        reject(error);
                    });
                });

                request.on('error', (error) => {
                    console.error('Request error:', error);
                    reject(error);
                });

                request.end();

            } catch (error) {
                console.error('Error sending request:', error);
                reject(error);
            }
        });
    }
}