export const datePrettier = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    return `${ days[date.getDay()] } ${ date.getDate() } ${ months[date.getMonth()] }`;
};