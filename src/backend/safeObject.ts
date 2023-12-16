function safeObject<T>(unsafeObject: any, props: string[]): T {
  const safe: {[x: string]: any} = {};
  for (let i = 0; i < props.length; i++) {
    if (unsafeObject[props[i]] instanceof Map) {
      safe[props[i]] = Object.fromEntries(unsafeObject[props[i]]);
    } else {
      safe[props[i]] = unsafeObject[props[i]] !== (null || undefined) ? unsafeObject[props[i]] : null;
    }
  }
  return safe as T;
}

export default safeObject;
