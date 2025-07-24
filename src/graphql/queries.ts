import { gql } from '@apollo/client'

export const GET_EVENTS = gql`
  query GetEvents($first: Int!, $skip: Int!, $orderBy: String, $orderDirection: String) {
    events(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      name
      description
      category
      organizer
      startTime
      endTime
      maxAttendees
      currentAttendees
      ipfsMetadataURI
      isActive
      ticketTiers {
        id
        name
        price
        supply
        sold
        isActive
      }
      sponsorshipTiers {
        id
        level
        price
        supply
        sold
        isActive
      }
      polls {
        id
        questionHash
        options
        votes
        totalVotes
        endTime
        isActive
      }
    }
  }
`

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    event(id: $id) {
      id
      name
      description
      category
      organizer
      startTime
      endTime
      maxAttendees
      currentAttendees
      ipfsMetadataURI
      isActive
      ticketTiers {
        id
        name
        price
        supply
        sold
        startTime
        endTime
        isActive
      }
      sponsorshipTiers {
        id
        level
        price
        metadataURI
        supply
        sold
        isActive
      }
      polls {
        id
        questionHash
        options
        votes
        totalVotes
        endTime
        isActive
      }
      attendanceRecords {
        id
        ticketId
        attendee
        timestamp
      }
    }
  }
`

export const GET_EVENTS_BY_CATEGORY = gql`
  query GetEventsByCategory($category: String!, $first: Int!, $skip: Int!) {
    events(
      where: { category: $category }
      first: $first
      skip: $skip
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      name
      description
      category
      organizer
      startTime
      endTime
      maxAttendees
      currentAttendees
      ipfsMetadataURI
      isActive
    }
  }
`

export const GET_EVENTS_BY_ORGANIZER = gql`
  query GetEventsByOrganizer($organizer: String!, $first: Int!, $skip: Int!) {
    events(
      where: { organizer: $organizer }
      first: $first
      skip: $skip
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      name
      description
      category
      organizer
      startTime
      endTime
      maxAttendees
      currentAttendees
      ipfsMetadataURI
      isActive
      ticketTiers {
        id
        name
        price
        supply
        sold
      }
    }
  }
`

export const GET_TICKETS_BY_OWNER = gql`
  query GetTicketsByOwner($owner: String!, $first: Int!, $skip: Int!) {
    tickets(
      where: { owner: $owner }
      first: $first
      skip: $skip
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      tokenId
      owner
      event {
        id
        name
        startTime
        endTime
        location
      }
      tier {
        id
        name
        price
      }
      seatNumber
      perks
      qrCodeURI
      isUsed
      createdAt
    }
  }
`

export const GET_POLL_RESULTS = gql`
  query GetPollResults($eventId: ID!) {
    event(id: $eventId) {
      id
      name
      polls {
        id
        questionHash
        options
        votes
        totalVotes
        endTime
        isActive
        votes {
          id
          voter
          optionId
          timestamp
        }
      }
    }
  }
`

export const GET_EVENT_ANALYTICS = gql`
  query GetEventAnalytics($eventId: ID!) {
    event(id: $eventId) {
      id
      name
      maxAttendees
      currentAttendees
      ticketTiers {
        id
        name
        price
        supply
        sold
      }
      sponsorshipTiers {
        id
        level
        price
        supply
        sold
      }
      attendanceRecords {
        id
        timestamp
      }
      polls {
        id
        totalVotes
        isActive
      }
    }
  }
`

export const SEARCH_EVENTS = gql`
  query SearchEvents($searchTerm: String!, $first: Int!, $skip: Int!) {
    events(
      where: {
        or: [
          { name_contains_nocase: $searchTerm }
          { description_contains_nocase: $searchTerm }
          { category_contains_nocase: $searchTerm }
        ]
      }
      first: $first
      skip: $skip
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      name
      description
      category
      organizer
      startTime
      endTime
      maxAttendees
      currentAttendees
      ipfsMetadataURI
      isActive
    }
  }
`