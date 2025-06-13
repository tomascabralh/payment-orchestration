export const FailProvider = async () => {
  return {
    status: "fail",
    error: "Transaction failed",
    transaction_id: null,
  };
};
