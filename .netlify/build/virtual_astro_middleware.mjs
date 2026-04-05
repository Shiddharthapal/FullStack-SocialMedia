import { c as connect } from './chunks/connection_CMlIs3zC.mjs';
import { ah as sequence } from './chunks/sequence_CQ89Ml5V.mjs';

const onRequest$1 = async (_, next) => {
  await connect();
  return next();
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
