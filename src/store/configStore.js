import { create } from 'zustand';
import defaultConfig from '../config/defaultConfig';

const useConfigStore = create((set) => ({
    config: defaultConfig,
    updateHourlyRate: (value) => set((state) => ({
        config: {
            ...state.config,
            laborRates: {
                ...state.config.laborRates,
                hourlyRate: parseFloat(value)
            }
        }
    })),
    updateProcessRate: (process, field, value) => set((state) => ({
        config: {
            ...state.config,
            laborRates: {
                ...state.config.laborRates,
                processes: {
                    ...state.config.laborRates.processes,
                    [process]: {
                        ...state.config.laborRates.processes[process],
                        [field]: parseFloat(value)
                    }
                }
            }
        }
    })),
    updateMaterialCost: (material, value) => set((state) => ({
        config: {
            ...state.config,
            materialCosts: {
                ...state.config.materialCosts,
                [material]: parseFloat(value)
            }
        }
    })),
    updateCalculationSetting: (setting, value) => set((state) => ({
        config: {
            ...state.config,
            calculations: {
                ...state.config.calculations,
                [setting]: parseFloat(value)
            }
        }
    })),
    resetToDefaults: () => set({ config: defaultConfig })
}));

export default useConfigStore; 