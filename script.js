// # FASE DI PREPARAZIONE

// Raccogliamo tutti gli elementi di interesse dalla pagina
const main = document.querySelector('main');
const input = document.querySelector('input');
const addButton = document.querySelector('#add');
const listContainer = document.querySelector('#list-container');
const suggestButton = document.querySelector('#suggest');

// Prepariamo di dati iniziali
let text = '';
const items = [];
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=METTI QUI LA TUA API KEY';

// FASE DI INTERAZIONE

// Al click sul bottone "Aggiungi"
addButton.addEventListener('click', function () {
    // Recuperiamo il testo nell'input
    text = input.value.trim();

    // Se non c'è testo allora annulliamo
    if (text === '') {
        alert('Inserisci un elemento!');
        return;
    }

    // Costruiamo l'oggetto da aggiungere
    const newItem = {
        name: text,
        done: false
    }

    // Inseriamo l'oggetto nella lista
    items.push(newItem);

    console.log(items);

    // Puliamo l'input
    input.value = '';
    text = '';
    input.focus();

    // Montiamo la lista
    renderList();

})

// Al click sul bottone "Suggerisci"
suggestButton.addEventListener('click', async function () {

    // Se non ci sono elementi nella lista allora annulliamo
    if (items.length === 0) {
        alert('Inserisci almeno un elemento prima di chiedere un suggerimento!');
        return;
    }

    // Mostriamo un messaggio di caricamento
    main.className = 'loading';

    // Chiediamo un suggerimento a Gemini
    await getSuggestionFromGemini();

    // RI-renderizziamo la lista
    renderList();

    // Torniamo alla pagina principale
    main.className = 'building';
})

// # FUNZIONI
// Funzione per mostrare la lista in pagina
function renderList() {
    // Svuotiamo il contenuto precedente
    listContainer.innerHTML = '';

    // Cicliamo sugli elementi della lista
    items.forEach(function (item) {
        let statusImage = 'undone.webp';
        let statusClass = '';

        if (item.status === true) {
            statusImage = 'done.webp';
            statusClass = 'done';
        }

        // Creiamo un template HTML per l'elemento
        const itemHTML = `
        <li class="card">
            <div class="item">
                <img class="status-icon" src="img/${statusImage}" alt="status icon">
                <p class="item-name ${statusClass}">${item.name}</p>
            </div>
            <img class="delete-icon" src="img/delete.svg" alt="delete icon">
        </li>
        `

        // Aggiungi il template alla lista
        listContainer.innerHTML += itemHTML;
    });

    // Abilitiamo le icone di cancellazione
    enableDeleteIcons();

    // Abilitiamo le icone di cambio di stato
    enableStatusIcons();
}

// Funzione per abilitare le icone di cancellazione
function enableDeleteIcons() {
    // Raccogliamo le icone di cancellazione dalla pagina
    const deleteIcons = document.querySelectorAll('.delete-icon');

    // Per ciascuna delle icone di cancellazione...
    deleteIcons.forEach(function (icon, index) {
        // Al click sull'icona di cancellazione...
        icon.addEventListener('click', function () {
            // Elimino l'elemento dalla lista
            items.splice(index, 1)

            // Chiedo a JS di re-renderizzare la lista aggiornata
            renderList()
        })
    })
}

// Funzione per abilitare le icone di cambio status
function enableStatusIcons() {
    // Raccogliamo le icone di cambio status
    const statusIcons = document.querySelectorAll('.status-icon');

    // Per ciascuna delle icone di cambio status
    statusIcons.forEach(function (icon, index) {
        // Al click sull'icona...
        icon.addEventListener('click', function () {
            //  Invertiamo lo stato 
            items[index].status = !items[index].status

            // Ri-renderizza la lista
            renderList();

            console.log(items);


        })

    })
}

// Funzione per richiedere a Gemini di suggerire un oggetto
async function getSuggestionFromGemini() {
    // Estrapoliamo solo i nomi dalla lista per darli a gemini
    const names = [];

    // Per ognuno degli elementi in lista...
    items.forEach(function (item) {
        // Aggiungo il nome in lista
        names.push(item.name);
    })

    // Convertiamo l'array in stringa
    const myList = names.join(', ');


    // Prepariamo il prompt 
    const prompt = `
        Devo fare un viaggio. Al momento ho messo in valigia queste cose: ${myList}. Puoi suggerirmi un'altra cosa da aggiungere?
        Non includere NESSUN testo esplicativo, markdown, o qualsiasi altra cosa al di fuori dell'oggetto JSON.
        La risposta deve iniziare con il carattere '{' e finire con il carattere '}'.
        Il formato JSON DEVE essere esattamente: {"status": false,  "name": "tuo suggerimento qui"}
        Esempio di output corretto: {"status": false, "name": "Crema solare"}
    `;

    //  preparo l'oggetto di configurazione
    const config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: 'application/json' }
        })
    }

    // effettuo la chiamata
    const response = await fetch(API_ENDPOINT, config);
    const data = await response.json();


    // Estrapolo il suggerimento di Gemini
    const suggestedItem = JSON.parse(data.candidates[0].content.parts[0].text)

    console.log(suggestedItem);

    //: Lo inserisco nella lista
    items.push(suggestedItem);
}