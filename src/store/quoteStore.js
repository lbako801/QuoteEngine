import { create } from 'zustand';

const useQuoteStore = create((set) => ({
    // Part data
    partData: {
        name: '',
        description: '',
        quantity: '',
        surfaceArea: ''
    },

    // Prep options
    prepOptions: {
        polishing: { checked: false, surfaceArea: '' },
        gritBlasting: { checked: false, surfaceArea: '' },
        masking: { checked: false, surfaceArea: '' }
    },

    // Racking dimensions
    rackingDimensions: {
        depth: '',
        width: '',
        height: ''
    },

    // Section states
    sectionStates: {
        part: true,
        prep: true,
        racking: true,
        quoteLines: true
    },

    // Actions
    setPartData: (field, value) => set((state) => ({
        partData: {
            ...state.partData,
            [field]: value
        }
    })),

    togglePrepOption: (option) => set((state) => ({
        prepOptions: {
            ...state.prepOptions,
            [option]: {
                ...state.prepOptions[option],
                checked: !state.prepOptions[option].checked
            }
        }
    })),

    setPrepSurfaceArea: (option, value) => set((state) => ({
        prepOptions: {
            ...state.prepOptions,
            [option]: {
                ...state.prepOptions[option],
                surfaceArea: value
            }
        }
    })),

    setRackingDimension: (dimension, value) => set((state) => ({
        rackingDimensions: {
            ...state.rackingDimensions,
            [dimension]: value
        }
    })),

    toggleSection: (section) => set((state) => ({
        sectionStates: {
            ...state.sectionStates,
            [section]: !state.sectionStates[section]
        }
    }))
}));

export default useQuoteStore; 