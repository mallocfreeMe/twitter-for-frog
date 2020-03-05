console.log("Hello World!");

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const croaksElement = document.querySelector('.croaks');
const API_URL = "http://localhost:5000/croaks";

loadingElement.style.display = '';

listAllCroaks();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    form.style.display = 'none';
    loadingElement.style.display = '';

    const croak = {
        name,
        content
    };

    form.style.display = 'none';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(croak),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json()).then(createdCroak => {
        form.reset();
        // setTimeout(() => {
        //     form.style.display = '';
        // }, 5000);
        form.style.display = '';
        listAllCroaks();
    })
});

function listAllCroaks() {
    croaksElement.innerHTML = '';

    fetch(API_URL)
        .then(response => response.json())
        .then(croaks => {
            croaks.reverse();
            croaks.forEach(croak => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = croak.name;

                const contents = document.createElement('p');
                contents.textContent = croak.content;

                const date = document.createElement('small');
                date.textContent = new Date(croak.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                croaksElement.appendChild(div);
            });
            loadingElement.style.display = "none";
        });
}