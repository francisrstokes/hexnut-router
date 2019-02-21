function parseRoutePath(path) {
  const parts = path.split('/').slice(1);
  if (parts[parts.length-1] === '') {
    parts.splice(parts.length-1, 1);
  }
  return parts.map(part => {
    if (part.length > 1 && part[0] === ':') {
      return { type: 'variable', value: part.slice(1) };
    }
    return { type: 'constant', value: part.toLowerCase() };
  });
};

function parseURLPath(path) {
  const parts = path.split('/').slice(1);
  if (parts[parts.length-1] === '') {
    parts.splice(parts.length-1, 1);
  }
  return parts.map(s => s.toLowerCase());
};

const zip = (a1, a2) => a1.map((v, i) => [v, a2[i]]);

const createRoute = path => {
  const parsedPath = parseRoutePath(path);

  return fn => async (ctx, next) => {
    const parsedUrl = parseURLPath(ctx.path);

    if (parsedPath.length !== parsedUrl.length) return await next();

    const params = zip(parsedPath, parsedUrl).reduce((acc, [rp, pp]) => {
      if (acc === null) return acc;
      if (rp.type === 'variable') {
        acc[rp.value] = pp;
      } else if (rp.value !== pp) {
        acc = null;
      }
      return acc;
    }, {});

    if (params === null) return await next();

    ctx.params = params;

    return await fn(ctx, next);
  }
};

module.exports = {
  createRoute,
  route: (path, fn) => createRoute(path)(fn)
};

