import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

import UserService from "../services/UserService";
import lobbyService from "../services/LobbyService";
import Sidebar from "../components/Sidebar";

import styles from "../css/views/Lobbies.module.css";

const Lobbies = (props) => {

    const { user } = props

    const [lobbies, setLobbies] = useState([])

    useEffect(() => {
        fetchLobbies();
    }, []);

    const fetchLobbies = async () => {
        let response;
        try {
            response = await lobbyService.getAllLobbies();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLobbies(response);
        }
    };

    const deleteLobby = async (lobbyId) => {
        try {
            await lobbyService.deleteOneLobby(lobbyId);
        }
        catch (error) {
            catchError(error);
        }
        finally {
            try {
                let newUser = user;
                newUser.lobbyId = ""
                await UserService.updateOneUser(newUser);
            }
            catch (error) {
                catchError(error);
            }
            finally {
                fetchLobbies();
            }
        }
    }

    const catchError = (error) => {
        console.error(error);
    }



    return (
        <div className={styles.flexBox}>
            <Sidebar />
                <div>
                    {!user.lobbyId && (
                        <Link to="/lobbies/create" className={styles.blueButton}>+</Link>
                    )}
                    {lobbies && lobbies.length === 0 ? (
                        <h2>No lobbies are here! Make one?</h2>
                        ) : (
                            lobbies.map((lobby, index) => (
                                <div key={index}>
                                    <h3>{lobby.name}</h3>
                                    <Link to={`/play/${lobby._id}`}>
                                        Join
                                    </Link>
                                    {lobby.creatorId === user._id && (
                                        <>
                                            <Link to={`/lobbies/edit`}>
                                                Edit
                                            </Link>
                                            <button onClick={() => deleteLobby(lobby._id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))
                        )
                    }
                </div>
            <Sidebar />
        </div>
    )
}

export default Lobbies;