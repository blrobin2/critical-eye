import React, { Component } from 'react';
import * as classNames from 'classnames';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import {
  getAlbums,
  addAlbum,
  updateAlbum,
  deleteAlbum,
  getLastId
} from "./db";

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            <h1>Critical Eye</h1>
          </div>
          <div className="col-sm-6">
            {/* Import/Export */}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <AlbumTable />
          </div>
        </div>
      </div>
    );
  }
}

class AlbumTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      currentAlbum: {
        id: null,
        spotifyId: null,
        artist: null,
        album: null,
        artwork: null,
        href: null,
        rating: null,
        dateListened: null,
        yearReleased: null,
        description: null
      },
      albumSearch: [],
      sortName: [],
      sortOrder: []
    };

    this.options = {
      defaultSortName: "rating",
      defaultSortOrder: "desc",
      sortName: this.state.sortName,
      sortOrder: this.state.sortOrder,
      clearSearch: true,
      btnGroup: this.createButtonGroup,
      insertBtn: this.getInsertButton,
      insertModalHeader: this.addSpotifySearchToModal,
      insertModalBody: this.addAlbumForm,
      afterInsertRow: this.handleAfterInsertRow,
      afterDeleteRow: this.handleAfterDeleteRow
    };

    this.cellEditProps = {
      mode: "click",
      blurToSave: true,
      beforeSaveCell: this.saveCell
    };

    this.selectRowProps = {
      mode: "checkbox"
    };

    this.defaultCurrentAlbum = this.defaultCurrentAlbum.bind(this);
    this.handleAlbumSearch = this.handleAlbumSearch.bind(this);
    this.getAlbumReleaseYear = this.getAlbumReleaseYear.bind(this);
    this.selectAlbumToReview = this.selectAlbumToReview.bind(this);
  }

  async componentWillMount() {
    const albums = await getAlbums();
    this.setState({ albums });
  }

  defaultCurrentAlbum() {
    return {
      id: null,
      spotifyId: null,
      artist: null,
      album: null,
      artwork: null,
      href: null,
      rating: null,
      dateListened: null,
      yearReleased: null,
      description: null
    };
  };

  addSpotifySearchToModal = (onClose, onSave) => {
    return (
      <AlbumSearch
        albums={this.state.albumSearch}
        onSearch={this.handleAlbumSearch}
        onReview={this.selectAlbumToReview}
      />
    );
  };

  addAlbumForm = (onClose, onSave) => {
    return <AlbumEditForm onSave={onSave} {...this.state.currentAlbum} />;
  };

  getInsertButton = onClick => {
    return (
      <Button button-style="info" onClick={onClick}>
        Add Album
      </Button>
    );
  };

  createButtonGroup = props => {
    return (
      <ButtonGroup size="sm">
        {props.exportCSVBtn}
        {props.insertBtn}
        {props.deleteBtn}
        <Button
          type="button"
          button-style="primary"
          onClick={this.clearSort}
        >
          Clear Sort
        </Button>
      </ButtonGroup>
    );
  }

  handleAfterInsertRow = (album) => {
    addAlbum(album).then(() => {
      this.setState(prevState => ({
        albums: prevState.albums.concat(album),
        currentAlbum: this.defaultCurrentAlbum()
      }));
    });
  };

  saveCell = (album, field, value) => {
    updateAlbum(Object.assign({}, album, { [field]: value }));
  };

  handleAfterDeleteRow = ids => {
    ids.forEach(id => deleteAlbum(+id));
  };

  clearSort = () => {
    this.setState({
      sortName: [],
      sortOrder: []
    });
  };

  async handleAlbumSearch(query) {
    const search_json = await fetch(`/search?q=${query}`);
    const search_results = await search_json.json();

    if (search_results.message) {
      alert(search_results.message);
      return;
    }

    const formatted = search_results.albums.items.map(album => ({
      spotifyId: album.id,
      artist: album.artists.map(artist => artist.name).join(","),
      album: album.name,
      href: album.external_urls.spotify,
      artwork: album.images[2].url
    }));

    this.setState({ albumSearch: formatted });
  }

  async getAlbumReleaseYear(spotifyId) {
    const album_json = await fetch(`/album/${spotifyId}`);
    const response = await album_json.json();

    if (response.message) {
      alert(response.message);
      return;
    }

    const [releaseYear] = response.album.release_date.split("-");
    return releaseYear;
  }

  async selectAlbumToReview(album) {
    const yearReleased = await this.getAlbumReleaseYear(album.spotifyId);
    const lastId = await getLastId();
    this.setState({
      currentAlbum: Object.assign({}, album, { id: lastId + 1, yearReleased }),
      albumSearch: []
    });
  }

  numberToStars = num => {
    const wholes = Math.floor(num);
    const remainder = (num % 1).toString().split(".")[1];
    let rating = "★".repeat(wholes);
    if (remainder) {
      rating += "." + remainder;
    }

    return rating;
  };

  urlToImage = (url, album) => {
    return <img src={url} alt={`${album.artist}: ${album.album}`} />;
  };

  humanDate = date => {
    //return new Date(date).toDateString();
    const dateObj = new Date(date);
    // month is 0-11, for no good reason
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    return year + "/" + month + "/" + day;
  };

  getCaret = direction => {
    const upArrow = " \u25B4 ";
    const downArrow = " \u25BE ";
    switch (direction) {
      case "asc":
        return upArrow;
      case "desc":
        return downArrow;
      default:
        return `${upArrow}/${downArrow}`;
    }
  };

  render() {
    return (
      <BootstrapTable
        data={this.state.albums}
        options={this.options}
        cellEdit={this.cellEditProps}
        multiColumnSort={3}
        striped
        search
        pagination
        insertRow={true}
        deleteRow={true}
        selectRow={this.selectRowProps}
        version="4"
      >
        <TableHeaderColumn isKey={true} hidden dataField="id">
          ID
        </TableHeaderColumn>
        <TableHeaderColumn hidden dataField="spotifyId">
          Spotify ID
        </TableHeaderColumn>
        <TableHeaderColumn dataField="artwork" dataFormat={this.urlToImage}>
          Artwork
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="rating"
          dataFormat={this.numberToStars}
          dataSort={true}
          caretRender={this.getCaret}
        >
          Rating
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="artist"
          dataSort={true}
          caretRender={this.getCaret}
        >
          Artist
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="album"
          dataSort={true}
          caretRender={this.getCaret}
        >
          Album
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="dateListened"
          dataFormat={this.humanDate}
          dataSort={true}
          caretRender={this.getCaret}
        >
          Date Listened
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="yearReleased"
          dataSort={true}
          caretRender={this.getCaret}
        >
          Year Released
        </TableHeaderColumn>
        <TableHeaderColumn dataField="description" hidden>
          Description
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}


class AlbumSearch extends Component {
  render() {
    return <div>
        <AlbumSearchForm onSearch={this.props.onSearch} />
        <AlbumSearchResults
          albums={this.props.albums}
          onReview={this.props.onReview}
        />
      </div>;
  }
}

class AlbumSearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      q: ""
    };
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    this.props.onSearch(this.state.q);
  };

  render() {
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormInput
          name="q"
          type="text"
          placeholder="Album Name"
          label="Album Name"
          sronly="true"
          value={this.state.q}
          onChange={this.handleChange}
        />
        <Button
          type="button"
          button-style="primary"
          onClick={this.handleSubmit}
        >
          Search
        </Button>
      </Form>
    );
  }
}

