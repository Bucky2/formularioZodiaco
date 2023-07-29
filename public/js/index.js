document.getElementById('myForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto del formulario

    // Validación con Bootstrap
    if (!event.target.checkValidity()) {
      event.stopPropagation();
      event.target.classList.add('was-validated');
      return;
    }

    // Muestra la alerta de "Cargando..."
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor, espera unos segundos...',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    // Simula la espera de 2 segundos antes de enviar el formulario
    setTimeout(() => {
    // Muestra la alerta de éxito
    Swal.fire({
      title: 'Formulario agregado',
      text: 'El formulario ha sido agregado con éxito.',
      icon: 'success',
      timer: 3000 // Tiempo en milisegundos (3 segundos)
    }).then(() => {
      // Envía el formulario al servidor después de que se cierre la alerta de éxito
      event.target.submit();
    });
  }, 2000);
  });
