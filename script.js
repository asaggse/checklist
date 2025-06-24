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
    items.forEach(function (item){
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