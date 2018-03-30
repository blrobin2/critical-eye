import React from "react";

import Form from "./Form";
import FormInput from "./FormInput";
import YearInput from "./YearInput";
import RatingInput from "./RatingInput";
import FormTextarea from "./FormTextarea";

export default function AlbumEditForm({
  onChange,
  artist,
  album,
  spotifyId,
  artwork,
  href,
  dateListened,
  yearReleased,
  rating,
  description
}) {
  return (
    <Form>
      <FormInput
        name="artist"
        type="text"
        label="Artist"
        placeholder="Artist"
        required={true}
        value={artist}
        onChange={onChange}
      />
      <FormInput
        type="text"
        name="album"
        label="Album"
        placeholder="Album"
        required={true}
        value={album}
        onChange={onChange}
      />
      <FormInput
        type="text"
        name="spotifyId"
        label="Spotify ID"
        placeholder="Spotify ID"
        required={true}
        value={spotifyId}
        onChange={onChange}
      />
      <FormInput
        type="url"
        name="artwork"
        label="Artwork URL"
        placeholder="https://"
        value={artwork}
        onChange={onChange}
      />
      <FormInput
        type="url"
        name="href"
        label="Listen URL"
        placeholder="https://"
        value={href}
        onChange={onChange}
      />
      <FormInput
        type="datetime-local"
        name="dateListened"
        label="Date Listened"
        value={dateListened}
        required={true}
        onChange={onChange}
      />
      <YearInput
        name="yearReleased"
        label="Year Released"
        value={yearReleased}
        onChange={onChange}
      />
      <RatingInput value={rating} onChange={onChange} />
      <FormTextarea
        name="description"
        label="Description"
        value={description}
        onChange={onChange}
      />
    </Form>
  );
}
