import React, { useEffect } from 'react';
import { BASE_URL } from '@/services/apiSWR';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const PostCarousel = ({ images, onSlideChange, api, setApi }) => {

  useEffect(() => {
    if (!api) return;
    api.on('select', () => {
        const newSlide = api.selectedScrollSnap();
        onSlideChange(newSlide);
    });
}, [api, onSlideChange]);

  return (
    <Carousel className="w-xl" setApi={setApi}>
      <CarouselContent>
        {images?.map((image, index) => (
          <CarouselItem key={index}>
            <div className="w-screen px-4 aspect-square">
              <img
                src={`${BASE_URL}/uploads/${image}`}
                alt=""
                className="h-full w-full wg-rounded object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default PostCarousel; 