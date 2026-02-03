const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbww1VkK8fQDMpZ_7W4rucpBDpiunS3S5H4ewspgantM7NOsvc4vHSW1glxrxG_QeTbMLQ/exec'; 

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('statusMessage');
    const originalText = btn.innerText;
    
    btn.innerText = "ENVIANDO...";
    btn.disabled = true;
    btn.classList.add('opacity-50');

    const data = {
        nombre: document.getElementById('nombre').value,
        empresa: document.getElementById('empresa').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        mensaje: document.getElementById('mensaje').value
    };

    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => {
        statusMsg.innerText = "¡Mensaje enviado con éxito! Nos contactaremos pronto.";
        statusMsg.classList.remove('hidden', 'text-red-500');
        statusMsg.classList.add('text-green-500');
        document.getElementById('contactForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        statusMsg.innerText = "Error al enviar. Por favor, intenta por WhatsApp.";
        statusMsg.classList.remove('hidden', 'text-green-500');
        statusMsg.classList.add('text-red-500');
    })
    .finally(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        setTimeout(() => { statusMsg.classList.add('hidden'); }, 5000);
    });
});
