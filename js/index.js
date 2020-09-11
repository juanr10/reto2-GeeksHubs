/**
 * @name: Showcase Market.
 * @author: Juan Argudo.
 * @version: v1-> 11/09/2020.
*/

/**
 * @name:Producto.
 * @description:Clase producto.
 * @prop:id, nombre, tipo, imgUrl, descripcion, precio.
 */
class Producto {
    constructor(id, nombre, tipo, imgUrl, descripcion, precio) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.imgUrl = imgUrl;
        this.descripcion = descripcion;
        this.precio = precio;
    }
}

/**
 * @name:loadData.
 * @description:carga datos de la aplicación, en este caso productos.
 * @param: nada.
 */
const loadData = () => {
    const producto1 = new Producto(1, 'Manzana (roja)', 'Fruta', 'css/imagenes/manzana.jpg', 'Bolsa (1Kg). Manzanas rojas de calidad obtenidas de los mejores huertos de "Huerto del príncipe".', 4.94);
    const producto2 = new Producto(2, 'Naranja', 'Fruta', 'css/imagenes/naranja.jpg', 'Bolsa (1Kg). Naranjas frescas de calidad excelente obtenidas de los mejores huertos de "Granja Schrute".', 3.82);
    const producto3 = new Producto(3, 'Sandía', 'Fruta', 'css/imagenes/sandia.jpg', 'Bolsa (1Kg). Sandías frescas de calidad importadas de los mejores huertos de "Granja Schrute."', 4.13);
    const producto4 = new Producto(4, 'Leche (entera)', 'Lácteos', 'css/imagenes/leche.jpg', 'Pack 3 botellas biodegradables (1L). Leche entera elaborada con los mejores recursos de la "Granja Schrute."', 3.55);
    const producto5 = new Producto(5, 'Huevos (L)', 'Huevos', 'css/imagenes/huevos.jpg', 'Pack de 6 unidades. Huevos frescos de calidad excelente exportados directamente de la "Granja Schrute".', 4.68);
    const producto6 = new Producto(6, 'Patatas', 'Tubérculos', 'css/imagenes/patatas.jpg', 'Bolsa (1Kg). Patatas cultivadas y cuidadas de "Huerto del príncipe".', 6.73);

    const products = [producto1, producto5, producto6, producto4, producto2, producto3];
    printProducts(products);
}

/**
 * @name:printProducts.
 * @description: imprime datos de cada producto en forma de card (bootstrap).
 * @param: array de productos.
 */
const printProducts = (products) => {
    document.querySelector('div.deck').innerHTML='';

    for (const product of products) {
        document.querySelector('div.deck').innerHTML+=
        `   
            <div class="col-12 mb-4" draggable="true" ondragstart=onDragStart(event); id="${product.id}">
                <div class="card w-100 h-100 border-0">
                    <h6 class="card-header card-subtitle text-center pt-3 mb-2 text-muted">${product.tipo}</h6>
                    <h5 class="card-title text-center pt-2">${product.nombre}</h5>
                    <img src="${product.imgUrl}" class="card-img-top" alt="product-image">
                    <div class="card-body">
                        <p class="card-text text-justify">${product.descripcion}</p>  
                    </div>
                    <div class="card-footer">
                        <h5 class="card-text precio text-right">${product.precio}€</h5>
                    </div>
                </div>
            </div>
        `
    } 
}

/**
 * @name:printTotal.
 * @description: imprime el precio total de la suma de todos los productos (fijado en 2 decimales).
 * @param: precio (ya en formato float).
 */
const printTotal = (precio) => {
    const total = (parseFloat(document.getElementById('total').innerHTML.slice(7, -1)) + precio).toFixed(2);
    document.querySelector('.total').innerHTML=`Total: ${total}€`;

    //Actualiza clase del botón
    botonCompra();
}

/**
 * @name:deleteProduct.
 * @description:borra un producto de la lista del carrito y actualiza el total.
 * @param:id de producto a borrar.
 */
const deleteProduct = (idProductoEnCarrito, precio) => {
    const producto = document.getElementById(idProductoEnCarrito);
    const padre = producto.parentNode;
    padre.removeChild(producto);
    printTotal(-precio);

    //Actualiza clase del botón
    botonCompra();
}

/**
 * @name:botonCompra.
 * @description: comprueba el numero de elementos en el carrito y añade o quita la clase 'disabled' del botón de compra.
 * @param: nada
 */
const botonCompra = () => {
    const boton = document.getElementById('boton-compra');
    const carrito = document.getElementById("carrito-lista");

    if(carrito.children.length==0){
        boton.classList.add("disabled");
    }else{
        boton.classList.remove("disabled");
    }
}

/* Drag & Drop 
=================================================  */
/**
 * @name:onDragStart
 * @description:Gestiona las acciones cuando el elemento comienza a ser arrastrado.
 * @param:event.
 */
const onDragStart = (event) => {
    //Reiniciar dataTransfer
    event.dataTransfer.clearData();

    //Pasando id del producto que esta siendo arrastrado
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.dropEffect = "move";
}

/**
 * @name:onDragOver.
 * @description:Gestiona las acciones cuando el elemento está siendo arrastrado.
 * @param:event.
 */
const onDragOver = (event) => {
    if (event.preventDefault) {
        event.preventDefault(); //Necesario para que el navegador permita arrastrar
    }

    event.dataTransfer.dropEffect = 'copy';
    return false;
} 

/**
 * @name:onDrop.
 * @description:Gestiona las acciones cuando el elemento arrastrado es soltado.
 * @param:event.
 */
const onDrop = (event) => {
    event.preventDefault();
    if (event.stopPropagation) {
        event.stopPropagation(); //Evita redirección del navegador al soltar el elemento arrastrado
    }

    //Recibiendo id del producto arrastrado
    const id = event.dataTransfer.getData('text');

    //Accediento al card del producto
    const containerProducto = document.getElementById(id);
    const producto = containerProducto.firstElementChild;
    //Accediendo a los elementos hijo para conseguir su contenido HTML
    const nombre = producto.childNodes[3].innerHTML;
    const precioTexto = producto.childNodes[9].lastElementChild.innerHTML;
    const precio = parseFloat(precioTexto.slice(0, -1));

    //Fragmento HTML con información del producto, se establece nuevo id en caso de querer eliminar el producto del carrito
    const formatoHtml = `
        <li class="list-group-item d-flex justify-content-between" id="productoEnCarrito${id}">
            <span class="w-50">${nombre}</span>
            <button class="btn btn-danger badge" onclick=deleteProduct("productoEnCarrito${id}",${precio})>X</button>
            <span>${precioTexto}</span>
        </li>
    `;
    
    //Definiendo la zona donde el producto será soltado
    const dropzone = document.getElementById('carrito-lista');
    
    //Añadiendo informacion del producto arrastrado
    dropzone.insertAdjacentHTML('beforeend', formatoHtml);

    //Modificando el total
    printTotal(precio);

    return false;
}

