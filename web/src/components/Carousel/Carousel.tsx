import {
  ReactNode,
  forwardRef,
  useRef,
  useImperativeHandle,
  Children,
  isValidElement,
  ReactElement,
} from "react";
import styled from "styled-components";
import { theme, useIsDesktop } from "styles/theme";
import { BaseCarousel } from "./BaseCarousel";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";

type Props = {
  children: ReactNode;
  hideControls?: boolean;
  count?: number;
};

const getValidChildren = (children: ReactNode) => {
  return Children.toArray(children).filter((child) =>
    isValidElement(child)
  ) as ReactElement[];
};

export const Carousel = forwardRef(function Carousel(
  { children, count, hideControls }: Props,
  ref
) {
  const desktop = useIsDesktop();
  const carouselRef = useRef<any>(null);

  const slideNext = () => {
    if (carouselRef && carouselRef.current) {
      carouselRef.current.slideNext();
    }
  };

  const slidePrev = () => {
    if (carouselRef && carouselRef.current) {
      carouselRef.current.slidePrev();
    }
  };

  useImperativeHandle(ref, () => ({
    slideNext,
    slidePrev,
  }));

  const childrenLength = getValidChildren(children).length;
  const defaultCount =
    count || desktop
      ? Math.max(childrenLength, 3)
      : Math.max(childrenLength, 2);

  return (
    <CarouselContainer>
      <BaseCarousel count={defaultCount} ref={carouselRef}>
        {children}
      </BaseCarousel>
      {!hideControls && (
        <>
          <PaginationButton className="left" variant="fab" onClick={slidePrev}>
            <Icon icon="leftArrow" />
          </PaginationButton>
          <PaginationButton className="right" variant="fab" onClick={slideNext}>
            <Icon icon="rightArrow" />
          </PaginationButton>
        </>
      )}
    </CarouselContainer>
  );
});

const CarouselContainer = styled.div`
  position: relative;

  .left {
    left: ${theme.spacings(-3)};
  }

  .right {
    right: ${theme.spacings(-3)};
  }
`;

const PaginationButton = styled(Button)`
  position: absolute;
  top: 40%;
  background-color: ${theme.ui.background};
  border-radius: 100%;
`;
