import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import './App.css'

type Posicion = {
  fila: number
  columna: number
}

type EstadoJuego = 'jugando' | 'terminado'

export default function App() {

  const [serpiente, setSerpiente] = useState<Posicion[]>([
    { fila: 3, columna: 3 },
    { fila: 3, columna: 2 },
    { fila: 3, columna: 1 }
  ])

  const [comida, setComida] = useState<Posicion>({
    fila: 1,
    columna: 5
  })

  const [estado, setEstado] = useState<EstadoJuego>('jugando')
  const obtenerClase = (fila: number, columna: number): string => {

    if (
      serpiente[0].fila === fila &&
      serpiente[0].columna === columna
    ) {
      return 'cabeza'
    }

    for (const parte of serpiente) {

      if (
        parte.fila === fila &&
        parte.columna === columna
      ) {
        return 'cuerpo'
      }
    }

    if (
      comida.fila === fila &&
      comida.columna === columna
    ) {
      return 'comida'
    }

    return ''
  }

  const nuevaComida = (nuevaSerpiente: Posicion[]): Posicion => {

    let posicion: Posicion = {
      fila: Math.floor(Math.random() * 8),
      columna: Math.floor(Math.random() * 8)
    }

    let ocupada = true

    while (ocupada) {
      ocupada = false

      for (const parte of nuevaSerpiente) {

        if (
          parte.fila === posicion.fila &&
          parte.columna === posicion.columna
        ) {
          ocupada = true
        }
      }

      if (ocupada) {

        posicion = {
          fila: Math.floor(Math.random() * 8),
          columna: Math.floor(Math.random() * 8)
        }
      }
    }
    return posicion
  }

  const manejarTecla = (evento: KeyboardEvent<HTMLDivElement>) => {

    if (estado === 'terminado') {
      return
    }

    let nuevaFila = serpiente[0].fila
    let nuevaColumna = serpiente[0].columna


    if (evento.key === 'ArrowUp') {
      console.log('arriba')
      nuevaFila = nuevaFila - 1
    }

    else if (evento.key === 'ArrowDown') {
      console.log('abajo')
      nuevaFila = nuevaFila + 1
    }

    else if (evento.key === 'ArrowLeft') {
      console.log('izquierda')
      nuevaColumna = nuevaColumna - 1
    }

    else if (evento.key === 'ArrowRight') {
      console.log('derecha')
      nuevaColumna = nuevaColumna + 1
    }

    else {
      return
    }

    const nuevaCabeza: Posicion = {
      fila: nuevaFila,
      columna: nuevaColumna
    }

    //si choca con los bordes
    if (
      nuevaCabeza.fila < 0 ||
      nuevaCabeza.fila > 7 ||
      nuevaCabeza.columna < 0 ||
      nuevaCabeza.columna > 7
    ) {

      setEstado('terminado')
      return
    }

    //si choca con su propio cuerpo
    for (const parte of serpiente) {

      if (
        parte.fila === nuevaCabeza.fila &&
        parte.columna === nuevaCabeza.columna
      ) {

        setEstado('terminado')
        return
      }
    }

    let nuevaSerpiente: Posicion[] = [
      nuevaCabeza,
      ...serpiente
    ]

    //cuando la serpiente si comio
    if (
      nuevaCabeza.fila === comida.fila &&
      nuevaCabeza.columna === comida.columna
    ) {

      console.log('ñam ñam')
      setComida(
        nuevaComida(nuevaSerpiente)
      )
    }
    // si la serpiente no come, se elimina su cola askj
    else {
      nuevaSerpiente = nuevaSerpiente.slice(
        0,
        nuevaSerpiente.length - 1
      )
    }
    setSerpiente(nuevaSerpiente)
    console.log(nuevaSerpiente)
  }
  return (

    <div
      className={estado === 'terminado' ? 'juego terminado' : 'juego'}
      tabIndex={0}
      onKeyDown={manejarTecla}
      autoFocus
    >
      <h1>Serpiente por turnos</h1>
      <p>Estado: {estado}</p>
      {estado === 'terminado' && (
        <h2>Juego terminado</h2>
      )}

      <table>
        <tbody>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((fila) => {

            return (

              <tr key={fila}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((columna) => {

                  return (
                    <td
                      key={columna}
                      className={obtenerClase(fila, columna)}>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}