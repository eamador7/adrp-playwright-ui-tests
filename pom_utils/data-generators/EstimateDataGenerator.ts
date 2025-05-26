/**
 * Generator for estimate-related test data
 */
export class EstimateDataGenerator {
    /**
     * Generates a complete estimate with random data
     */
    static generateEstimate() {
        return {
            'vehicle': {
                'vehicleId': '58683',
                'year': '2020',
                'make': 'Mercedes Benz',
                'model': 'AMG GT53 4 Door (290 661)',
                'engine': 'L6-3.0L Turbo (256.930) Hybrid',
                'vin': 'WDB0J8DB2LF112233',
                'licensePlateNumber': 'LP-1234',
                'licensePlateState': 'CA',
                'mileage': 25000,
                'color': 'Red'
            },
            'estimate': {
                'estimateNumber': this.generateEstimateNumber(),
                'claimNumber': this.generateClaimNumber(),
                'gross': Math.floor(1000 + Math.random() * 5000),
                'dateCreated': this.generateFormattedDate(),
                'dateModified': this.generateFormattedDate(),
                'supplementNumber': `S${Math.floor(1 + Math.random() * 10)}`,
                'estimateStatus': 'TRUE',
                'lines': [
                    {
                        'lineNumber': '1',
                        'lineIndicator': 'E01',
                        'operation': 'OP11',
                        'lineDescription': 'Bumper cover w/park asst',
                        'partType': 'New',
                        'partDescription': `${Math.floor(1000000 + Math.random() * 9000000)}`,
                        'laborType': 'LAB',
                        'laborHours': (Math.random() * 10).toFixed(1)
                    }
                ]
            }
        };
    }

    /**
     * Generates formatted date string
     */
    private static generateFormattedDate(): string {
        const year = Math.floor(Math.random() * (new Date().getFullYear() - 1994 + 1)) + 1994;
        const month = Math.floor(Math.random() * 12) + 1;
        const daysInMonth = new Date(year, month, 0).getDate();
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        let hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${month}/${day}/${year} ${hours}:${formattedMinutes} ${ampm}`;
    }

    /**
     * Generates random estimate number
     */
    private static generateEstimateNumber(): string {
        return `${Math.floor(1000 + Math.random() * 9000)}`;
    }

    /**
     * Generates random claim number
     */
    private static generateClaimNumber(): string {
        return `CL-${Math.floor(1000000 + Math.random() * 9000000)}`;
    }

    /**
     * Generates random repair order ID
     */
    private static generateRepairOrderId(): string {
        return `${Math.floor(10000 + Math.random() * 90000)}`;
    }
} 