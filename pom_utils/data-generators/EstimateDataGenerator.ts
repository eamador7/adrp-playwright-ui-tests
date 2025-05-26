/**
 * Generator for estimate-related test data
 */
export class EstimateDataGenerator {
    private static readonly VALID_VINS: string[] = [
        "5XYK6CDF9RG214886", "5FNYF5H30NB022232", "5NMS23AD3KH108931", "1FD8X3G67MEC41231",
        "JF2SKAXC6MH569596", "KM8JFCA14NU054375", "5TDXBRCH6PS563169", "WBABB1303J8270859",
        "JTMRFREV0JJ718612", "SADCK2BV8HA092013", "3CZRZ1H52PM718024", "1FMCU0H62NUB91930",
        "WA19ABF46NA039942", "WDDHF5KB1EA882168", "7FARW2H82ME035033", "1HGCR3F83GA034277",
        "2T3RFREV6EW205727", "1GCHK23K87F531332", "4T1G11AK9NU713203", "KNDJP3A58F7796850",
        "KMHLS4AG6PU461616", "2HKRS6H95PH802175", "KNDJ33AU7P7189066", "1FMSK7KH9PGA99364",
        "1FTFW1EF6BFC79868", "4JGDA5JB5HA850722", "5TDJZRFH3HS449127", "3VWYT7AU9FM046594",
        "3GKALSEX4LL120490", "2T2GGCEZ3NC002742", "1GNSKHKC6JR213418", "JTEBU5JRXG5341129",
        "1GCHSBEA4K1359357", "5TFUY5F17BX201816", "4T1T11AKXNU648179", "5YJ3E1EA4PF453815",
        "1GCPYFED7MZ252075", "JM3KFBBM8K0677729", "WDDMH4EB8EJ183912", "3FMCR9B60PRE05810",
        "1GNSKSKD2RR176823", "KMHCX5LD1NU275599", "1FMHK7F88BGA94735", "W1Z40FHYXPT137171",
        "WBA4J3C53JBG96902", "5FNYF4H54CB503626", "1GKS2HKJ9KR259354", "1GCDT146358109039",
        "JTNKHMBX2L1068703", "1GYS4KKL9NR360445", "1HGCR2F56EA133673"
    ];

    private static readonly CAR_MAKES: string[] = [
        "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes Benz", "Audi", "Volkswagen", "Hyundai", "Kia"
    ];

    private static readonly CAR_MODELS: string[] = [
        "Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Minivan", "Convertible", "Sports Car"
    ];

    private static readonly ENGINE_TYPES: string[] = [
        "L4-2.0L Turbo", "V6-3.5L", "V8-5.0L", "L4-2.5L Hybrid", "Electric", "L6-3.0L Turbo Diesel"
    ];

    private static readonly CAR_COLORS: string[] = [
        "Red", "Blue", "Black", "White", "Silver", "Gray", "Green", "Yellow", "Orange", "Brown"
    ];

    private static readonly US_STATES: string[] = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA",
        "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
        "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    private static getRandomListItem<T>(array: T[]): T {
        if (!array || array.length === 0) {
            throw new Error("Input array cannot be null or empty.");
        }
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    private static generateRandomYear(startYear: number = 2000, endYear: number = new Date().getFullYear()): string {
        const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
        return year.toString();
    }

    private static generateRandomMileage(min: number = 1000, max: number = 150000): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private static generateRandomLicensePlate(): string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let plate = '';

        // Example format: LLLNNN
        for (let i = 0; i < 3; i++) {
            plate += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 3; i++) {
            plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return plate;
    }

    /**
     * Generates a complete estimate with random data
     */
    static generateEstimate() {
        return {
            'vehicle': {
                'vehicleId': '58683', // This remains static
                'year': this.generateRandomYear(),
                'make': this.getRandomListItem(this.CAR_MAKES),
                'model': this.getRandomListItem(this.CAR_MODELS),
                'engine': this.getRandomListItem(this.ENGINE_TYPES),
                'vin': this.getRandomListItem(this.VALID_VINS),
                'licensePlateNumber': this.generateRandomLicensePlate(),
                'licensePlateState': this.getRandomListItem(this.US_STATES),
                'mileage': this.generateRandomMileage(),
                'color': this.getRandomListItem(this.CAR_COLORS)
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