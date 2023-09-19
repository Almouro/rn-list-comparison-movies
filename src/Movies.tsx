import React, {memo, useRef} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {IMAGE_SIZE, Movie, Playlist, getImageUrl} from './api';
import {playlists as playlistData} from './api/data/playlist';
import {useRememberListScroll} from './useRememberListScroll';

const cardStyles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE.width,
    height: IMAGE_SIZE.height,
    borderRadius: 5,
  },
});

const __MoviePortrait = ({movie}: {movie: Movie}) => {
  return (
    <Image
      source={{uri: getImageUrl(movie.poster_path)}}
      style={cardStyles.image}
    />
  );
};

const __MarginBetweenItems = () => <View style={{width: margins.s}} />;

const USE_FLASHLIST = true;
const ListComponent = USE_FLASHLIST ? FlashList : FlatList;

const MoviePortrait = USE_FLASHLIST ? __MoviePortrait : memo(__MoviePortrait);
const MarginBetweenItems = USE_FLASHLIST
  ? __MarginBetweenItems
  : memo(__MarginBetweenItems);

const margins = {
  s: 5,
  m: 10,
  l: 20,
};

/**
 * See https://shopify.github.io/flash-list/docs/fundamentals/performant-components/#remove-key-prop
 */
const movieKeyExtractor = USE_FLASHLIST
  ? (movie: Movie, index: number) => index.toString()
  : (movie: Movie) => movie.id.toString();

const rowStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: margins.m,
    marginBottom: margins.s,
  },
  container: {
    minHeight: cardStyles.image.height,
    marginBottom: margins.l,
  },
  listContainer: {
    paddingHorizontal: margins.m,
  },
});

const __MovieRow = ({playlist}: {playlist: Playlist}) => {
  const movies = playlistData[playlist.id]();
  const listRef = useRef<FlatList<Movie>>(null);

  const {onMomentumScrollBegin, onScroll} = useRememberListScroll(
    listRef,
    playlist.id,
  );

  return (
    <>
      <Text numberOfLines={1} style={rowStyles.title}>
        {playlist.title}
      </Text>
      <View style={rowStyles.container}>
        <ListComponent
          contentContainerStyle={rowStyles.listContainer}
          keyExtractor={movieKeyExtractor}
          ItemSeparatorComponent={MarginBetweenItems}
          horizontal
          estimatedItemSize={cardStyles.image.width}
          data={movies}
          renderItem={({item}: {item: Movie}) => <MoviePortrait movie={item} />}
          ref={listRef}
          onMomentumScrollBegin={onMomentumScrollBegin}
          onScroll={onScroll}
        />
      </View>
    </>
  );
};

const MovieRow = USE_FLASHLIST ? __MovieRow : memo(__MovieRow);

const listStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    paddingVertical: margins.m,
  },
});

const App = () => {
  const playlists = require('./api/data/rows.json');

  return (
    <ListComponent
      data={playlists}
      keyExtractor={(playlist: Playlist) => playlist.id}
      estimatedItemSize={cardStyles.image.height + 25}
      renderItem={({item: playlist}: {item: Playlist}) => (
        <MovieRow playlist={playlist} />
      )}
      contentContainerStyle={listStyles.container}
    />
  );
};

export default App;
