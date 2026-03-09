import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { obtenerVehiculos, crearVehiculo, actualizarVehiculo, eliminarVehiculo } from '../services/vehiculoService'

function Vehiculos() {
    const [vehiculos, setVehiculos] = useState([])
    const [dialogVisible, setDialogVisible] = useState(false)
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
    const [form, setForm] = useState({ marca: '', modelo: '', placa: '' })
    const [errores, setErrores] = useState({})

    useEffect(() => {
        cargarVehiculos()
    }, [])

    const cargarVehiculos = async () => {
        try {
            const data = await obtenerVehiculos()
            setVehiculos(data)
        } catch (error) {
            console.error('Error al cargar vehículos:', error)
        }
    }

    const abrirNuevo = () => {
        setForm({ marca: '', modelo: '', placa: '' })
        setVehiculoSeleccionado(null)
        setErrores({})
        setDialogVisible(true)
    }

    const abrirEditar = (vehiculo) => {
        setForm({ marca: vehiculo.marca, modelo: vehiculo.modelo, placa: vehiculo.placa })
        setVehiculoSeleccionado(vehiculo)
        setErrores({})
        setDialogVisible(true)
    }

    const validarForm = () => {
        const nuevosErrores = {}
        if (!form.marca.trim()) nuevosErrores.marca = 'La marca es obligatoria'
        if (!form.modelo.trim()) nuevosErrores.modelo = 'El modelo es obligatorio'
        if (!form.placa.trim()) nuevosErrores.placa = 'La placa es obligatoria'
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const guardarVehiculo = async () => {
        if (!validarForm()) return
        try {
            if (vehiculoSeleccionado) {
                await actualizarVehiculo(vehiculoSeleccionado.id, form)
            } else {
                await crearVehiculo(form)
            }
            setDialogVisible(false)
            cargarVehiculos()
        } catch (error) {
            console.error('Error al guardar vehículo:', error)
        }
    }

    const borrarVehiculo = async (id) => {
        if (confirm('¿Estás seguro de eliminar este vehículo?')) {
            try {
                await eliminarVehiculo(id)
                cargarVehiculos()
            } catch (error) {
                console.error('Error al eliminar vehículo:', error)
            }
        }
    }

    const accionesTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => abrirEditar(rowData)} />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => borrarVehiculo(rowData.id)} />
        </div>
    )

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ color: '#cdd6f4' }}>Vehículos Registrados</h2>
                <Button label="Nuevo Vehículo" icon="pi pi-plus" onClick={abrirNuevo} />
            </div>

            <DataTable value={vehiculos} paginator rows={10} stripedRows>
                <Column field="marca" header="Marca" />
                <Column field="modelo" header="Modelo" />
                <Column field="placa" header="Placa" />
                <Column body={accionesTemplate} header="Acciones" />
            </DataTable>

            <Dialog
                header={vehiculoSeleccionado ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                style={{ width: '400px' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                    <div>
                        <label style={{ color: '#cdd6f4' }}>Marca *</label>
                        <InputText
                            value={form.marca}
                            onChange={(e) => setForm({ ...form, marca: e.target.value })}
                            style={{ width: '100%' }}
                            className={errores.marca ? 'p-invalid' : ''}
                        />
                        {errores.marca && <small style={{ color: 'red' }}>{errores.marca}</small>}
                    </div>
                    <div>
                        <label style={{ color: '#cdd6f4' }}>Modelo *</label>
                        <InputText
                            value={form.modelo}
                            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                            style={{ width: '100%' }}
                            className={errores.modelo ? 'p-invalid' : ''}
                        />
                        {errores.modelo && <small style={{ color: 'red' }}>{errores.modelo}</small>}
                    </div>
                    <div>
                        <label style={{ color: '#cdd6f4' }}>Placa *</label>
                        <InputText
                            value={form.placa}
                            onChange={(e) => setForm({ ...form, placa: e.target.value })}
                            style={{ width: '100%' }}
                            className={errores.placa ? 'p-invalid' : ''}
                        />
                        {errores.placa && <small style={{ color: 'red' }}>{errores.placa}</small>}
                    </div>
                    <Button label="Guardar" icon="pi pi-save" onClick={guardarVehiculo} />
                </div>
            </Dialog>
        </div>
    )
}

export default Vehiculos