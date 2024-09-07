import mitt from "mitt";

const emitter = mitt();

export const useMittBus = () => {
  return emitter;
};
