# Changes to Existing Backend Covey.Town Codebase

1. Player.ts
  - Each player now has a unique socket id so that when Player A sends a private message to 
Player B, the townSubscriptionHandler can get Player B's socket to emit the private message.  

| Class name: Player |
| ----- |
| State: location, id, username, socket |

| Responsibilities                                    | Collaborators           |
| ------ | ----- |
|  Represents a player in a room with their location, | CoveyTownController     |
|  unique id, unique username, and unique socket id   |  PlayerSession          |     
|                                                     | UserLocation            |
|                                                     | CoveyTownListener       |
|                                                     | TownJoinResponse        |
|                                                     | townJoinHandler         |
|                                                     | townSubscriptionHandler |
|                                                     | townSocketAdapter       |
|                                                     | CoveyTownsStore         |

2. CoveyTownsStore.ts
function getTownInfo: Gets the usernames in the town and returns the list of usernames and true if the town exists or false if it doesn't

| Function name: getTownInfo (CoveyTownsStore) |
| ----- |
| State: None |

| Responsibilities                                      | Collaborators           |
| ------ | ----- |
|  API requests that create a session, deletes a town,  | CoveyTownController     |
|  lists all the towns, gets all the usernames in a    | Player                 |     
|  town, creates a town, and updates a town.                            |            |

3. towns.ts
  - API gets requests to obtain the information on a specific town. When Player 'nikita' tries to join town 'friendly town', an error is thrown because there is already a player with the username 'nikita' in 'friendly town'. Player 'nikita' needs to choose a different username before entering the town. 

| Function name: addTownRoutes (towns) |
| ----- |
| State: None |

| Responsibilities                                    | Collaborators           |
| ------ | ----- |
|  Gets the usernames in the town and returns         | townCreateHandler|
|  the list of usernames and true if the town exists  | townDeleteHandler                |     
|  or false if it doesn't.                            |  townInfoHandler          |
|                                                     | townJoinHandler            |
|                                                     | townListHandler       |
|                                                     | townSubscriptionHandler       |
|                                                     | townUpdateHandler         |

4. CoveyTownRequestHandlers.ts
  - function townInfoHandler: gets a list of usernames of current players so no players can have the same usernames when joining a town. 

| Function name: townInfoHandler (CoveyTownRequestHandlers) |
| ----- |
| State: None |

| Responsibilities                                    | Collaborators           |
| ------ | ----- |
|  Gets the list of players’ usernames in a town.         | TownInfoRequest |
|    | TownInfoResponse                |     
|                            |  Player          |
|                                                     | CoveyTownController            |
|                                                     | CoveyTownsStore       |

  - function getTime: gets the current time when chat was sent to display on the chat screen.
  - function townSubscriptionHandler: 
    - adds the socket to the respective Player
    - event listener: 'sendPublicMessage': Register an event listener for the client socket: if the client sends a public message - inform the client socket to display the message on the sender's screen and inform all the other clients sockets in the town to display the message. 
    - event listener: 'sendPrivateMessage': Register an event listener for the client socket: if the client sends a private message - inform the client socket that to display the message on the sender's screen and inform the receiver client's socket to display the message on the screen.
    - event listener: 'looking at messages': Register an event listener for the client socket: if the client is looking at their messages - inform the client socket to not display the number of unseen messages.

| Function name: townSubscriptionHandler (CoveyRoomRequestHandler) |
| ----- |
| State: None |

| Responsibilities                                    | Collaborators           |
| ------ | ----- |
|  Informs CoveyRoomController if the location of client          | Socket |
| changes and inform player of the events happening in the room.   | ServerPlayer               |     
|                            |  CoveyTownStore          |
|                                                     | CoveyTownController            |
|                                                     | CoveyTownListener      |
|                                                     | getTime      |
|                                                     | townSocketAdapter      |

 # Changes to Existing Frontend Covey.Town Codebase
 
 1. CoveyTypes.ts
  - type MessageFormat: list of all the messages a player receives or sends, whether it is a public or private message, who is it from/sent to, and the time it is sent/received. 
  - type CoveyAppState: addition of messageHistory which is a MessageFormat and unseenMessages which tracks how many messages the player hasn't seen if the chat is closed.
 2. App.tsx
  - action: 'sendPublicMessage' and 'sendPrivateMessage': adds a message that is sent to the messageHistory with the respective fields.
  - action: 'receivePublicMessage' and 'receivePrivateMessage': adds a message that is received to the messageHistory with the respective fields.
  - action: 'updateSeen': if player has opened the chat, unseenMessages changes to 0.
  - function GameController: event listeners that inform the client socket that calls the actions to add messages to the messageHistory. 

| Function name: GameController (App) |
| ----- |
| State: None |

| Responsibilities                                    | Collaborators           |
| ------ | ----- |
|  Updates the current state of the player.  | Socket     |
|     |  dispatchAppUpdate         |     
|                                                     | Video            |
|                                                     | TownJoinResponse       |
|                                                     | ServerPlayer       |
|                                                     | UserLocation         |
|                                                     | useAppState |
|                                                     | CoveyAppState      |
|                                                     | NearbyPlayers         |
|                                                     | Login         |
|                                                     | VideoContext         |

 3. TownSelection.tsx
  - If a player tries to join a town with a username that already exists within that town, a toast is displayed that says 'Your username is taken - please select a  different username'.

| Function name: TownSelection |
| ----- |
| State: None |

| Responsibilities                                    | Collaborators           |
| ------ | ----- |
|  Displays the login screen on players screen     | useVideoContext    |
| and processes player’s login information when joining town.   |  Video        |     
|                                                     | CoveyTownInfo           |
|                                                     | TownJoinResponse       |
|                                                     | useCoveyAppState       |
|                                                     | useVideoContext         |

 4. Chat.tsx
  - adds a chat feature to a player's screen - if the player clicks on it a drawer slides open on the right side and the player can continue to play the game while also     using the chat.
  - the player can send a public message to everyone in the room or a private message to a specific username by using a drop down in the chat box.
  - the messages displayed show who the message is from and to with a timestamp (private messages are in red).
  - if the chat is closed, the player can see how many messages they have not looked at (there is a red number next to the chat button that displays this).

| Function name: Chat |
| ----- |
| State: None |

| Responsibilities                                    | Collaborators           |
| ------ | ----- |
|  Displays the chat on the player’s screen and notifications,     | Socket    |
| and processes player’s messages that are sent.   |  ServerPlayer      |     
|                                                     | useMaybeVideo           |
|                                                     | useCoveyAppState       |





