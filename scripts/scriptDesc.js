document.addEventListener("DOMContentLoaded", function() {
    // Obtener los parámetros de la URL
    var urlParams = new URLSearchParams(window.location.search);
    // Verificar si existen parámetros en la URL
    if (urlParams.has('items') && urlParams.has('Comics')) {
        // Obtener el valor del parámetro 'items'
        var itemsEncoded = urlParams.get('items');
        var ComicsEncoded = urlParams.get('Comics');

        // Decodificar los valores
        var itemsDecoded = decodeURIComponent(itemsEncoded);
        var ComicsDecoded = decodeURIComponent(ComicsEncoded);

        // Convertir los datos decodificados de 'items' de cadena a objeto JavaScript
        var itemsObj = JSON.parse(itemsDecoded);
        var comicsObj = JSON.parse(ComicsDecoded);

        var contDesc = document.getElementById('contDesc');
        contDesc.innerHTML = `
        <div class="container-xl" style="text-align: center; margin-top: 5%; margin-bottom: 5%;">
            <div class="row featurette">
                <div class="col-md-5">
                    <img src="${itemsObj.image}" width="80%" style="margin-top: 20%">
                </div>
                <div class="col-md-7" style="text-align: center; margin-top: 4%">
                    <h2 class="featurette-heading fw-normal fs-1">${itemsObj.name}</h2>
                    <p class="lead">${itemsObj.description}</p>
                    <p>Algunos comics</p>
                    <div class="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-3" id="comicDiv"></div>
                    <div style="margin-top: 20px;">
                        <a href="${itemsObj.comicLinkURL}" target="_blank">
                            <button class="btn btn-lg btn-danger">Ver más comics</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
        console.log(comicsObj);

        comicsObj.forEach(comic => {
            var comicDiv = document.getElementById('comicDiv');
            comicDiv.innerHTML+=`
            <div class="col">
                    <a href="${comic.comicLinkURL}" target="_blank">
                      <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg" style="background-image: url('${comic.image}'); background-size: cover; background-repeat: no-repeat;">
                        <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                          <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold" style="font-size: 1vw; ">${comic.name}</h3>
                        </div>
                      </div>
                    </a>
                  </div>
                  `;
        });

    } else {
        console.log('No se encontraron parámetros en la URL.');
    }
});
