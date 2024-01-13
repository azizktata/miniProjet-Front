import App, {
    storiesReducer,
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
const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
    };
    const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
    };
      
//Unit tests for Methods and functions
    const stories = [storyOne, storyTwo];
    describe('storiesReducer', () => {
    it('removes a story from all stories', () => {
    const action = { type:'REMOVE_STORY', payload: storyOne}; // TODO: some action
    const state = {data: stories, isLoading: false, isError: false };  // TODO: some current state
    const newState = storiesReducer(state, action);
    const expectedState =  {
        data: [storyTwo],
        isLoading: false,
        isError: false,
    };  // TODO: the expected state
    expect(newState).toStrictEqual(expectedState);
    }); 
});

//Unit tests for Components (in jsdom: a headless browsers)
// npm install jsdom --save-dev
//•npm install @testing-library/react @testing-library/jest-dom --save-dev
// create setup file and add test environment and setup files in vite.config.js file

//test if the props passed into Component has been rendered successfully or not
//getByText / getByRole

//expect(screen.queryByText(/Loading/)).toBeNull();
//expect(screen.getByText('React')).toBeInTheDocument();

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={storyOne}/>);
        screen.debug();
    });
});


//Integration tests for axios with mock, stimulate axios requests
//il teste comment les utilisateurs interagissent avec l’application et si elle fonctionne comme prévu

//we are testing the component reaction with axios fetching the data, is the component acting as wanted or not?

// result of axios is a promise
describe('App', () => {
    it('succeeds fetching data', async () => {
        const promise = Promise.resolve({
        data: {
        hits: stories,
    },
    });
    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument(); // we expect loading here
    await waitFor(async () => await promise);
    expect(screen.queryByText(/Loading/)).toBeNull(); // then we expect the data, and not loading again
  });
})

//this test to test use case or sceanrio if the app is handling the error properly(calling wrong url endppoint for example)
describe('App' , () => {
it('succeeds fetching data', async () => {});
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

//Now we know the initial data fetching works for our App component,
//so we can move to testing user interactions. 

// testing removing a story
describe('App', () => {
it('removes a story', async () => {
const promise = Promise.resolve({
    data: {
    hits: stories,
    },
});
axios.get.mockImplementationOnce(() => promise);
render(<App />);
await waitFor(async () => await promise);
expect(screen.getAllByText('Dismiss').length).toBe(2);
expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
fireEvent.click(screen.getAllByText('Dismiss')[0]);
expect(screen.getAllByText('Dismiss').length).toBe(1);
expect(screen.queryByText('Jordan Walke')).toBeNull();
});
});

//Testing searching feature

describe('App' , () => {
    it('searches for a story', async () => {
        const reactPromise = Promise.resolve({
            data: {
                hits: stories,
            },
        })
    const anotherStory = {
        title: 'Javascript',
        url: 'https://reactjs.org/',
        author: 'Bendan Eich',
        num_comments: 15,
        points: 10,
        objectID: 3,
    };
    const JavascriptPromise = Promise.resolve({
        data: {
            hits: [anotherStory],
        },
    })
    axios.get.mockImplementation((url) =>{
        if (url.includes('React')){
            return reactPromise;
        }
        if (url.includes('JavaScript')){
            return JavascriptPromise;
        }
        throw Error();
    })
    });

});





    