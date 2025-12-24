# ARL Riesgos Profesionales - Plataforma de Afiliación

Plataforma web para la afiliación de trabajadores independientes a ARL SURA a través de un intermediario autorizado.

## Características

- ✅ Registro de datos personales completo
- ✅ Selección de nivel de riesgo (I-V)
- ✅ Selección de tiempo de cobertura (1, 3, 6 o 12 meses)
- ✅ Cálculo automático de precios con descuentos
- ✅ Simulación de pago con tarjeta o PSE
- ✅ Página de confirmación con espera de hasta 15 minutos
- ✅ Descarga de certificado y carnet de afiliación
- ✅ Link directo a ARL SURA para validación

## Tecnologías

- React 18
- Vite
- TailwindCSS
- React Router DOM
- Lucide React (iconos)

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── StepIndicator.jsx
├── pages/
│   ├── Home.jsx
│   ├── Registro.jsx
│   ├── SeleccionPlan.jsx
│   ├── Pago.jsx
│   └── Confirmacion.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Flujo de Usuario

1. **Inicio**: Página principal con información sobre la ARL
2. **Registro**: Formulario de datos personales
3. **Selección de Plan**: Elegir nivel de riesgo y tiempo de cobertura
4. **Pago**: Simular pago con tarjeta o PSE
5. **Confirmación**: Esperar documentos y descargarlos

## Notas

- Esta es una aplicación de demostración
- Los pagos son simulados
- Los documentos generados son ficticios
- En producción, se debe integrar con pasarela de pagos real y API de ARL SURA
