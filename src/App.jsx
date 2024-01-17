import * as React from "react";
import axios from "axios";
//import styles from  "./App.module.css";
import "./App.css";
import { orderBy, sortBy } from "lodash";
//import styled from "styled-components"

// const StyledContainer = styled.div`
// height: 100vw;
// padding: 20px;
// background: #83a4d4;
// background: linear-gradient(to left,
// #b6fbff, #83a4d4);
// color: #171212;
// `;
// const StyledHeadlinePrimary = styled.h1`
// font-size: 48px;
// font-weight: 300;
// letter-spacing: 2px;
// `;



const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.id_car !== story.id_car,
        ),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState,
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = "http://10.101.165.63:8081/api/v1/cars/brand/";
//"https://hn.algolia.com/api/v1/search?query="
const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("all");//"all"search", "React""

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  const [urls, setUrls] = React.useState([]);

  const [tri1, setTri1]= React.useState(""); 
  const [inverse, setInverse]= React.useState("asc");
  const [count, setCount]= React.useState(1);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "GET",
          "Content-Type": "application/json",
        },
      });
      // console.log(result.data);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data, //result.data //hits
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
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
  const handleInverse = (event) => {
    
    setInverse("desc")
      
  }
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchHistory = (url) => {
    setUrl(`${url.url}${url.search}`);
    event.preventDefault();
    console.log(stories.data)
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
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

    console.log(urls)
    event.preventDefault();
    console.log(stories.data)
  };

  const sortList  = orderBy(stories.data, tri1, inverse)

  return (
//     <StyledContainer>
      
//       <StyledHeadlinePrimary>My Stories</StyledHeadlinePrimary>  
//       <SearchForm
//         searchTerm={searchTerm}
//         onSearchInput={handleSearchInput}
//         onSearchSubmit={handleSearchSubmit}
//       />
//       {stories.isError && <p>Something went wrong ...</p>}

// {stories.isLoading ? (
//   <p>Loading ...</p>
// ) : (
//   <List list={stories.data} onRemoveItem={handleRemoveStory} />
// )}
//     </StyledContainer>
// className={styles.container}
    <div className="container"> 
    
      <h1 className="headlinePrimary">My Garage</h1>
      
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

      <hr />

    

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <>
        {/* <div className="tri_button_div">
          <button onClick={() => hadnleTri1("title")} > tri</button>
          <button onClick={() => hadnleTri1("author")} >tri</button>
          <button onClick={() => hadnleTri1("num_comments")} >tri</button>
          <button onClick={() => hadnleTri1("points")} >tri</button>
        </div> */}
        <List list={tri1 ? sortList:stories.data}  onRemoveItem={handleRemoveStory} />
        </>
      )}
    </div>
  );
};

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

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="search_input"
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul className='list'>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li className="item">
    <span style={{width:"30%"}}>{item.brand}</span>
    <span></span>
    <span style={{width:"20%"}}>{item.model}</span>
    <span></span>
    <span style={{width:"20%"}}>{item.year}</span>
   
    {/* <span style={{width:"40%"}}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{width:"30%"}}>{item.author}</span>
    <span style={{width:"10%"}}>{item.num_comments}</span>
    <span style={{width:"10%"}}>{item.points}</span> */}
    <span style={{width:"10%"}}>
      <button className="button button_small" type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
export { storiesReducer,
  SearchForm, InputWithLabel,
  List, Item };
  