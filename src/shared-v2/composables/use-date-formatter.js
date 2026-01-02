/**
 * Composable para formateo de fechas.
 * Centraliza la lógica de transformación de fechas entre frontend y backend.
 */
export function useDateFormatter() {
  /**
   * Convierte una fecha del formato backend (yyyy-MM-dd) al formato de visualización (dd/mm/yyyy).
   * @param {string} backendDate - Fecha en formato yyyy-MM-dd
   * @returns {string} Fecha en formato dd/mm/yyyy o string vacío si no es válida
   */
  const formatFromBackend = (backendDate) => {
    if (!backendDate || backendDate.trim() === '') return ''
    
    try {
      const parts = backendDate.split('-')
      if (parts.length !== 3) return backendDate
      
      const [year, month, day] = parts
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    } catch (error) {
      console.error('Error al convertir fecha desde backend:', error)
      return backendDate
    }
  }

  /**
   * Convierte una fecha del formato de visualización (dd/mm/yyyy) o Date al formato backend (yyyy-MM-dd).
   * @param {string|Date} displayDate - Fecha en formato dd/mm/yyyy o objeto Date
   * @returns {string} Fecha en formato yyyy-MM-dd o string vacío si no es válida
   */
  const formatToBackend = (displayDate) => {
    if (!displayDate) return ''
    
    try {
      // Si es un objeto Date
      if (displayDate instanceof Date) {
        if (isNaN(displayDate.getTime())) return ''
        
        const year = displayDate.getFullYear()
        const month = String(displayDate.getMonth() + 1).padStart(2, '0')
        const day = String(displayDate.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      // Si es un string en formato dd/mm/yyyy
      if (typeof displayDate === 'string') {
        const parts = displayDate.split('/')
        if (parts.length !== 3) return displayDate
        
        const [day, month, year] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
      
      return ''
    } catch (error) {
      console.error('Error al convertir fecha para backend:', error)
      return ''
    }
  }

  /**
   * Convierte una fecha a formato legible en español.
   * @param {string|Date} date - Fecha a formatear
   * @returns {string} Fecha en formato "dd de mes de yyyy"
   */
  const formatToReadable = (date) => {
    if (!date) return ''
    
    try {
      let dateObj
      
      if (date instanceof Date) {
        dateObj = date
      } else if (typeof date === 'string') {
        // Si viene en formato dd/mm/yyyy
        if (date.includes('/')) {
          const [day, month, year] = date.split('/')
          dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        } else {
          dateObj = new Date(date)
        }
      }
      
      if (!dateObj || isNaN(dateObj.getTime())) return date
      
      const day = dateObj.getDate()
      const month = dateObj.toLocaleString('es-ES', { month: 'long' })
      const year = dateObj.getFullYear()
      
      return `${day} de ${month} de ${year}`
    } catch (error) {
      console.error('Error al formatear fecha legible:', error)
      return date
    }
  }

  /**
   * Parsea una fecha en formato dd/mm/yyyy a objeto Date.
   * @param {string} dateString - Fecha en formato dd/mm/yyyy
   * @returns {Date|null} Objeto Date o null si no es válida
   */
  const parseFromDisplay = (dateString) => {
    if (!dateString) return null
    
    try {
      const parts = dateString.split('/')
      if (parts.length !== 3) return null
      
      const [day, month, year] = parts
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    } catch (error) {
      console.error('Error al parsear fecha:', error)
      return null
    }
  }

  return {
    formatFromBackend,
    formatToBackend,
    formatToReadable,
    parseFromDisplay
  }
}
