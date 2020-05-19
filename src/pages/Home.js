import React, {Fragment, Component} from 'react';
import HomeHeading from '../components/HomeHeading';
import Footer from '../components/Footer';
import Select from 'react-select';
import styled from 'styled-components';
import theme from '../theme';
import Spinner from '../components/Spinner';
import Waypoint from 'react-waypoint';
import { Link } from 'react-router-dom';
import config from '../config';
import LastWatched from '../components/LastWatched';

const Main = styled.main`
  max-width: 1168px;
  min-width: 80vw;
  margin: 1rem auto;
  flex-grow: 1;
  .grid-header {
    padding: 8px 12px;
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    .title {
      flex-grow: 1;
      > h2 {
        margin-bottom: 8px;
        font-weight: normal;
        font-size: 32px;
      }
      > p {
        opacity: 0.8;
      } 
    }
  }
`

const Grid = styled.section`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 8px 12px;
  max-width: 100vw;
  padding: 8px 12px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 650px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 420px) {
    display: block;
  }

  .show {
    display: block;
    position: relative;
    transition: transform 0.3s ease-in-out;
    border: 1px solid transparent;
    min-height: 100px;
    &:hover {
      transform: scale(1.05);
    }
    img {
      max-width: 100%;
      border-radius: 4px 4px;
    }
    .title {
      border-radius: 0 0 4px 4px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: rgba(0,0,0, 0.7);
      color: white;
      font-weight: bold;
      padding: ${theme.spaces[3]}px;
      margin-bottom: ${theme.spaces[1]}px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const SelectWrapper = styled.div`
  margin-top: 2rem;
  margin-left: 16px;

  label {
    opacity: 0.8;
    display: block;
    margin-bottom: ${theme.spaces[2]}px;
  }
  > div {
    min-width: 180px;
    color: ${theme.colors.black4};
  }
`;

function parseQueryString(url) {
  return new URLSearchParams(url.replace('?', ''));
}

class Home extends Component {
  state = {
    loading: true,
    sort: config.sortOptions[0],
    genre: config.genreOptions[0],
    page: 1,
    search: '',
    shows: [],
    perPage: 50,
    hasMorePages: false
  }

  componentDidMount() {
    const urlParams = parseQueryString(this.props.location.search);
    const search = urlParams.get('search') || '';
    this.setState({search, page: search ? 'all' : 1}, () => {
      this.fetchShows()
    })
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = parseQueryString(nextProps.location.search);
    const newSearch = newQuery.get('search') || '';
    if (newSearch && newSearch !== this.state.search) {
      this.setState({shows: [], search: newSearch, page: 'all'}, () => {
        this.fetchShows()
      })
    }
  }

  handleSortChange = (sort) => {
    this.setState({sort, page: 1, shows: []}, () => this.fetchShows());
  }

  handleGenreChange = (genre) => {
    this.setState({ genre, page: 1, shows: [] }, () => this.fetchShows());
  }

  handleNextPage = () => {
    if (this.state.loading || this.state.page === 'all') {
      return;
    }
    this.setState(prev => ({page: prev.page + 1}), () => {
      this.fetchShows()
    });
  }

  fetchShows() {
    const PAGE_SIZE = 50
    const {sort, genre, page, search} = this.state;
    this.setState({loading: true})
    const url = `${config.catalogApi}/shows/${page}?sort=${sort.value}&genre=${genre.value}`;
    return fetch(url).then(res => res.json())
    .then(data => {
      const parsed = data.map(show => {
	      Object.keys(show.images).forEach(key => {
	        show.images[key] = show.images[key]
            .replace("trakt.us", "trakt.tv")
            .replace("http", "https");
	      });
     	  return show;
      }).filter(show => {
        if (!search) {
          return true;
        }
        return show.title.toLowerCase()
          .indexOf(search.toLowerCase()) !== -1
      })
      this.setState(prevState => ({
        shows: prevState.shows.concat(parsed),
        loading: false,
        hasMorePages: page === 1 ? true : parsed.length === PAGE_SIZE
      }))
    })
  }

  render() {
    const {loading, genre, sort, shows, search, hasMorePages} = this.state;
    return (
      <Fragment>
        <Main>
          {/* <HomeHeading /> */}
          <LastWatched />
          <div className="grid-header">
            <section className="title">
              <h2>{search ? 'Resultados de búsqueda' : 'Catálogo de series'}</h2>
              <p>Mostrando {shows.length} series</p>
            </section>
            <SelectWrapper>
              <label htmlFor="genre">Género</label>
              <Select
                isSearchable={false}
                value={genre}
                name="genre"
                options={config.genreOptions}
                onChange={this.handleGenreChange}
              />
            </SelectWrapper>
            <SelectWrapper>
              <label htmlFor="sort">Ordenar por</label>
              <Select
                isSearchable={false}
                value={sort}
                name="sort"
                options={config.sortOptions}
                onChange={this.handleSortChange}
              />
            </SelectWrapper>
          </div>
          <Grid>
            {shows.map(show => (
              <Link to={`/show/${show._id}`} className="show" key={show._id}>
                <img alt="poster" src={show.images.fanart} />
                <div className="title">{show.title}</div>
              </Link>
            ))}
          </Grid>
        </Main>
        {loading ?
          <Spinner /> :
          hasMorePages && (
            <div style={{height: 1}}>
              <Waypoint scrollableAncestor={window} onEnter={this.handleNextPage} />
            </div>
          )
        }
        <Footer>Palomitas v4. 2018</Footer>
      </Fragment>
    );
  }
}

export default Home;
