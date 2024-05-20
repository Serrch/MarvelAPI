/* Links personajes */
const LinkApiPrivate = "https://gateway.marvel.com:443/v1/public/characters?apikey=f6c26b8808af38b036bd2893044deee75ae7df0c";
const LinkApiPublic = "https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=ca1c2b6e8c6bf691ac82e03e1bf9574d&hash=0f13cd08901e3bd3c1f9fcef8b52d0f7";

const LinkApiPersonajes = `https://gateway.marvel.com:443/v1/public/characters?comics=1%2C${a=generarNumeroAleatorio()}%2C${a=generarNumeroAleatorio()}%2C${a=generarNumeroAleatorio()}%2C${a=generarNumeroAleatorio()}%2C${a=generarNumeroAleatorio()}%2C${b=generarNumeroAleatorio()}%2C${c=generarNumeroAleatorio()}&orderBy=name&ts=1&apikey=ca1c2b6e8c6bf691ac82e03e1bf9574d&hash=0f13cd08901e3bd3c1f9fcef8b52d0f7`;
const hash = "0f13cd08901e3bd3c1f9fcef8b52d0f7";

const cLink = "http://gateway.marvel.com/v1/public/comics/41113?ts=1&apikey=ca1c2b6e8c6bf691ac82e03e1bf9574d&hash=0f13cd08901e3bd3c1f9fcef8b52d0f7";
const apikey = "ca1c2b6e8c6bf691ac82e03e1bf9574d&hash=0f13cd08901e3bd3c1f9fcef8b52d0f7";


/* Variables idk */
const btnBuscar = document.getElementById("buscarBtn");
let arrPersonajes = [];
let arrComics = [];
const contPersonajes = document.getElementById("contPersonajes");    

function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 300) + 1;
}

const marvel = {
    render: () => {
        ImprimirPersonajes();
    }
};
marvel.render();

/* Obtiene todos los personajes */
async function getPersonajes() {
    try {
        const response = await fetch(LinkApiPersonajes);
        if (response.status === 404) {
            console.log(response.status);
            appendAlert('Heroes not found', 'warning');
            return;
        } else {
            return await response.json();
        }
    } catch (err) {
        appendAlert(err, 'danger');
        console.log(err);
    }
}

/* Extraer info PERSONAJES */
async function ExtraerData() {
    const idSet = new Set();
    try {
        const PersonajeData = await getPersonajes();
        /* Extraer info */
        if (PersonajeData) {
            for (let i = 0; i < PersonajeData.data.results.length; i++) {
                const personaje = PersonajeData.data.results[i];
                const { id, name, description, thumbnail, urls } = personaje;
                const image = thumbnail.path + '.' + thumbnail.extension;

                if (idSet.has(id)) {
                    continue; // Saltar si el personaje ya está en el conjunto
                }

                idSet.add(id); // Agregar el ID al conjunto

                let comicLinkURL = "";
                if (urls && urls.length > 0) {
                    const comicLink = urls.find(url => url.type === "comiclink");
                    if (comicLink) {
                        comicLinkURL = comicLink.url;
                    }
                }

                const infoPersonaje = {
                    id: id,
                    name: name,
                    description: description || `${name} does not have description`,
                    image: image,
                    comicLinkURL: comicLinkURL
                };
                arrPersonajes.push(infoPersonaje);
                console.log(infoPersonaje);
            }
        } else {
            console.log("No se encontraron datos de personajes.");
        }
    } catch (error) {
        console.error("Ocurrió un error en la obtención de datos:", error); 
    }
}

