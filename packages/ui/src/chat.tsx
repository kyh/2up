import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "./utils";

export type MessageProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const Message = ({ children, className, ...props }: MessageProps) => (
  <div className={cn("flex justify-start gap-3", className)} {...props}>
    {children}
  </div>
);

export type MessageAvatarProps = {
  src: string;
  alt: string;
  fallback?: string;
  delayMs?: number;
  className?: string;
};

const MessageAvatar = ({
  src,
  alt,
  fallback,
  delayMs,
  className,
}: MessageAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      <AvatarImage src={src} alt={alt} />
      {fallback && (
        <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>
      )}
    </Avatar>
  );
};

export type MessageContentProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "text-muted-foreground bg-muted/40 max-w-[85%] flex-1 rounded-lg p-2 break-words whitespace-normal shadow-lg backdrop-blur-xs sm:max-w-[75%]",
    className,
  );

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

const useAutoScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const lastScrollTopRef = useRef(0);
  const autoScrollingRef = useRef(false);

  const isAtBottom = (element: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element;
    return scrollHeight - scrollTop - clientHeight <= 2;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;

    autoScrollingRef.current = true;

    const targetScrollTop = container.scrollHeight - container.clientHeight;

    if (behavior === "smooth") {
      container.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });

      const checkScrollEnd = () => {
        if (Math.abs(container.scrollTop - targetScrollTop) < 2) {
          autoScrollingRef.current = false;
          return;
        }

        requestAnimationFrame(checkScrollEnd);
      };

      requestAnimationFrame(checkScrollEnd);

      const safetyTimeout = setTimeout(() => {
        autoScrollingRef.current = false;
      }, 500);

      try {
        const handleScrollEnd = () => {
          autoScrollingRef.current = false;
          clearTimeout(safetyTimeout);
          container.removeEventListener("scrollend", handleScrollEnd);
        };

        container.addEventListener("scrollend", handleScrollEnd, {
          once: true,
        });
      } catch (e) {
        // scrollend event not supported in this browser, fallback to requestAnimationFrame
      }
    } else {
      container.scrollTop = targetScrollTop;
      autoScrollingRef.current = false;
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    lastScrollTopRef.current = container.scrollTop;

    const handleScroll = () => {
      if (autoScrollingRef.current) return;

      const currentScrollTop = container.scrollTop;

      if (currentScrollTop < lastScrollTopRef.current && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }

      if (isAtBottom(container) && !autoScrollEnabled) {
        setAutoScrollEnabled(true);
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }
    };

    const handleTouchStart = () => {
      lastScrollTopRef.current = container.scrollTop;
    };

    const handleTouchMove = () => {
      if (container.scrollTop < lastScrollTopRef.current && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }

      lastScrollTopRef.current = container.scrollTop;
    };

    const handleTouchEnd = () => {
      if (isAtBottom(container) && !autoScrollEnabled) {
        setAutoScrollEnabled(true);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, enabled, autoScrollEnabled]);

  return {
    autoScrollEnabled,
    scrollToBottom,
    isScrolling: autoScrollingRef.current,
  };
};

export type MessagesContainerProps = {
  children: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
  scrollToRef?: React.RefObject<HTMLDivElement | null>;
  ref?: React.RefObject<HTMLDivElement | null>;
} & React.HTMLAttributes<HTMLDivElement>;

const MessagesContainer = ({
  className,
  children,
  autoScroll = true,
  scrollToRef,
  ref,
  ...props
}: MessagesContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const localBottomRef = useRef<HTMLDivElement>(null);
  const bottomRef = scrollToRef || localBottomRef;
  const MessagesContainerRef = ref || containerRef;

  const { autoScrollEnabled, scrollToBottom, isScrolling } = useAutoScroll(
    MessagesContainerRef,
    autoScroll,
  );

  useEffect(() => {
    if (autoScroll && autoScrollEnabled && !isScrolling) {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    }
  }, [children, autoScroll, autoScrollEnabled, isScrolling, scrollToBottom]);

  return (
    <div
      className={cn("flex flex-col overflow-y-auto", className)}
      role="log"
      ref={MessagesContainerRef}
      {...props}
    >
      {children}
      <div
        ref={bottomRef}
        className="h-[1px] w-full flex-shrink-0 scroll-mt-4"
        aria-hidden="true"
      />
    </div>
  );
};

type ChatTextareaProps = {
  className?: string;
  input: string;
  setInput: (input: string) => void;
  onSubmit: () => void;
  isGeneratingResponse: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

const ChatTextarea = ({
  className,
  input,
  setInput,
  onSubmit,
  isGeneratingResponse,
  onFocus,
  onBlur,
}: ChatTextareaProps) => {
  return (
    <div className={cn("bg-background rounded-t-xl p-3", className)}>
      <Textarea
        placeholder="Build a 3d platformer..."
        className="text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="flex items-center gap-2 pt-2">
        <Button
          size="icon"
          className="ml-auto h-8 w-8 rounded-full"
          onClick={onSubmit}
          loading={isGeneratingResponse}
        >
          <ArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessagesContainer,
  ChatTextarea,
};
