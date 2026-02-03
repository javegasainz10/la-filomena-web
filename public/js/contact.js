const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbww1VkK8fQDMpZ_7W4rucpBDpiunS3S5H4ewspgantM7NOsvc4vHSW1glxrxG_QeTbMLQ/exec'; 

function handleForm(formId, msgId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const msg = document.getElementById(msgId);
        const btn = form.querySelector('button');
        const originalText = btn.innerText;

        btn.innerText = "PROCESANDO...";
        btn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.tipo = formId === 'b2cForm' ? 'Suscripción B2C' : 'Empresa B2B';

        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(() => {
            msg.innerText = "¡Gracias! Nos pondremos en contacto pronto.";
            msg.classList.remove('hidden', 'text-red-500');
            msg.classList.add('text-green-500');
            form.reset();
        })
        .catch(() => {
            msg.innerText = "Hubo un error. Por favor, contactanos por WhatsApp.";
            msg.classList.remove('hidden', 'text-green-500');
            msg.classList.add('text-red-500');
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            setTimeout(() => { msg.classList.add('hidden'); }, 6000);
        });
    });
}

// Inicializar ambos formularios
handleForm('b2cForm', 'msgB2C');
handleForm('b2bForm', 'msgB2B');
