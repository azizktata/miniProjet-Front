import { useState, useReducer, useEffect, useCallback } from 'react'
import { orderBy } from "lodash";
import axios from "axios";
import './App.css'



const eventsReducer = (state, action) => {
  switch (action.type) {
    case "EVENTS_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "EVENTS_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "EVENTS_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_EVENT":
      return {
        ...state,
        data: state.data.filter(
          (event) => action.payload.name !== event.name,
        ),
      };
    default:
      throw new Error();
  }
};

const API_ENDPOINT = "https://app.ticketmaster.com/discovery/v2/events?apikey=IORkGJ7JQdPEnA8K2wx6kQOS5KgA5kGv&keyword=";

function App() {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#ebf0f0', '#d0fd8d', '#dd8dfd', '#87cefa'];

  const [searchTerm, setSearchTerm] = useState("d");//"all"
  const [tri1, setTri1]= useState(""); 
  const [inverse, setInverse]= useState("asc");
  const [count, setCount]= useState(1);
  const [pagecount, setPageCount]= useState(0);
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}&page=${pagecount}`);
  const [urls, setUrls] = useState([]);

  const [events, dispatchEvents] = useReducer(eventsReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchEvents = useCallback(async () => {
    dispatchEvents({ type: "EVENTS_FETCH_INIT" });

    try {
      const result = await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      console.log(result.data._embedded.events);

      dispatchEvents({
        type: "EVENTS_FETCH_SUCCESS",
        payload: result.data._embedded.events, //result.data
      });
    } catch {
      dispatchEvents({ type: "EVENTS_FETCH_FAILURE" });
    }
  }, [url]);

  useEffect(() => {
    handleFetchEvents();
  }, [handleFetchEvents]);


  const handleRemoveEvent = (item) => {
    dispatchEvents({
      type: "REMOVE_EVENT",
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };
  const handlePageForward = (event) => {
    setPageCount(prevPageCount => prevPageCount + 1);
    setUrl(`${API_ENDPOINT}${searchTerm}&page=${pagecount+1}`);
  };
  const handlePageBackward = (event) => {
    if(pagecount > 0)
      setPageCount(prevPageCount => prevPageCount - 1);
    setUrl(`${API_ENDPOINT}${searchTerm}&page=${pagecount==0 ? pagecount : pagecount-1}`);
  };
  const handleSearchHistory = (url) => {
    setUrl(`${url.url}${url.search}`);
    event.preventDefault();
   
  };
  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    if(!urls.some(url => url.search === searchTerm)){
      setUrls(
        current =>
        [
          ... current,
          {
            search:searchTerm,
            url: API_ENDPOINT
          }
        ]
        
      )
     }

    event.preventDefault();
    console.log(events.data)
  };
  const hadnleTri1 = (value, Event) => {
    // tri list
    setTri1(value)
    setCount(count+1)
    if (count % 2 == 0) 
      setInverse("asc")
    else
      setInverse("desc")
    
    console.log(inverse)
    
  }

  const sortList  = orderBy(events.data, tri1, inverse)

  return (
    <div style={{ backgroundColor: colors[colorIndex] }} className="container"> 
    
      <h1 className="headlinePrimary">Available Events</h1>
      <div className='tri'>
        <h3>Tri:</h3>
        <button className="button button_large" onClick={() => hadnleTri1("name")}>
           by Name
        </button>
        <span></span>
        <button className="button button_large" onClick={() => hadnleTri1("dates.start.localDate")}>
           by Date
        </button>
      </div>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className='history'>
        <span>search_history:</span>
     {urls && urls.map(url => (
       
        <button onClick={()=>handleSearchHistory(url)}>{url.search}</button>
     
      ))}
    </div>
    <div className='page'>
      <button className="button button_small" onClick={handlePageBackward}>
           B
      </button>
      <button className="button button_small" onClick={handlePageForward}>
           F
      </button>
    </div>
      <hr />
      <hr />

      {events.isError && <p>Something went wrong ...</p>}

      {events.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <>
        <List list={tri1 ? sortList:events.data}  onRemoveItem={handleRemoveEvent} />
        </>
      )}
    </div>
  );
  
}

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form className="search_form" onSubmit={onSearchSubmit}>
    <label htmlFor="search">Search: </label>
     
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={onSearchInput}
        className="search-input"
      />
      
    <button className="button button_large" type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);
const List = ({ list, onRemoveItem }) => (
  <ul className='list'>
    {list.map((item) => (
      <Item item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);
const Item = ({ item, onRemoveItem }) => (
  <li className="item">
  
    <span style={{width:"40%"}}>
      <a href={item.url}>{item.name}</a>
    </span>
    <span style={{width:"30%"}}>{item.dates.start.localDate}</span>

    <span style={{width:"30%"}}>{item.dates.timezone}</span>
    <span style={{width:"10%"}}>{item.locale}</span>
  
    <span style={{width:"10%"}}>
      <button className="button button_small" type="button" onClick={() => onRemoveItem(item)}>
        Remove
      </button>
    </span>
  </li>
);

export default App;
export { eventsReducer,
  SearchForm,
  List, Item };
