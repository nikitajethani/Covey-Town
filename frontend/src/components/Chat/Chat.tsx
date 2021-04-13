import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  Select,
  useDisclosure,
  Text,
  Grid,
  HStack,
} from '@chakra-ui/react';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import Player from '../../classes/Player';
import useMaybeVideo from '../../hooks/useMaybeVideo';

const Chat: React.FunctionComponent = () => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const video = useMaybeVideo()
  const {socket, messageHistory, players, userName, unseenMessages} = useCoveyAppState();
  const [message, setMessage] = useState<string>('');
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>([]);
  const [receiver, setReceiver] = useState<string>('');
  const containerRef = useRef<null | HTMLDivElement>(null);

  
  /**
   * when chat is opened, notifications for messages with stop
   */
  const openChat = useCallback(()=>{
    onOpen();
    video?.pauseGame();
    socket?.emit('looking at messages');
  }, [onOpen, socket, video]);

  /**
   * when chat is closed, notifications for messages with start
   */
  const closeChat = useCallback(()=>{
    onClose();
    video?.unPauseGame();
    socket?.emit('looking at messages');
  }, [onClose, socket, video]);

  /**
   * list usernames of current players in alphabetical order
   */
  const updatePlayers = useCallback(() => {
    const playersFilter = players.filter((player) => player.userName !== userName);
    setCurrentPlayers(playersFilter.sort((a,b) => a.userName < b.userName ? -1:1));
  }, [players, userName]);

  /**
   * automatically scroll to bottom of chat 
   */
  const scroll = useCallback(() => {
    if(containerRef && containerRef.current) {
      const element = containerRef.current;
      element.scrollIntoView();
    }
  }, [containerRef]);
  
  useEffect(() => {
    updatePlayers();
    const timer = setInterval(updatePlayers, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [updatePlayers]);
  
  /**
   * when message is sent, client socket emit a message
   */
  const processUpdates = async () =>{
    if (message !== ''){
    if (receiver === '') {
      socket?.emit('sendPublicMessage', message, userName);
    } else {
      socket?.emit('sendPrivateMessage', message, receiver, userName)
    } 
    }
    scroll();
    setMessage('');

  };

  /**
   * when enter is pressed, message is sent
   */
  const handleKeypress = (e: { charCode: number; }) => {
      if (e.charCode === 13) {
    processUpdates();
  }
  };


  return <>
    <MenuItem data-testid='openMenuButton' onClick={openChat} style={unseenMessages !== 0 ? { outline: '1px solid red' }:{ color: 'black'}}>
    <HStack spacing="5px">
      <Typography variant="body1">Chat</Typography>
      <Text style={unseenMessages !== 0 ? { color: 'red'}:{ color: 'white', opacity: 0.0}}> {unseenMessages} </Text>
      </HStack>
    </MenuItem>

    <Drawer isOpen={isOpen} onClose={closeChat} size="sm" blockScrollOnMount={false}>
      
      <DrawerContent>
        <DrawerHeader style={{ color: "white", backgroundColor: '#526575'}}>Chat</DrawerHeader>
        <DrawerCloseButton style={{ color: "white"}} />
          <DrawerBody pb={6}>          
            {messageHistory?.messageHistory.map((msg) => ( 
               <Text style={msg.privacy === 'private' ? { color: 'red'}:{ color: 'black'}} key={msg.id}>
                <div style={{display: 'inline'}}> <b>{msg.from}</b> to <b>{msg.to}</b></div> 
                <div style = {{color: 'gray', fontSize: '14px', textAlign: 'right',display: 'inline' }}> {msg.time}</div>
              <div>{msg.message}</div>
              </Text>
              
            ))} 
            <div style={{height: '50px', width:'100%'}} ref={containerRef}/>

          </DrawerBody>
          <DrawerFooter justifyContent= "flex-start" display= "inline-flex" style={{ color: 'white', backgroundColor: '#526575'}}>
          <HStack spacing="15px">
          <Text>
          To:
          </Text>
              <FormControl>
              <Select style={{ color: 'white'}} className="select-users" id='userName' placeholder="Everyone" name="receiver" mr={4} value={receiver} onChange={(ev)=>setReceiver(ev.target.value)}>
             {currentPlayers?.map((player) => ( 
               <option key={player.id}> {player.userName}  
              </option>))}
              </Select>
              </FormControl>
            </HStack>
          </DrawerFooter>
          <DrawerFooter justifyContent= "flex-start" display= "inline-flex" style={{ color: 'white', backgroundColor: '#526575'}}>
          <Grid templateColumns="repeat(2, 1fr)" gap={2}>
            <FormControl>
              <Input w="320px" id='message' placeholder="Message..." name="message" value={message} onKeyPress={handleKeypress} onChange={(ev)=>setMessage(ev.target.value)} mr={4}/>
            </FormControl>
            <Button style={{ color: '#526575', backgroundColor: 'white'}} w="70px"data-testid='sendbutton' colorScheme="blue" mr={3} value="send" name='action1' type='submit' onClick={()=>processUpdates()}>
              Send
            </Button>
            </Grid>
          </DrawerFooter>
      </DrawerContent>
      
    </Drawer>
  </>

}

export default Chat;



