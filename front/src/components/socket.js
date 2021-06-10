import io from "socket.io-client";
import { server } from '../assets/env.js'

//L'initialisation en dehors des components permet de partager simplement la même socket dans toutes l'application

const socket = io.connect(`http://${server.host}:${server.port}`);

export { socket }