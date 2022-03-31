const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
     moneda: '',
     criptomoneda: ''
}

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
     resolve(criptomonedas);
});

window.onload = () =>{
     consultarCriptomonedas();

     formulario.addEventListener('submit', submitFormulario);
     criptomonedasSelect.addEventListener('change', leerValor);
     monedaSelect.addEventListener('change', leerValor);
};

async function consultarCriptomonedas(){
     const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

     try {
          const respuesta = await fetch(url);
          const resultado = await respuesta.json();
          const criptomonedas = await obtenerCriptomonedas(resultado.Data)
          selectCriptomonedas(criptomonedas);
     } catch (error) {
          console.log(error);
     }
};

function selectCriptomonedas(criptomonedas){
     criptomonedas.forEach(criptomoneda => {
          const {FullName, Name} = criptomoneda.CoinInfo;

          const option = document.createElement('option');
          option.value = Name;
          option.textContent = FullName;
          criptomonedasSelect.appendChild(option);

     })
};

function leerValor(e){
     objBusqueda[e.target.name] = e.target.value;
};

function submitFormulario(e){
     e.preventDefault();

     // Validar
     const { moneda, criptomoneda } = objBusqueda;
     
     if(moneda === '' || criptomoneda === ''){
          mostrarAlerta('Ambos campos son obligatorios');
          return;
     }

     // Consultar la API con los resultados
     consultarAPI();
};

function mostrarAlerta(msg){
     if(!document.querySelector('.error')){
          const divMensaje = document.createElement('div');
          divMensaje.classList.add('error');
          divMensaje.textContent = msg;
     
          formulario.appendChild(divMensaje);


          setTimeout(() => {
               divMensaje.remove();
          }, 3000);
     }
};

async function consultarAPI(){
     const {moneda, criptomoneda} = objBusqueda;
     url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

     mostrarSpinner();
     
     try {
          const respuesta = await fetch(url);
          const cotizacion = await respuesta.json();
          mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
     } catch (error) {
          console.log(error);
     }
     
};

function mostrarCotizacionHTML(cotizacion){
     limpiarHTML();
     const {PRICE, CHANGEPCT24HOUR, HIGHDAY, LOWDAY, LASTUPDATE} = cotizacion;

     const precio = document.createElement('p');
     precio.classList.add('precio');
     precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

     const precioAlto = document.createElement('p');
     precioAlto.innerHTML = `Precio mas alto del dia: <span>${HIGHDAY}</span>`;

     const precioBajo = document.createElement('p');
     precioBajo.innerHTML = `Precio mas bajo del dia: <span>${LOWDAY}</span>`;

     const ultimasHoras = document.createElement('p');
     ultimasHoras.innerHTML = `Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

     const ultimaActualizacion = document.createElement('p');
     ultimaActualizacion.innerHTML = `Ultima actualizacion: <span>${LASTUPDATE}%</span>`;
     
     resultado.appendChild(precio);
     resultado.appendChild(precioAlto);
     resultado.appendChild(precioBajo);
     resultado.appendChild(ultimasHoras);
     resultado.appendChild(ultimaActualizacion);

};

function limpiarHTML(){
     while(resultado.firstChild){
          resultado.removeChild(resultado.firstChild)
     }
}

function mostrarSpinner(){
     limpiarHTML();
     const spinner = document.createElement('div');
     spinner.classList.add('spinner');

     spinner.innerHTML = `
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
     `;

     resultado.appendChild(spinner)
}