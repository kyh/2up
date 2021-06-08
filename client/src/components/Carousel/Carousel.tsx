import { ReactNode } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import { theme } from "styles/theme";
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
      slidesPerView={3}
      spaceBetween={8}
      slidesPerGroup={3}
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
    transition: transform 0.2s ease;
    padding: ${theme.spacings(1)};
    background-repeat: no-repeat;
    background-size: contain;
    background-image: ${theme.ui.buttonFabBorderUrl};
    animation: ${bounceContract} 1s;
    width: 40px;
    height: 40px;
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
      opacity: 0.5;
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
