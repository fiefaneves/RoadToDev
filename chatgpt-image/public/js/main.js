function onSubmit(e) {
    e.preventDefault();

    document.querySelector('.msg').textContent = '';
    document.querySelector('#image').src = '';

    const prompt = document.querySelector('#prompt').value;
    const size = document.querySelector('#size').value;

    if (prompt === '') {
        alert('Please enter a prompt');
        return;
    }

    generateImagemRequest(prompt, size);
}

async function generateImagemRequest(prompt, size) {
    try {
        showSpinner();

        const response = await fetch('/openai/generateimage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, size })
        });

        if (!responde.ok) {
            removeSpinner();
            throw new Error("Something went wrong");
        }

        const data = await response.json();
        const imageUrl = data.data;
        document.querySelector('#image').src = imageUrl;

        removeSpinner();
    } catch (error) {
        document.querySelector('.msg').textContent = error;
        removeSpinner();
    }
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}
function removeSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

document.querySelector('#image-form').addEventListener('submit', onSubmit);