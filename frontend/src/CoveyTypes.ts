import { Socket } from 'socket.io-client';
import Player, { UserLocation } from './classes/Player';
import TownsServiceClient from './classes/TownsServiceClient';

export type CoveyEvent = 'playerMoved' | 'playerAdded' | 'playerRemoved';

export type VideoRoom = {
  twilioID: string,
  id: string
};
export type UserProfile = {
  displayName: string,
  id: string
};
export type NearbyPlayers = {
  nearbyPlayers: Player[]
};

/**
   * A list of messages that the Player sends or receives with information on if it the message is
   * public or private
   * who it is from
   * who it is to
   * the message
   * and the time is is sent.
   */
export type MessageFormat = {
  messageHistory: { id: string; privacy: 'public' | 'private'; from: string, to: string; message: string, time: string }[]
};

export type CoveyAppState = {
  sessionToken: string,
  userName: string,
  currentTownFriendlyName: string,
  currentTownID: string,
  currentTownIsPubliclyListed: boolean,
  myPlayerID: string,
  players: Player[],
  currentLocation: UserLocation,
  nearbyPlayers: NearbyPlayers,
  messageHistory: MessageFormat,
  unseenMessages: integer,
  emitMovement: (location: UserLocation) => void,
  socket: Socket | null,
  apiClient: TownsServiceClient,
};
