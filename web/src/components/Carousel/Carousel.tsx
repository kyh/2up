import { ReactNode } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import { theme, isDesktop } from "styles/theme";
import { bounceExpand, bounceContract } from "styles/animations";

import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";

SwiperCore.use([Navigation]);

type Props = {
  children: ReactNode;
};

export const Carousel = ({ children }: Props) => {
  return (
    <CarouselContainer
      slidesPerView={isDesktop() ? 3 : 2}
      slidesPerGroup={isDesktop() ? 3 : 2}
      navigation
      loop
      loopFillGroupWithBlank
    >
      {children}
    </CarouselContainer>
  );
};

export const CarouselContainer = styled(Swiper)`
  width: 100%;
  height: 20rem;
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .swiper-button-prev {
    left: 0;
  }
  .swiper-button-next {
    right: 0;
  }
  .swiper-button-prev,
  .swiper-button-next {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    padding: ${theme.spacings(1)};
    background-repeat: no-repeat;
    background-size: contain;
    background-image: ${theme.ui.buttonFabBorderUrl};
    background-color: ${theme.ui.background};
    transition: transform 0.2s ease;
    animation: ${bounceContract} 1s;
    &:hover {
      animation: ${bounceExpand} 1s;
      animation-fill-mode: forwards;
      background-image: ${theme.ui.buttonFabBorderActiveUrl};
    }
    &:active {
      animation: ${bounceContract} 1s;
      background-image: ${theme.ui.buttonFabBorderActiveUrl};
    }
    &:disabled {
      filter: brightness(0.5);
      cursor: not-allowed;
      &:hover {
        background-image: ${theme.ui.buttonFabBorderUrl};
      }
    }
    &::after {
      font-size: 1rem;
      color: ${theme.ui.text};
    }
  }
`;

export const CarouselItem = SwiperSlide;
export const RawCarousel = Swiper;
