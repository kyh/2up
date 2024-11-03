type Condition<Value = unknown> = Value | false | null | undefined | 0 | "";

type IfProps<Value = unknown> = {
  condition: Condition<Value>;
  children: React.ReactNode | ((value: Value) => React.ReactNode);
  fallback?: React.ReactNode;
};

export const If = <Value = unknown,>({
  condition,
  children,
  fallback,
}: IfProps<Value>) => {
  if (condition) {
    if (typeof children === "function") {
      return <>{children(condition)}</>;
    }

    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
};
