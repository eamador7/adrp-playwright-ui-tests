import https from 'https';
import { constants } from 'crypto';
import { createGunzip, Gunzip } from 'zlib';
import { IncomingMessage } from 'http';
import { EstimateDataGenerator } from '../data-generators/EstimateDataGenerator';
import {config } from '../../playwright.config';

/**
 * Configuration for retry strategy
 */
interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  backoffFactor: number;
  retryableStatusCodes: number[];
}

/**
 * API client for estimate-related endpoints
 */
export class EstimateAPI {
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

    /**
     * Helper method to implement exponential backoff retry
     * @param operation - Function to retry
     * @returns Promise with the operation result
     */
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

        // Should never reach here due to throwing in the loop, but TypeScript needs this
        throw lastError || new Error('Operation failed after retries');
    }

    /**
     * Posts a new estimate
     * @param accessToken - Authentication token
     * @returns Promise with status code and estimate ID
     */
    async postEstimate(accessToken: string): Promise<{ statusCode: number; estimateId: string, estimateNumber: string }> {  
        return this.withRetry(() => this._postEstimate(accessToken));
    }

    /**
     * Internal implementation of postEstimate
     */
    private async _postEstimate(accessToken: string): Promise<{ statusCode: number; estimateId: string, estimateNumber: string }> {
        if (!accessToken) {
            throw new Error('No authentication token provided');
        }

        const urlObj = new URL('/ADAG/repair-planner/estimates', this.baseUrl);
        const headers = {
            'Accept': 'application/hal+json',
            'Content-Type': 'application/json',
            'Cookie': `Access-Token=${accessToken}`,
        };

        const body = JSON.stringify([EstimateDataGenerator.generateEstimate()]);
        const agent = this.isQAEnvironment ? new https.Agent({
            rejectUnauthorized: false,
            secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT
        }) : undefined;

        return new Promise((resolve, reject) => {
            try {
                const options = {
                    method: 'POST',
                    headers,
                    agent,
                    hostname: urlObj.hostname,
                    path: urlObj.pathname,
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

                            const estimateId = parsedData?.estimates?.[0]?.id;
                            if (!estimateId) {
                                throw new Error('Estimate ID not found in response');
                            }

                            const estimateNumber = parsedData?.estimates?.[0]?.estimateNumber;
                            if (!estimateNumber) {
                                throw new Error('Estimate Number not found in response');
                            }


                            resolve({ statusCode: statusCode ?? 0, estimateId, estimateNumber });
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

                request.write(body);
                request.end();

            } catch (error) {
                console.error('Error sending request:', error);
                reject(error);
            }
        });
    }

    /**
     * Maps an estimate to a vehicle
     * @param accessToken - Authentication token
     * @param estimateId - ID of the estimate to map
     * @param vehicleId - ID of the vehicle to map to the estimate
     * @returns Promise with status code
     */
    async mapEstimateToVehicle(accessToken: string, estimateId: string, vehicleId: string = '12345'): Promise<{ statusCode: number }> {
        return this.withRetry(() => this._mapEstimateToVehicle(accessToken, estimateId, vehicleId));
    }

    /**
     * Internal implementation of mapEstimateToVehicle
     */
    private async _mapEstimateToVehicle(accessToken: string, estimateId: string, vehicleId: string = '12345'): Promise<{ statusCode: number }> {
        if (!accessToken) {
            throw new Error('No authentication token provided');
        }

        const urlObj = new URL(`/ADAG/repair-planner/estimates/${estimateId}`, this.baseUrl);
        urlObj.searchParams.append('vehicleId', vehicleId);

        const headers = {
            'Accept': 'application/hal+json',
            'Cookie': `Access-Token=${accessToken}`,
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
                    path: `${urlObj.pathname}${urlObj.search}`,
                    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80)
                };

                const request = https.request(options, (response: IncomingMessage) => {
                    const { statusCode } = response;
                    const encoding = response.headers['content-encoding'];
                    console.log('Mapping Response Status:', statusCode);

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
                            // We don't need to parse the response for this endpoint
                            // Just check if the status code indicates success
                            if (statusCode && statusCode >= 200 && statusCode < 300) {
                                resolve({ statusCode: statusCode });
                            } else {
                                const responseBuffer = Buffer.concat(chunks);
                                const responseText = responseBuffer.toString('utf8');
                                const error: any = new Error(`Failed to map estimate to vehicle. Status: ${statusCode}, Response: ${responseText}`);
                                error.statusCode = statusCode;
                                reject(error);
                            }
                        } catch (error) {
                            console.error('Error processing mapping response:', error);
                            reject(new Error(`Failed to process mapping response: ${error.message}`));
                        }
                    });

                    responseStream.on('error', (error) => {
                        console.error('Error reading mapping response:', error);
                        reject(error);
                    });
                });

                request.on('error', (error) => {
                    console.error('Mapping request error:', error);
                    reject(error);
                });

                request.end();

            } catch (error) {
                console.error('Error sending mapping request:', error);
                reject(error);
            }
        });
    }

    /**
     * Logs out and invalidates the provided access token
     * @param accessToken - Authentication token to invalidate
     * @returns Promise with status code
     */
    async logout(accessToken: string): Promise<{ statusCode: number }> {
        return this.withRetry(() => this._logout(accessToken));
    }

    /**
     * Internal implementation of logout
     */
    private async _logout(accessToken: string): Promise<{ statusCode: number }> {
        if (!accessToken) {
            throw new Error('No authentication token provided for logout');
        }

        const urlObj = new URL('/ADAG/sso/logout', this.baseUrl);
        const headers = {
            'Accept': 'application/json',
            'Cookie': `Access-Token=${accessToken}`,
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
                    path: urlObj.pathname,
                    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80)
                };

                const request = https.request(options, (response: IncomingMessage) => {
                    const { statusCode } = response;
                    console.log('Logout Response Status:', statusCode);

                    // Check for retryable status code
                    if (statusCode && this.retryConfig.retryableStatusCodes.includes(statusCode)) {
                        const error: any = new Error(`Server error: ${statusCode}`);
                        error.statusCode = statusCode;
                        reject(error);
                        return;
                    }

                    // For logout, we don't care about the response body
                    response.on('data', () => {});
                    
                    response.on('end', () => {
                        if (statusCode && statusCode >= 200 && statusCode < 300) {
                            resolve({ statusCode: statusCode });
                        } else {
                            const error: any = new Error(`Failed to logout. Status: ${statusCode}`);
                            error.statusCode = statusCode;
                            reject(error);
                        }
                    });

                    response.on('error', (error) => {
                        console.error('Error reading logout response:', error);
                        reject(error);
                    });
                });

                request.on('error', (error) => {
                    console.error('Logout request error:', error);
                    reject(error);
                });

                request.end();

            } catch (error) {
                console.error('Error sending logout request:', error);
                reject(error);
            }
        });
    }
}