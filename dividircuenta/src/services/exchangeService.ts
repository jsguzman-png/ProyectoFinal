import axios from 'axios';

const API_KEY = '63b0ed0d89e537577d11bd24';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/HNL`;

export const obtenerTipoDeCambio = async (): Promise<number> => {
    const response = await axios.get(BASE_URL);
    // cuántos dólares vale 1 lempira
    return response.data.conversion_rates.USD;
};