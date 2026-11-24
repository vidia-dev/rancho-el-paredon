# Rancho El Paredón — sitio web

Sitio de una sola página, sin servidor ni base de datos.
Para verlo en tu computadora: abre `index.html` con doble clic.
En vivo: https://vidia-dev.github.io/rancho-el-paredon/

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | **Todos los textos** y la estructura de las secciones. |
| `estilos.css` | Colores, tipografías, espaciados. |
| `script.js` | Menú, calendario, validaciones del formulario, galería. |
| `img/` | Las fotos. |

## Secciones del sitio

En `index.html` cada sección está marcada con un comentario grande, por ejemplo
`<!-- ===== NOSOTROS ===== -->`. Busca ese comentario para ubicarte rápido.

Portada · Puntos clave · Nosotros · Cabañas · Amenidades · Reservar ·
Estancias largas · Galería · Qué hacer cerca · Cómo llegar · Condiciones ·
Preguntas frecuentes · Contacto

## Cambiar textos

Abre `index.html` en IntelliJ. Todo lo que está entre `>` y `<` es texto visible:

    <h3>Cabaña familiar</h3>

Cambias solo `Cabaña familiar`, no las etiquetas de los lados.

## Cambiar precios — OJO

El precio de cada cabaña aparece en **tres lugares** y los tres tienen que
coincidir, o el calculador le cotizará mal al cliente:

1. Los puntos clave de arriba: `Desde $500 la noche`
2. La tarjeta de la cabaña: `<p class="price"><b>$500</b>`
3. El botón del calendario: `data-price="500"`

En ese mismo botón del calendario también está la capacidad:
`data-min="4" data-max="8"`.

## Cambiar el teléfono

Busca `527971218676` en `index.html` y en `script.js`. El `52` del inicio es el
código de México y no se quita.

## Cambiar o agregar fotos

Mete tu foto en `img/` y cambia el nombre del archivo en `index.html`.

**Antes de subirlas**, reduce las fotos a **1200 píxeles de ancho** y guárdalas
como JPG. Una foto de celular pesa 3 MB y hace lenta la página; reducida pesa
200 KB y se ve igual. Usa squoosh.app, es gratis.

### Fotos del interior

En la sección de galería hay seis recuadros punteados esperando foto. Busca
`class="soon"`. Para cada uno, cambia esta línea:

    <div class="soon">Jacuzzi</div>

por esta:

    <figure><img src="img/jacuzzi.jpg" alt="Jacuzzi de la cabaña familiar" loading="lazy"></figure>

Cuando ya tengas las seis, cambia el contenedor `<div class="soonwrap rv">` por
`<div class="grid rv">` para que se vean igual que la galería de arriba y se
puedan abrir en grande.

## Ajustes del calendario

En `script.js`, hasta arriba de la sección CALENDARIO:

    var MAX_NOCHES = 30;   // arriba de esto manda a cotizar estancia larga
    var MAX_MESES  = 18;   // hasta qué tan adelante se puede reservar

## Lo que valida el formulario

- Nombre con al menos 2 caracteres y que lleve letras
- Teléfono de exactamente 10 dígitos (solo deja escribir números)
- Correo opcional, pero si lo llenan debe tener formato válido
- Llegada y salida seleccionadas, y salida posterior a la llegada
- Huéspedes dentro de la capacidad de la cabaña elegida
- Casilla de condiciones marcada

Si algo falla, marca el campo en rojo y lleva el cursor al primer error.
Al pasar todo, abre WhatsApp con el mensaje armado.

## Publicar cambios

El sitio está en GitHub Pages desde la rama `main`. Cada vez que hagas
**commit and push**, el sitio se actualiza solo en uno o dos minutos.

Desde IntelliJ: `Ctrl+K` para commit, `Ctrl+Shift+K` para push.

## Pendientes

- Fotos del interior (recámara, baño, sala, jacuzzi, cocina, parrilla)
- Personalizar el texto de la sección "Nosotros" con la historia real
- Definir y escribir la política de cancelación
- Confirmar los lugares de "Qué hacer cerca" y agregar distancias reales
