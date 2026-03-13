import axios from 'axios';

const API_URL = 'https://ppf-vehiculos-api.onrender.com/api/vehiculos';

export const obtenerVehiculos = async () => {
    const respuesta = await axios.get(API_URL);
    return respuesta.data;
};

export const crearVehiculo = async (vehiculo) => {
    const respuesta = await axios.post(API_URL, vehiculo);
    return respuesta.data;
};

export const actualizarVehiculo = async (id, vehiculo) => {
    const respuesta = await axios.put(`${API_URL}/${id}`, vehiculo);
    return respuesta.data;
};

export const eliminarVehiculo = async (id) => {
    const respuesta = await axios.delete(`${API_URL}/${id}`);
    return respuesta.data;
};