import { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { obtenerVehiculos } from '../services/vehiculoService'
import { crearRegistro } from '../services/registroService'

function Registros() {
    const [vehiculos, setVehiculos] = useState([])
    const [form, setForm] = useState({
        vehiculo_id: null,
        motorista: '',
        tipo: null,
        fecha: null,
        hora: null,
        kilometraje: null
    })
    const [errores, setErrores] = useState({})
    const [exito, setExito] = useState(false)

    useEffect(() => {
        cargarVehiculos()
    }, [])

    const cargarVehiculos = async () => {
        try {
            const data = await obtenerVehiculos()
            setVehiculos(data.map(v => ({ label: `${v.marca} ${v.modelo} - ${v.placa}`, value: v.id })))
        } catch (error) {
            console.error('Error al cargar vehículos:', error)
        }
    }

    const tiposRegistro = [
        { label: 'Entrada', value: 'entrada' },
        { label: 'Salida', value: 'salida' }
    ]

    const validarForm = () => {
        const nuevosErrores = {}
        if (!form.vehiculo_id) nuevosErrores.vehiculo_id = 'Selecciona un vehículo'
        if (!form.motorista.trim()) nuevosErrores.motorista = 'El nombre del motorista es obligatorio'
        if (!form.tipo) nuevosErrores.tipo = 'Selecciona el tipo de registro'
        if (!form.fecha) nuevosErrores.fecha = 'La fecha es obligatoria'
        if (!form.hora) nuevosErrores.hora = 'La hora es obligatoria'
        if (!form.kilometraje) nuevosErrores.kilometraje = 'El kilometraje es obligatorio'
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const guardarRegistro = async () => {
        if (!validarForm()) return
        try {
            const fechaFormateada = form.fecha.toISOString().split('T')[0]
            const horaFormateada = form.hora.toTimeString().split(' ')[0]
            await crearRegistro({
                ...form,
                fecha: fechaFormateada,
                hora: horaFormateada
            })
            setExito(true)
            setForm({ vehiculo_id: null, motorista: '', tipo: null, fecha: null, hora: null, kilometraje: null })
            setTimeout(() => setExito(false), 3000)
        } catch (error) {
            console.error('Error al guardar registro:', error)
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#cdd6f4' }}>Registrar Entrada / Salida</h2>

            {exito && (
                <div style={{ background: '#a6e3a1', color: '#1e1e2e', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    ✅ Registro guardado correctamente
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ color: '#cdd6f4' }}>Vehículo *</label>
                    <Dropdown
                        value={form.vehiculo_id}
                        options={vehiculos}
                        onChange={(e) => setForm({ ...form, vehiculo_id: e.value })}
                        placeholder="Selecciona un vehículo"
                        style={{ width: '100%' }}
                        className={errores.vehiculo_id ? 'p-invalid' : ''}
                    />
                    {errores.vehiculo_id && <small style={{ color: 'red' }}>{errores.vehiculo_id}</small>}
                </div>

                <div>
                    <label style={{ color: '#cdd6f4' }}>Motorista *</label>
                    <InputText
                        value={form.motorista}
                        onChange={(e) => setForm({ ...form, motorista: e.target.value })}
                        style={{ width: '100%' }}
                        className={errores.motorista ? 'p-invalid' : ''}
                    />
                    {errores.motorista && <small style={{ color: 'red' }}>{errores.motorista}</small>}
                </div>

                <div>
                    <label style={{ color: '#cdd6f4' }}>Tipo *</label>
                    <Dropdown
                        value={form.tipo}
                        options={tiposRegistro}
                        onChange={(e) => setForm({ ...form, tipo: e.value })}
                        placeholder="Entrada o Salida"
                        style={{ width: '100%' }}
                        className={errores.tipo ? 'p-invalid' : ''}
                    />
                    {errores.tipo && <small style={{ color: 'red' }}>{errores.tipo}</small>}
                </div>

                <div>
                    <label style={{ color: '#cdd6f4' }}>Fecha *</label>
                    <Calendar
                        value={form.fecha}
                        onChange={(e) => setForm({ ...form, fecha: e.value })}
                        style={{ width: '100%' }}
                        className={errores.fecha ? 'p-invalid' : ''}
                        dateFormat="dd/mm/yy"
                    />
                    {errores.fecha && <small style={{ color: 'red' }}>{errores.fecha}</small>}
                </div>

                <div>
                    <label style={{ color: '#cdd6f4' }}>Hora *</label>
                    <Calendar
                        value={form.hora}
                        onChange={(e) => setForm({ ...form, hora: e.value })}
                        timeOnly
                        style={{ width: '100%' }}
                        className={errores.hora ? 'p-invalid' : ''}
                    />
                    {errores.hora && <small style={{ color: 'red' }}>{errores.hora}</small>}
                </div>

                <div>
                    <label style={{ color: '#cdd6f4' }}>Kilometraje *</label>
                    <InputNumber
                        value={form.kilometraje}
                        onValueChange={(e) => setForm({ ...form, kilometraje: e.value })}
                        style={{ width: '100%' }}
                        className={errores.kilometraje ? 'p-invalid' : ''}
                        min={0}
                    />
                    {errores.kilometraje && <small style={{ color: 'red' }}>{errores.kilometraje}</small>}
                </div>

                <Button label="Guardar Registro" icon="pi pi-save" onClick={guardarRegistro} />
            </div>
        </div>
    )
}

export default Registros