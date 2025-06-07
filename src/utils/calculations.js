export const calculateLaborTimes = (partData, prepOptions, config) => {
    const results = {
        gritBlasting: { minutesPerPart: 0, minutesPerQty: 0, costPerPart: 0, costPerQty: 0 },
        masking: { minutesPerPart: 0, minutesPerQty: 0, costPerPart: 0, costPerQty: 0 },
        polishing: { minutesPerPart: 0, minutesPerQty: 0, costPerPart: 0, costPerQty: 0 }
    };

    // Calculate grit blasting times and costs
    if (prepOptions.gritBlasting.checked && prepOptions.gritBlasting.surfaceArea > 0) {
        const minutesPerPart = prepOptions.gritBlasting.surfaceArea * config.laborRates.processes.gritBlasting.minutesPerSquareInch;
        const minutesPerQty = minutesPerPart * partData.quantity;
        const costPerPart = (minutesPerPart / 60) * config.laborRates.hourlyRate;
        const costPerQty = costPerPart * partData.quantity;

        results.gritBlasting = {
            minutesPerPart,
            minutesPerQty,
            costPerPart,
            costPerQty
        };
    }

    // Calculate masking times and costs
    if (prepOptions.masking.checked) {
        let minutesPerPart = 0;
        
        // Add surface area time
        if (prepOptions.masking.surfaceArea > 0) {
            minutesPerPart += prepOptions.masking.surfaceArea * config.laborRates.processes.masking.minutesPerSquareInch;
        }
        
        // Add holes time
        if (prepOptions.masking.holesCount > 0) {
            minutesPerPart += prepOptions.masking.holesCount * config.laborRates.processes.masking.minutesPerHole;
        }

        const minutesPerQty = minutesPerPart * partData.quantity;
        const costPerPart = (minutesPerPart / 60) * config.laborRates.hourlyRate;
        const costPerQty = costPerPart * partData.quantity;

        results.masking = {
            minutesPerPart,
            minutesPerQty,
            costPerPart,
            costPerQty
        };
    }

    // Calculate polishing times and costs
    if (prepOptions.polishing.checked && prepOptions.polishing.surfaceArea > 0) {
        const minutesPerPart = prepOptions.polishing.surfaceArea * config.laborRates.processes.polishing.minutesPerSquareInch;
        const minutesPerQty = minutesPerPart * partData.quantity;
        const costPerPart = (minutesPerPart / 60) * config.laborRates.hourlyRate;
        const costPerQty = costPerPart * partData.quantity;

        results.polishing = {
            minutesPerPart,
            minutesPerQty,
            costPerPart,
            costPerQty
        };
    }

    return results;
};

export const calculateTotals = (laborResults) => {
    const totals = {
        minutesPerPart: 0,
        minutesPerQty: 0,
        costPerPart: 0,
        costPerQty: 0
    };

    Object.values(laborResults).forEach(result => {
        totals.minutesPerPart += result.minutesPerPart;
        totals.minutesPerQty += result.minutesPerQty;
        totals.costPerPart += result.costPerPart;
        totals.costPerQty += result.costPerQty;
    });

    return totals;
}; 