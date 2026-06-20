document.getElementById('authForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

    sessionStorage.setItem('currentSessionEmail', email);
    sessionStorage.setItem('verificationCode', generatedCode);
    sessionStorage.setItem('codeTimestamp', Date.now());

    if (!registeredUsers.includes(email)) {
        registeredUsers.push(email);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    // Отправляем POST запрос на локальный сервер server.py
    fetch('http://localhost:8080', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_email: email, verification_code: generatedCode })
    })
    .then(response => {
        if (response.ok) {
            alert(`Здравствуйте! Проверка кода запущена. Код отправлен на почту: ${email}`);
            window.location.href = 'confirm.html';
        } else throw new Error();
    })
    .catch(() => {
        // Резерв на случай, если сервер забыли запустить на ПК
        alert(`[Локальный сервер не запущен]. Тестовый код для входа: ${generatedCode}`);
        window.location.href = 'confirm.html';
    });
});
