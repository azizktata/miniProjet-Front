import App, {
    eventsReducer,
    Item,
    List,
    SearchForm,
    InputWithLabel,
    } from "./App";
import { describe, it, expect, vi } from "vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    } from '@testing-library/react';

import axios from 'axios';
vi.mock('axios');

// Test Data
const eventOne = {
    title: 'D-A-D',
    url: 'https://www.ticketmaster.com/not-another-dd-podcast-medford-massachuset',
    dates: {
        start:{
            localDate: "2024-11-01",
        },
        timezone: 'Europe/Copenhagen'
    },
    locale: "en-us",
  
};
const eventTwo = {
    title: 'Not Another D+D Podcast',
    url: 'https://www.ticketmaster.dk/event/d-a-d-tickets/540577?language=en-us',
    dates: {
        start:{
            localDate: "2024-01-19",
        },
        timezone: 'America/New_York'
    },
    locale: "en-us",
};
      
//Un test unitaire de la fonction reducer. Le test doit prendre en compte tous les cas possibles du reducer.

    const events = [eventOne, eventTwo];
    describe('eventsReducer', () => {
    it('removes an event', () => {
    const action = { type:'REMOVE_EVENT', payload: eventOne}; // TODO: some action
    const state = {data: events, isLoading: false, isError: false };  // TODO: some current state
    const newState = eventsReducer(state, action);
    const expectedState ={
        data: [eventTwo],
        isLoading: false,
        isError: false,
    };  // TODO: the expected state
    expect(newState).toEqual(expectedState);
    }); 
});


describe('eventsReducer', () => {
it('Get events', () => {
const action = { type:'EVENTS_FETCH_SUCCESS', payload: events}; // TODO: some action
const state = {data: [], isLoading: true, isError: false };  // TODO: some current state
const newState = eventsReducer(state, action);
const expectedState =  {
    data: events,
    isLoading: false,
    isError: false,
};  // TODO: the expected state
expect(newState).toStrictEqual(expectedState);
}); 
});


describe('eventsReducer', () => {
it('No events', () => {
const action = { type:'EVENTS_FETCH_FAILURE'}; // TODO: some action
const state = {data: [], isLoading: false, isError: false };  // TODO: some current state
const newState = eventsReducer(state, action);
const expectedState =  {
    data: [],
    isLoading: false,
    isError: true,
};  // TODO: the expected state
expect(newState).toStrictEqual(expectedState);
}); 
});


describe('eventsReducer', () => {
it('init fetch', () => {
const action = { type:'EVENTS_FETCH_INIT'}; // TODO: some action
const state = {data: [], isLoading: false, isError: false };  // TODO: some current state
const newState = eventsReducer(state, action);
const expectedState =  {
    data: [],
    isLoading: true,
    isError: false,
};  // TODO: the expected state
expect(newState).toStrictEqual(expectedState);
}); 
});

//Un test unitaire pour chaque composant de l'application.
//Item component
const mockOnRemoveItem = vi.fn();
describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={eventOne} onRemoveItem={mockOnRemoveItem}/>);
        screen.debug();
        expect(screen.getByText("2024-11-01")).toBeInTheDocument();
        expect(screen.getByText("Europe/Copenhagen")).toBeInTheDocument();
        expect(screen.getByText("en-us")).toBeInTheDocument();
    
        const removeButton = screen.getByText(/Remove/i).closest('button');
    fireEvent.click(removeButton);

    expect(mockOnRemoveItem).toHaveBeenCalledWith(eventOne);
    });
});


describe('SearchForm', () => {
    it('renders all properties', () => {
        render(<SearchForm />);
        screen.debug();
    });
});

describe('List', () => {
    it('renders all events', () => {
        render(<List list={events} />);
        screen.debug();
    });
});

//Un test d'intégration pour le happy path.
describe('App', () => {
    it('succeeds fetching data', async () => {
    axios.get.mockResolvedValueOnce({ data: { _embedded: events } });
    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument(); // we expect loading here
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(/Loading/)).toBeNull(); // then we expect the data, and not loading again
  });
})

//Un test d'intégration  pour le unhappy path.
//this test to test use case or sceanrio if the app is handling the error properly(calling wrong url endppoint for example)
describe('App' , () => {
it('fails fetching data', async () => {
    const promise = Promise.reject();
    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument(); // use getByText to look for something that exists
    try {
        await waitFor(async () => await promise);
    } catch (error) {
        expect(screen.queryByText(/Loading/)).toBeNull(); //use getByQuery to look for something that might or might not exists
        expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
});
});
//test if the props passed into Component has been rendered successfully or not
//getByText / getByRole

//expect(screen.queryByText(/Loading/)).toBeNull();
//expect(screen.getByText('React')).toBeInTheDocument();

// describe('Item', () => {
//     it('renders all properties', () => {
//         render(<Item item={storyOne}/>);
//         screen.debug();
//     });
// });


//Integration tests for axios with mock, stimulate axios requests
//il teste comment les utilisateurs interagissent avec l’application et si elle fonctionne comme prévu

//we are testing the component reaction with axios fetching the data, is the component acting as wanted or not?

// result of axios is a promise




// });

// //Now we know the initial data fetching works for our App component,
// //so we can move to testing user interactions. 

// // testing removing a story
// describe('App', () => {
// it('removes a story', async () => {
// const promise = Promise.resolve({
//     data: {
//     hits: stories,
//     },
// });
// axios.get.mockImplementationOnce(() => promise);
// render(<App />);
// await waitFor(async () => await promise);
// expect(screen.getAllByText('Dismiss').length).toBe(2);
// expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
// fireEvent.click(screen.getAllByText('Dismiss')[0]);
// expect(screen.getAllByText('Dismiss').length).toBe(1);
// expect(screen.queryByText('Jordan Walke')).toBeNull();
// });
// });

// //Testing searching feature

// describe('App' , () => {
//     it('searches for a story', async () => {
//         const reactPromise = Promise.resolve({
//             data: {
//                 hits: stories,
//             },
//         })
//     const anotherStory = {
//         title: 'Javascript',
//         url: 'https://reactjs.org/',
//         author: 'Bendan Eich',
//         num_comments: 15,
//         points: 10,
//         objectID: 3,
//     };
//     const JavascriptPromise = Promise.resolve({
//         data: {
//             hits: [anotherStory],
//         },
//     })
//     axios.get.mockImplementation((url) =>{
//         if (url.includes('React')){
//             return reactPromise;
//         }
//         if (url.includes('JavaScript')){
//             return JavascriptPromise;
//         }
//         throw Error();
//     })
//     });

// });





    