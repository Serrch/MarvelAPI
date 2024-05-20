/* Links comics */
const LinkApiPrivate = "https://gateway.marvel.com:443/v1/public/characters?apikey=f6c26b8808af38b036bd2893044deee75ae7df0c";
const LinkApiPublic = "https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=ca1c2b6e8c6bf691ac82e03e1bf9574d&hash=0f13cd08901e3bd3c1f9fcef8b52d0f7";

/*const LinkApiComics="https://gateway.marvel.com:443/v1/public/characters?comics=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&orderBy=name&ts=1&apikey=ca1c2b6e8c6bf691ac82e03e1bf9574d&hash=0f13cd08901e3bd3c1f9fcef8b52d0f7"*/
const LinkApiComics = `https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&offset=${generarNumeroAleatorio()}&ts=1&apikey=ca1c2b6e8c6bf691ac82e03e1bf9574d&hash=0f13cd08901e3bd3c1f9fcef8b52d0f7`;
const apikey = "ca1c2b6e8c6bf691ac82e03e1bf9574d&hash=0f13cd08901e3bd3c1f9fcef8b52d0f7";

/* Variables idk */
let arrComics = [];
const contComic = document.getElementById("contComic");

function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 300) + 1;
}

const marvel = {
    render: () => {
        ImprimirComics();
    }
};
marvel.render();

/* Obtiene todos los comics */
async function getComic() {
    try {
        const response = await fetch(LinkApiComics);
        if (response.status === 404) {
            console.log(response.status);
            appendAlert('Comics not found', 'warning');
            return;
        } else {
            return await response.json();
        }
    } catch (err) {
        appendAlert(err, 'danger');
        console.log(err);
    }
}

/* Extrae info de los comics */
async function ExtraerData() {
    const comicIdSet = new Set();
    try {
        const ComicData = await getComic();
        /* Extraer info */
        if (ComicData) {
            for (let i = 0; i < ComicData.data.results.length; i++) {
                const comic = ComicData.data.results[i];
                const { id, title, description, thumbnail, urls } = comic;
                const image = thumbnail.path + '.' + thumbnail.extension;

                if (comicIdSet.has(id)) {
                    continue; // Saltar si el cómic ya está en el conjunto
                }

                comicIdSet.add(id); // Agregar el ID al conjunto

                let comicLinkURL = "";
                if (urls && urls.length > 0) {
                    const comicLink = urls.find(url => url.type === "detail");
                    if (comicLink) {
                        comicLinkURL = comicLink.url;
                    }
                }

                const infoComic = {
                    id: id,
                    title: title,
                    description: description || `${title} does not have description`,
                    image: image,
                    comicLinkURL: comicLinkURL
                };

                arrComics.push(infoComic);
                console.log(infoComic);
            }

        } else {
            console.log("No se encontraron datos de los cómics.");
        }
    } catch (error) {
        console.error("Ocurrió un error en la obtención de datos:", error);
    }
}

/* Imprime todos los comics */
async function ImprimirComics() {
    await ExtraerData();
    contComic.innerHTML = '';
    arrComics.forEach(infoComic => {
        const divComic = document.createElement('div');
        divComic.classList.add('comic', 'col-md-4', 'col-6');
        divComic.innerHTML = `
        <div class="card">
            <img class="card-img-top img-fit" src="${infoComic.image}">
            <div class="card-body">
                <h5 class="card-title">${infoComic.title}</h5>
                <p class="card-text">
                    ${infoComic.description}
                </p>
            </div>
        </div>
        `;
        contComic.appendChild(divComic);
        divComic.addEventListener('click', function () {
            const comicLinkURL = infoComic.comicLinkURL;
            if (comicLinkURL) {
                window.open(comicLinkURL, '_blank');
            } else {
                console.log('No hay enlace de cómic disponible para este cómic.');
            }
        });
    });
}

/* Metodo alerta */
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    liveAlertPlaceholder.innerHTML = "";
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholder.append(wrapper);
    setTimeout(() => {
        wrapper.remove();
    }, 3000);
};

/* Busca comics */
const campoBusqueda = document.getElementById('floatingInput');
campoBusqueda.addEventListener('input', async () => {
    const valorBusqueda = campoBusqueda.value.trim().toLowerCase();
    contComic.innerHTML = '';
    if (valorBusqueda === '') {
        contComic.innerHTML = '';
        ImprimirComics();
    } else {
        try {
            const response = await fetch(`https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&titleStartsWith=${valorBusqueda}&ts=1&apikey=${apikey}`);
            const data = await response.json();

            // Verificar si se encontraron resultados
            if (data.data && data.data.results && data.data.results.length > 0) {
                const searchComicIdSet = new Set(); // Conjunto para IDs únicos
                // Imprimir los cómics encontrados
                data.data.results.forEach(comic => {
                    if (searchComicIdSet.has(comic.id)) {
                        return; // Saltar si el cómic ya está en el conjunto
                    }

                    searchComicIdSet.add(comic.id); // Agregar el ID al conjunto

                    const divComic = document.createElement('div');
                    divComic.classList.add('comic', 'col-md-4', 'col-6');

                    const { title, description, thumbnail, urls } = comic;
                    const image = `${thumbnail.path}.${thumbnail.extension}`;

                    let wikiLinkURL = "";
                    if (urls && urls.length > 0) {
                        const wikiLink = urls.find(url => url.type === "detail");
                        if (wikiLink) {
                            wikiLinkURL = wikiLink.url;
                        }
                    }

                    divComic.innerHTML = `
                    <div class="card">
                        <img class="card-img-top img-fit" src="${image}">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">
                                ${description || `${title} does not have description`}
                            </p>
                        </div>
                    </div>
                    `;
                    contComic.appendChild(divComic);

                    divComic.addEventListener('click', function () {
                        if (wikiLinkURL) {
                            window.open(wikiLinkURL, '_blank');
                        } else {
                            console.log('No hay enlace de la wiki disponible para este cómic.');
                        }
                    });
                });
            } else {
                contComic.innerHTML = '<p>No se encontraron resultados</p>';
            }
        } catch (error) {
            console.error('Error al buscar cómics:', error);
            appendAlert('Error al buscar cómics', 'danger');
        }
    }
});
