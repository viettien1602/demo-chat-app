import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import { allUsersUrl, host } from '../utils/APIRoutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from 'socket.io-client'

function Chat() {
    const socket = useRef()
    const navigate = useNavigate()
    const [contacts, setContacts] = useState([])
    const [currentUser, setCurrentUser] = useState(undefined)
    const [currentChat, setCurrentChat] = useState(undefined)
    useEffect(() => {
        const checkCurrentUser = async () => {
            if (!localStorage.getItem('user')) navigate('/login')
            else {
                setCurrentUser(await JSON.parse(localStorage.getItem('user')))
            }
        }
        checkCurrentUser() 
    }, [])
    useEffect(() => {
        if (currentUser) {
            socket.current = io(host)
            socket.current.emit('add-user', currentUser._id)
            socket.current.emit('check-online', currentUser._id)
            socket.current.on('is-online', (msg) => console.log(msg))
        }
    }, [currentUser])

    useEffect(() => {
        async function getContacts() {
            if (currentUser) {
                const response = await fetch(allUsersUrl + `/${currentUser._id}`, {
                    method: 'GET'
                }).then(res => res.json())          
                setContacts(response.users)
            }
        }
        getContacts()
    }, [currentUser])
    const handleChatChange = (chat) => {
        setCurrentChat(chat)
    }
  return (
    <>
        <Container>
        <div className="container">
            <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
            {
                currentChat === undefined ? 
                <Welcome  /> :
                <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket}/>
            }
            
        </div>
        </Container>
    </> 
    )
}

const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
.container {
  height: 85vh;
  width: 85vw;
  background-color: #00000076;
  display: grid;
  grid-template-columns: 25% 75%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: 35% 65%;
  }
}
`;

export default Chat