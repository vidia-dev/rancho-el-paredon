# Rancho El Paredón — sitio web

Sitio de una sola página. No necesita servidor, base de datos ni instalar nada.
Para verlo: abre `index.html` con doble clic y se abre en tu navegador.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | **Todos los textos.** Aquí cambias precios, descripciones y preguntas frecuentes. |
| `estilos.css` | Colores, tipografías, espaciados. |
| `script.js` | El calendario, la galería y las animaciones. |
| `img/` | Las fotos. |

## Cambiar textos

Abre `index.html` con cualquier editor de texto (el Bloc de notas sirve; mejor si
descargas **Visual Studio Code**, es gratis). Busca el texto que quieres cambiar
y escríbelo distinto. Guarda y recarga el navegador.

Todo lo que está entre `>` y `<` es texto visible. Por ejemplo:

    <h3>Cabaña familiar</h3>

Cambias solo `Cabaña familiar`, no las etiquetas de los lados.

## Cambiar precios

Los precios están en **tres lugares** y los tres tienen que coincidir:

1. En la tarjeta de cada cabaña, busca `<p class="price"><b>$500</b>`
2. En los botones del calendario, busca `data-price="500"`
3. En el texto de los puntos clave arriba: `Desde $500 la noche`

## Cambiar o agregar fotos

Mete tu foto en la carpeta `img/` y en `index.html` cambia el nombre del archivo.
Por ejemplo, para la foto principal busca:

    <img class="hero-img" src="img/fachada-jardin.jpg"

y cambia `fachada-jardin.jpg` por el nombre de tu archivo.

**Importante:** antes de subirlas, reduce las fotos a **1200 píxeles de ancho**
y guárdalas como JPG. Una foto de celular pesa 3 MB y hace que la página tarde
en abrir; reducida pesa 200 KB y se ve igual. Puedes usar squoosh.app (gratis).

### Fotos del interior

En la sección "Por dentro" hay seis recuadros punteados esperando foto. Busca
`class="soon"` en `index.html`. Cuando tengas la foto, cambia esta línea:

    <div class="soon">Jacuzzi</div>

por esta:

    <figure><img src="img/jacuzzi.jpg" alt="Jacuzzi de la cabaña familiar" loading="lazy"></figure>

Y cambia el contenedor `<div class="soonwrap rv">` por `<div class="grid rv">`
cuando ya tengas todas, para que se vean igual que la galería de arriba.

## Publicar en internet con tu propio dominio

La opción más fácil y gratuita:

1. Entra a **netlify.com** y crea una cuenta.
2. Busca la opción de arrastrar y soltar ("Deploy manually" o "Drag and drop").
3. Arrastra la carpeta completa `rancho-el-paredon`.
4. Te da un enlace tipo `rancho-paredon.netlify.app` al instante.

Para tener `ranchoelparedon.com`, compra el dominio en Namecheap o GoDaddy
(entre 200 y 400 pesos al año) y conéctalo desde la configuración de Netlify.

Alternativa si prefieres GitHub: crea un repositorio, sube estos archivos y
activa **GitHub Pages** en Settings → Pages.

## Antes de publicar, revisa

- Que el teléfono esté bien en todos lados: busca `527971218676` en `index.html`.
  El `52` del inicio es el código de México, no lo quites.
- Que los precios coincidan en los tres lugares.
- Ábrela en tu celular y en una computadora.

## Notas

- El calendario **cotiza**, no bloquea fechas ocupadas. La disponibilidad la
  confirmas tú por WhatsApp.
- Las tipografías se cargan desde Google Fonts, así que la página necesita
  internet para verse con el diseño correcto.
