import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useThumbs(mainApi, options) {
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: false, // Tắt dragFree để tránh scroll to end
    ...options,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onClickThumb = useCallback(
    (index) => {
      if (!mainApi || !thumbsApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbsApi]
  ); const onSelect = useCallback(() => {
    if (!mainApi || !thumbsApi) return;
    const selectedSnap = mainApi.selectedScrollSnap();
    setSelectedIndex(selectedSnap);

    // Chỉ scroll khi cần thiết và kiểm soát chặt chẽ hơn
    const slidesInView = thumbsApi.slidesInView();
    const isInView = slidesInView.includes(selectedSnap);

    if (!isInView) {
      thumbsApi.scrollTo(selectedSnap, false);
    }
  }, [mainApi, thumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
  }, [mainApi, onSelect]);

  return {
    onClickThumb,
    thumbsRef,
    thumbsApi,
    selectedIndex,
  };
}