class FormTextarea extends Component {
  render() {
    return (
      <div className="form-group">
        <label
          htmlFor={this.props.name}
        >
          {this.props.label}
        </label>
        <textarea
          id={this.props.name}
          name={this.props.name}
          className="form-control"
          value={this.props.value}
          onChange={this.props.onChange}
        ></textarea>
      </div>
    )
  }
}

class FormInput extends Component {
  render() {
    const labelClasses = classNames({
      "sr-only": !! this.props.sronly
    })
    return (
      <div className="form-group">
        <label
          htmlFor={this.props.name}
          className={labelClasses}
        >
          {this.props.label}
        </label>
        <input
          id={this.props.name}
          className="form-control"
          onChange={this.props.onChange}
          {...this.props}
        />
      </div>
    )
  }
}

class Form extends Component {
  render() {
    const formClasses = {
      form: true,
      [`form-${this.props.layout}`]: !!this.props.layout,
    };
    if (this.props.additionalClasses) {
      this.props.additionalClasses.split(' ').forEach(clazz => {
        formClasses[clazz] = true;
      });
    }
    return (
      <form className={classNames(formClasses)}>
        {this.props.children}
      </form>
    )
  }
}

class AlbumSearchResults extends Component {
  render() {
    return (
      <ul className="search-results">
        {this.props.albums.map(album =>
          <AlbumSearchResultItem
            key={album.spotifyId}
            onReview={this.props.onReview}
            {...album}
          />
        )}
      </ul>
    )
  }
}

