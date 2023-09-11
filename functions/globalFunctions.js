function getTitle(title) {
    if (title === 'controlalergenos') {
        return 'Control Alergenos';
    } else if (title === 'entregabidones') {
        return 'Entrega Bidones';
    } else if (title === 'flashincidente') {
        return 'Flash Incidente';
    } else if (title === 'informeintaccidente') {
        return 'Informe Accidente';
    } else if (title === 'registrocapacitacion') {
        return 'Registro Capacitacion';
    } else if (title === 'registrodecomiso') {
        return 'Registro Decomiso';
    } else if (title === 'registrosimulacro') {
        return 'Registro Simulacro';
    } else if (title === 'reporterechazo') {
        return 'Reporte Rechazo';
    } else if (title === 'verificacionbalanza') {
        return 'Verificacion Balanza';
    } else if (title === 'verificaciontermometros') {
        return 'Verificacion Termómetros';
    } else {
        return title;
    }
}

export { getTitle };
