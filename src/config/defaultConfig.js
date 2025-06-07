const defaultConfig = {
    laborRates: {
        hourlyRate: 45.00,
        processes: {
            gritBlasting: {
                minutesPerSquareInch: 0.5
            },
            masking: {
                minutesPerSquareInch: 0.25,
                minutesPerHole: 0.5
            },
            polishing: {
                minutesPerSquareInch: 0.75
            }
        }
    },
    materialCosts: {
        gold: 0.15,
        silver: 0.05,
        nickel: 0.02,
        enp: 0.03
    },
    calculations: {
        rackEfficiency: 80,
        bufferTime: 15
    }
};

export default defaultConfig; 