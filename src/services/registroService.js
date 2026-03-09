import axios from 'axios';

const API_URL = 'http://localhost:3000/api/registros';

export const obtenerRegistros = async (filtros = {}) => {
    const respuesta = await axios.get(API_URL, { params: filtros });
    return respuesta.data;
};

export const crearRegistro = async (registro) => {
    const respuesta = await axios.post(API_URL, registro);
    return respuesta.data;
};