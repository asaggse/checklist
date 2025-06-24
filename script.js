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