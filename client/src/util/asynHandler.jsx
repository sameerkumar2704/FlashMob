function asyncHandler(func, toast) {
  return (...arg) => {
    func(...arg).catch((err) =>
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error ",
        description: err.message,
      })
    );
  };
}
export { asyncHandler };
