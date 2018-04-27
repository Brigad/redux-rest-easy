const sanitizeId = id => (typeof id === 'number' ? id.toString() : id);

export const areIdsEqual = (id1, id2) => sanitizeId(id1) === sanitizeId(id2);

export const payloadIdsInclude = (payloadIds, id) =>
  payloadIds ? payloadIds.map(sanitizeId).includes(sanitizeId(id)) : false;