class AlbumSearchResultItem extends Component {
  handleReviewClick = () => {
    this.props.onReview(this.props);
  };

  render() {
    return (
      <li className="result">
        <img
          src={this.props.artwork}
          alt={`${this.props.artist}: ${this.props.album}`}
          width={this.props.artworkWidth}
        />
        {' '}
        {this.props.artist}: {this.props.album}
        <br/>
        <ButtonGroup size="sm" alignment="right">
          <LinkButton size="sm" button-style="success" href={this.props.href}>
            Listen
          </LinkButton>
          <Button size="sm" button-style="info" onClick={this.handleReviewClick}>
            Review
          </Button>
        </ButtonGroup>
      </li>
    );
  }
}

class ButtonGroup extends Component {
  render() {
    const btnGroupClasses = classNames({
      "btn-group": true,
      [`btn-group-${this.props.size}`]: !!this.props.size,
      //[`text-${this.props.alignment}`]: !!this.props.alignment
    });
    return (
      <div
        className={btnGroupClasses}
        role="group"
        aria-label="..."
      >
        {this.props.children}
      </div>
    )
  }
}

class Button extends Component {
  render() {
    const btnClass = classNames({
      btn: true,
      [`btn-${this.props.size}`]: !!this.props.size,
      [`btn-${this.props["button-style"]}`]: !!this.props["button-style"]
    });
    return (
      <button className={btnClass} type={this.props.type || 'button'} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}

class LinkButton extends Component {
  render() {
    const btnClass = classNames({
      btn: true,
      "text-white": true,
      [`btn-${this.props.size}`]: !! this.props.size,
      [`btn-${this.props["button-style"]}`]: !!this.props["button-style"]
    });
    return (
      <a
        className={btnClass}
        href={this.props.href}
        target="_blank"
      >
        {this.props.children}
      </a>
    );
  }
}

class AlbumEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(this.props);
  }

  getInitialState = (props = {}) => ({
    id: props.id || 0,
    artist: props.artist || "",
    album: props.album || "",
    spotifyId: props.spotifyId || "",
    artwork: props.artwork || "",
    href: props.href || "",
    dateListened: props.dateListened || new Date().toISOString().slice(0, -8),
    yearReleased: props.yearReleased || new Date().getFullYear(),
    rating: props.rating || 2.5,
    description: props.description || ""
  });

  componentWillReceiveProps(nextProps) {
    this.setState(this.getInitialState(nextProps));
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getFieldValue() {
    const album = this.state;
    return album;
  }

  render() {
    return (
      <Form>
        <FormInput
          name="artist"
          type="text"
          label="Artist"
          placeholder="Artist"
          required={true}
          value={this.state.artist}
          onChange={this.handleChange}
        />
        <FormInput
          type="text"
          name="album"
          label="Album"
          placeholder="Album"
          required={true}
          value={this.state.album}
          onChange={this.handleChange}
        />
        <FormInput
          type="text"
          name="spotifyId"
          label="Spotify ID"
          placeholder="Spotify ID"
          required={true}
          value={this.state.spotifyId}
          onChange={this.handleChange}
        />
        <FormInput
          type="url"
          name="artwork"
          label="Artwork URL"
          placeholder="https://"
          value={this.state.artwork}
          onChange={this.handleChange}
        />
        <FormInput
          type="url"
          name="href"
          label="Listen URL"
          placeholder="https://"
          value={this.state.href}
          onChange={this.handleChange}
        />
        <FormInput
          type="datetime-local"
          name="dateListened"
          label="Date Listened"
          value={this.state.dateListened}
          required={true}
          onChange={this.handleChange}
        />
        <FormInput
          type="number"
          name="yearReleased"
          label="Year Released"
          placeholder="2018"
          min="1900"
          step="1"
          value={this.state.yearReleased}
          onChange={this.handleChange}
        />
        <FormInput
          type="number"
          name="rating"
          label="Rating"
          placeholder="2.5"
          min="0"
          max="5"
          step="0.5"
          value={this.state.rating}
          onChange={this.handleChange}
        />
        <FormTextarea
          name="description"
          label="Description"
          value={this.state.description}
          onChange={this.handleChange}
        />
      </Form>
    );
  }
}

export default App;
