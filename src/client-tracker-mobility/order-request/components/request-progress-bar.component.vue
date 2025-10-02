<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'request-progress-bar',

  components: {
    Icon
  },

  props: {
    currentStep: {
      type: Number,
      default: 1
    },

    stepLabels: {
      type: Array,
      default: () => [
        { 
          label: 'Datos del solicitante', 
          icon: 'mdi:office-building-outline'
        },
        { 
          label: 'Datos del cliente', 
          icon: 'mdi:account-outline'
        },
        { 
          label: 'Documentación', 
          icon: 'mdi:file-document-outline'
        },
        { 
          label: 'Confirmación', 
          icon: 'mdi:check-circle-outline'
        }
      ]
    }
  },

  data () {
    return {

      content:{
        title: 'Solicitud de visita domiciliaria',
        parrafo: 'Complete los siguientes campos para continuar con su solicitud'
      }

    };
  },

  computed: {
    getStepState() {
      return (stepIndex) => {
        const stepNumber = stepIndex + 1;
        
        if (stepNumber < this.currentStep) {
          return 'completed'; // Finalizado
        } else if (stepNumber === this.currentStep) {
          return 'current'; // En curso
        } else {
          return 'pending'; // Pendiente
        }
      };
    },

    getStepClasses() {
      return (stepIndex) => {
        const state = this.getStepState(stepIndex);
        const baseClasses = 'step-circle flex justify-content-center align-items-center';
        
        switch (state) {
          case 'completed':
            return `${baseClasses} badge-primary text-white`;
          case 'current':
            return `${baseClasses} bg-blue-300 border-blue-300 text-white`;
          case 'pending':
          default:
            return `${baseClasses} bg-color-background border-2 border-blue-500 text-blue-500`;
        }
      };
    }
  },

  methods: {

  },

  created() {

  }
}

</script>

<template>

  <div class="flex justify-content-center pt-2 w-full">
    <div class="progress-bar-container text-center">
      <div class="tittle-progress-bar">
        <h1>{{ content.title }}</h1>
        <p>{{ content.parrafo }}</p>
      </div>

      <!-- Aquí va la barra de progreso con nodos circulares -->
      <div class="progress-bar flex justify-content-between align-items-center mt-4">
        <div 
          v-for="(item, index) in stepLabels" 
          :key="index" 
          :class="[
            'step flex flex-column align-items-center',
            { 'completed': getStepState(index) === 'completed' }
          ]"
        >
          <div 
            :class="getStepClasses(index)"
            :aria-label="`${item.label} - ${getStepState(index) === 'completed' ? 'Completado' : getStepState(index) === 'current' ? 'En curso' : 'Pendiente'}`"
            role="button"
            tabindex="0"
          >
            <Icon :icon="item.icon" class="step-icon" />
          </div>
          <div 
            :class="[
              'step-label mt-2 text-sm',
              {
                'text-blue-600 font-semibold': getStepState(index) === 'current',
                'text-blue-700': getStepState(index) === 'completed',
                'text-gray-500': getStepState(index) === 'pending'
              }
            ]"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

    </div>
  </div>



</template>

<style scoped>

.progress-bar {
  position: relative;
  width: 100%;
}

.step {
  position: relative;
  flex: 1;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-weight: bold;
  z-index: 2; /* Asegurar que los círculos estén por encima de las líneas */
  transition: all 0.3s ease;
  border: 3px solid;
  position: relative; /* Necesario para que z-index funcione */
}

/* Estados específicos para mejor accesibilidad */
.step-circle.bg-transparent {
  background-color: transparent !important;
}

.step-circle.border-blue-500 {
  border-color: #3b82f6;
}

/* Estilos para los íconos */
.step-icon {
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;
}

/* Asegurar que los íconos hereden el color del contenedor */
.step-circle .step-icon {
  color: inherit;
}

/* Hover effects para mejor interactividad */
.step-circle:hover {
  transform: scale(1.05);
  cursor: pointer;
}

/* Estados específicos de hover */
.step-circle.bg-blue-500:hover {
  background-color: #2563eb;
}

.step-circle.bg-transparent:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

/* Línea que conecta los nodos */
.step::after {
  content: "";
  position: absolute;
  top: 25px; /* mitad del círculo ajustado para el nuevo tamaño */
  left: 50%;
  width: 100%;
  height: 4px;
  background-color: var(--color-disabled); /* azul igual a los círculos */
  z-index: -1; /* Colocar la línea detrás de los nodos */
}

/* Quita la línea al último nodo */
.step:last-child::after {
  content: none;
}

/* Línea activa para pasos completados */
.step.completed::after {
  background-color: var(--color-primary); /* mantener el mismo azul */
}

/* Estilo para etiquetas según el estado */
.step-label {
  font-weight: 500;
  color: #6b7280;
  transition: color 0.3s ease;
}

/* Mejorar la accesibilidad y contraste */
.step-circle:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

</style>

