import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://react-my-burger-43488-default-rtdb.firebaseio.com/'
})

export default instance;