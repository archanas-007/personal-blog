function OrderedList({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal list-outside">{children}</ol>;
}

export default OrderedList;
