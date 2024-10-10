import axios from "axios";


// const instance = axios.create({
//     baseURL: 'http://localhost:2600'
// });
 const instance = axios.create({
    baseURL: 'https://backend-sandy-alpha.vercel.app/'
 });

//const instance = axios.create({
//    baseURL: 'https://backend-jnt4.onrender.com/' 
// } ) 

export default instance