async function getComics(id) {
    try {
        const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${id}/comics?format=comic&formatType=comic&noVariants=true&ts=1&apikey=${apikey}`);
        if (response.status === 404) {
            console.log(response.status);
            appendAlert('Heroes not found', 'warning');
            return;
        } else {
            return await response.json();
        }
    } catch (err) {
        appendAlert(err, 'danger');
        console.log(err);
    }
}

/* Extraer info COMICS */
async function ExtraerDataComics(id, name) {
    try {
        const comicData = await getComics(id);

        for (let i = 0; i < 5; i++) {
            const comic = comicData.data.results[i];
            const { id, title, description, thumbnail, urls } = comic;
            const image = thumbnail.path + '.' + thumbnail.extension;

            let comicLinkURL = "";
            if (urls && urls.length > 0) {
                const comicLink = urls.find(url => url.type === "detail");
                if (comicLink) {
                    comicLinkURL = comicLink.url;
                }
            }

            const infoComic = {
                id: id,
                name: title,
                description: description,
                image: image,
                comicLinkURL: comicLinkURL
            };
            arrComics.push(infoComic);
            console.log(`----COMIC DE ${name} ----`);
            console.log(infoComic);
        }
    } catch (error) {
        console.error("Ocurrió un error en la obtención de datos:", error); 
    }
}

async function ImprimirPersonajes() {
    await ExtraerData();
    contPersonajes.innerHTML = "";
    arrPersonajes.forEach(infoPersonaje => {
        const divPersonaje = document.createElement('div');
        divPersonaje.classList.add('col-md-4', 'col-6');

        divPersonaje.dataset.comicLinkURL = infoPersonaje.comicLinkURL;

        divPersonaje.innerHTML = `
        <div class="card">
            <img class="card-img-top img-fit" src="${infoPersonaje.image}">
            <div class="card-body">
                <h5 class="card-title">${infoPersonaje.name}</h5>
                <p class="card-text">
                    ${infoPersonaje.description}
                </p>
            </div>
        </div>
        `;

        contPersonajes.appendChild(divPersonaje);

        divPersonaje.addEventListener('click', function () {
            const comicLinkURL = this.dataset.comicLinkURL;
            if (comicLinkURL) {
                window.open(comicLinkURL, '_blank');
            } else {
                console.log('No hay enlace de cómic disponible para este personaje.');
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

const campoBusqueda = document.getElementById('floatingInput');
campoBusqueda.addEventListener('input', async () => {
    const valorBusqueda = campoBusqueda.value.trim().toLowerCase();
    contPersonajes.innerHTML = '';
    if (valorBusqueda === '') {
        contPersonajes.innerHTML = '';
        ImprimirPersonajes();
    } else {
        try {
            const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${valorBusqueda}&orderBy=name&ts=1&apikey=${apikey}`);
            const data = await response.json();

            // Verificar si se encontraron resultados
            if (data.data && data.data.results && data.data.results.length > 0) {
                const searchIdSet = new Set(); // Conjunto para IDs únicos
                // Imprimir los personajes encontrados
                data.data.results.forEach(personaje => {
                    if (searchIdSet.has(personaje.id)) {
                        return; 
                    }

                    searchIdSet.add(personaje.id); // Agregar el ID al conjunto
                    const divPersonaje = document.createElement('div');
                    divPersonaje.classList.add('personaje');

                    const { name, description, thumbnail, urls } = personaje;
                    const image = `${thumbnail.path}.${thumbnail.extension}`;

                    divPersonaje.classList.add('col-md-4', 'col-6');

                    let wikiLinkURL = "";
                    if (urls && urls.length > 0) {
                        const wikiLink = urls.find(url => url.type === "comiclink");
                        if (wikiLink) {
                            wikiLinkURL = wikiLink.url;
                        }
                    }

                    divPersonaje.innerHTML = `
                    <div class="card">
                        <img class="card-img-top img-fit" src="${image}">
                        <div class="card-body">
                            <h5 class="card-title">${name}</h5>
                            <p class="card-text">
                                ${description || `${name} does not have description`}
                            </p>
                        </div>
                    </div>
                    `;

                    contPersonajes.appendChild(divPersonaje);

                    divPersonaje.addEventListener('click', function () {
                        if (wikiLinkURL) {
                            window.open(wikiLinkURL, '_blank');
                        } else {
                            console.log('No hay enlace de la wiki disponible para este personaje.');
                        }
                    });
                });
            } else {
                contPersonajes.innerHTML = '<p>No se encontraron resultados</p>';
            }
        } catch (error) {
            console.error('Error al buscar personajes:', error);
            appendAlert('Error al buscar personajes', 'danger');
        }
    }
});
