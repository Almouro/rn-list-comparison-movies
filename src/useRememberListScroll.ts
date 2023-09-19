import {useEffect, useRef} from 'react';
import {FlatList} from 'react-native';

const scrollOffsets: {[key: string]: number} = {};

export const useRememberListScroll = <T>(
  listRef: React.RefObject<FlatList<T>>,
  rowId: string,
) => {
  const currentScrollOffset = useRef<number>(0);
  const startedScrollingWithIdRef = useRef<string | null>(null);

  useEffect(() => {
    const targetScrollOffset = scrollOffsets[rowId] || 0;
    if (currentScrollOffset.current !== targetScrollOffset) {
      listRef.current?.scrollToOffset({
        offset: targetScrollOffset,
        animated: false,
      });
    }
    // listRef should be a ref and not change though
  }, [rowId, listRef]);

  return {
    onMomentumScrollBegin: () => {
      startedScrollingWithIdRef.current = rowId;
    },
    onScroll: (event: {nativeEvent: {contentOffset: {x: number}}}) => {
      const scrollOffset = event.nativeEvent.contentOffset.x;
      currentScrollOffset.current = scrollOffset;
      if (startedScrollingWithIdRef.current === rowId) {
        scrollOffsets[rowId] = scrollOffset;
      }
    },
  };
};
