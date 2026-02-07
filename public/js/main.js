const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzn8uLQ3tTmjxoKM55vWQ5uVvu_k3asXgOPzS1yRqZwRQX5DTE9IBLNg5VEqc_B6CBeNw/exec'; 

/**
 * Manejador de Scroll Reveal
 * Hace aparecer los elementos a medida que se baja en la página
 */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando el 10% del elemento es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo animar una vez
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));
}

/**
 * Manejador de Formularios
 */
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
            // Remover clases antiguas, agregar nuevas clases CSS puras
            msg.classList.remove('hidden', 'error');
            msg.classList.add('success');
            form.reset();
        })
        .catch(() => {
            msg.innerText = "Hubo un error. Por favor, contactanos por WhatsApp.";
            msg.classList.remove('hidden', 'success');
            msg.classList.add('error');
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            setTimeout(() => { msg.classList.add('hidden'); }, 6000);
        });
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    handleForm('b2cForm', 'msgB2C');
    handleForm('b2bForm', 'msgB2B');
});