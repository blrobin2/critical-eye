import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import { albumSearch, getAlbumReleaseYear } from "./api";
import { getAlbums, addAlbum, updateAlbum, deleteAlbum, getLastId } from "./db";
import { numberToStars, humanDate, urlToImage } from "./util";

import AlbumSearch from "./AlbumSearch";
import CustomModalBody from "./CustomModalBody";
import YearInput from "./YearInput";
import RatingInput from "./RatingInput";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";

export default class AlbumTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      currentAlbum: this.defaultCurrentAlbum(),
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
      paginationShowsTotal: this.getShowTotals,
      btnGroup: this.getButtonGroup,
      insertBtn: this.getInsertButton,
      insertModalHeader: this.addSpotifySearchToModal,
      insertModalBody: this.getCustomModalBody,
      afterInsertRow: this.handleAfterInsertRow,
      afterDeleteRow: this.handleAfterDeleteRow
    };

    this.cellEditProps = {
      mode: "dbclick",
      blurToSave: true,
      beforeSaveCell: this.saveCell
    };

    this.selectRowProps = {
      mode: "checkbox"
    };
  }

  async componentWillMount() {
    const albums = await getAlbums();
    this.setState({ albums });
  }

  defaultCurrentAlbum = () => ({
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
  });

  getShowTotals = (start, to, total) => {
    return (
      <p>
        Showing <strong>{start}</strong> to <strong>{to}</strong> of{" "}
        <strong>{total}</strong> albums
      </p>
    );
  };

  getButtonGroup = props => (
    <ButtonGroup size="sm">
      {props.exportCSVBtn}
      {props.insertBtn}
      {props.deleteBtn}
      <Button type="button" button-style="primary" onClick={this.clearSort}>
        Clear Sort
      </Button>
    </ButtonGroup>
  );

  getInsertButton = onClick => (
    <Button button-style="info" onClick={onClick}>
      Add Album
    </Button>
  );

  addSpotifySearchToModal = () => (
    <AlbumSearch
      albums={this.state.albumSearch}
      onSearch={this.handleAlbumSearch}
      onReview={this.selectAlbumToReview}
    />
  );

  getCustomModalBody = (onClose, onSave) => (
    <CustomModalBody onSave={onSave} {...this.state.currentAlbum} />
  );

  getYearInput = (column, attrs) => (
    <YearInput
      name="yearReleased"
      label="Year Released"
      sronly="true"
      {...attrs}
    />
  );

  getRatingInput = (column, attrs) => <RatingInput sronly="true" {...attrs} />;

  handleAlbumSearch = async query => {
    const albums = await albumSearch(query);
    this.setState({ albumSearch: albums });
  };

  selectAlbumToReview = async album => {
    const [yearReleased, lastId] = await Promise.all([
      getAlbumReleaseYear(album.spotifyId),
      getLastId()
    ]);
    this.setState({
      currentAlbum: Object.assign({}, album, { id: lastId + 1, yearReleased }),
      albumSearch: []
    });
  };

  handleAfterInsertRow = async album => {
    await addAlbum(album);
    this.setState(prevState => ({
      albums: prevState.albums.concat(album),
      currentAlbum: this.defaultCurrentAlbum()
    }));
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
        <TableHeaderColumn dataField="artwork" dataFormat={urlToImage}>
          Artwork
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="rating"
          dataFormat={numberToStars}
          dataSort={true}
          caretRender={this.getCaret}
          customEditor={{ getElement: this.getRatingInput }}
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
          dataFormat={humanDate}
          dataSort={true}
          caretRender={this.getCaret}
          editable={{ type: "datetime-local" }}
        >
          Date Listened
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="yearReleased"
          dataSort={true}
          caretRender={this.getCaret}
          customEditor={{ getElement: this.getYearInput }}
        >
          Year Released
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="description"
          editable={{ type: "textarea" }}
        >
          Description
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
