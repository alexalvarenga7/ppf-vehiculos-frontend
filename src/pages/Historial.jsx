import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { obtenerRegistros } from '../services/registroService'
import { obtenerVehiculos } from '../services/vehiculoService'

function Historial() {
    const [registros, setRegistros] = useState([])
    const [vehiculos, setVehiculos] = useState([])
    const [filtros, setFiltros] = useState({
        fecha: null,
        vehiculo_id: null,
        motorista: ''
    })

    useEffect(() => {
        cargarVehiculos()
        cargarRegistros()
    }, [])

    const cargarVehiculos = async () => {
        try {
            const data = await obtenerVehiculos()
            setVehiculos([
                { label: 'Todos', value: null },
                ...data.map(v => ({ label: `${v.marca} ${v.modelo} - ${v.placa}`, value: v.id }))
            ])
        } catch (error) {
            console.error('Error al cargar vehículos:', error)
        }
    }

    const cargarRegistros = async (filtrosActivos = {}) => {
        try {
            const params = {}
            if (filtrosActivos.fecha) {
                params.fecha = filtrosActivos.fecha.toISOString().split('T')[0]
            }
            if (filtrosActivos.vehiculo_id) {
                params.vehiculo_id = filtrosActivos.vehiculo_id
            }
            if (filtrosActivos.motorista) {
                params.motorista = filtrosActivos.motorista
            }
            const data = await obtenerRegistros(params)
            setRegistros(data)
        } catch (error) {
            console.error('Error al cargar registros:', error)
        }
    }

    const aplicarFiltros = () => {
        cargarRegistros(filtros)
    }

    const limpiarFiltros = () => {
        setFiltros({ fecha: null, vehiculo_id: null, motorista: '' })
        cargarRegistros()
    }

    const tipoTemplate = (rowData) => (
        <span style={{
            background: rowData.tipo === 'entrada' ? '#a6e3a1' : '#f38ba8',
            color: '#1e1e2e',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontWeight: 'bold'
        }}>
            {rowData.tipo.toUpperCase()}
        </span>
    )

    return (
        <div>
            <h2 style={{ color: '#cdd6f4' }}>Historial de Entradas y Salidas</h2>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ color: '#cdd6f4', display: 'block' }}>Fecha</label>
                    <Calendar
                        value={filtros.fecha}
                        onChange={(e) => setFiltros({ ...filtros, fecha: e.value })}
                        dateFormat="dd/mm/yy"
                        placeholder="Filtrar por fecha"
                    />
                </div>
                <div>
                    <label style={{ color: '#cdd6f4', display: 'block' }}>Vehículo</label>
                    <Dropdown
                        value={filtros.vehiculo_id}
                        options={vehiculos}
                        onChange={(e) => setFiltros({ ...filtros, vehiculo_id: e.value })}
                        placeholder="Filtrar por vehículo"
                        style={{ minWidth: '200px' }}
                    />
                </div>
                <div>
                    <label style={{ color: '#cdd6f4', display: 'block' }}>Motorista</label>
                    <InputText
                        value={filtros.motorista}
                        onChange={(e) => setFiltros({ ...filtros, motorista: e.target.value })}
                        placeholder="Filtrar por motorista"
                    />
                </div>
                <Button label="Filtrar" icon="pi pi-search" onClick={aplicarFiltros} />
                <Button label="Limpiar" icon="pi pi-times" severity="secondary" onClick={limpiarFiltros} />
            </div>

            <DataTable value={registros} paginator rows={10} stripedRows>
                <Column field="placa" header="Placa" />
                <Column field="marca" header="Marca" />
                <Column field="modelo" header="Modelo" />
                <Column field="motorista" header="Motorista" />
                <Column body={tipoTemplate} header="Tipo" />
                <Column field="fecha" header="Fecha" body={(rowData) => rowData.fecha.split('T')[0]} />
                <Column field="hora" header="Hora" body={(rowData) => rowData.hora.substring(0, 5)} />
                <Column field="kilometraje" header="Kilometraje" />
            </DataTable>
        </div>
    )
}

export default Historial