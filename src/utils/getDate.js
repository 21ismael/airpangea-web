export default function getDate(date) {
    const fecha = new Date(date);

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes} ${horas}:${minutos}`;
}